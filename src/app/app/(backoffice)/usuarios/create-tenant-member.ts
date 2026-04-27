"use server";

import { revalidatePath } from "next/cache";
import { AuthApiError } from "@supabase/supabase-js";
import { getPrisma } from "@/lib/prisma";
import { requirePublicSiteMembersManager } from "@/lib/permissions/site-permissions";
import { ALL_SITE_PERMISSIONS } from "@/lib/permissions/site-permission-logic";
import type { SitePermission } from "@/generated/prisma/client";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { resolveAuthEmail } from "@/lib/auth/login-identity";
import {
  userProfileExtrasToPrismaData,
  type ParsedUserProfileExtras,
} from "@/lib/users/user-profile-extras";

const GENERIC = "Não foi possível concluir. Tente de novo.";

export type CreateMemberResult = { ok: true } | { ok: false; message: string };

function isDuplicateEmailAuthError(err: unknown): boolean {
  if (err instanceof AuthApiError) {
    const m = (err.message ?? "").toLowerCase();
    return m.includes("already been registered") || m.includes("already registered");
  }
  const m = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return m.includes("already been registered") || m.includes("already registered");
}

export async function createTenantMemberAction(input: {
  emailOrLogin: string;
  password: string;
  role: "MEMBER" | "ADMIN";
  permissions: readonly SitePermission[];
  profile: ParsedUserProfileExtras;
}): Promise<CreateMemberResult> {
  const { tenantId } = await requirePublicSiteMembersManager();
  const authEmail = resolveAuthEmail(input.emailOrLogin);
  if (!authEmail) {
    return { ok: false, message: "Indique um login ou e-mail válido." };
  }
  if (input.password.length < 8) {
    return { ok: false, message: "A senha deve ter pelo menos 8 caracteres." };
  }
  if (input.role !== "MEMBER" && input.role !== "ADMIN") {
    return { ok: false, message: "Papel inválido." };
  }

  let perms = input.permissions.filter((p) => ALL_SITE_PERMISSIONS.includes(p));
  if (input.role === "ADMIN") {
    perms = [...ALL_SITE_PERMISSIONS];
  }
  if (input.role === "MEMBER" && perms.length === 0) {
    return { ok: false, message: "Selecione pelo menos uma área de acesso." };
  }

  let newUserId: string | null = null;
  let createdAuthUser = false;

  try {
    const admin = createSupabaseAdminClient();
    const rawLogin = input.emailOrLogin.trim();
    const { data, error } = await admin.auth.admin.createUser({
      email: authEmail,
      password: input.password,
      email_confirm: true,
      user_metadata: { login: rawLogin },
    });

    if (error) {
      if (!isDuplicateEmailAuthError(error)) {
        return { ok: false, message: error.message || GENERIC };
      }
      const profile = await getPrisma().userProfile.findFirst({
        where: { email: { equals: authEmail, mode: "insensitive" } },
      });
      if (!profile) {
        return {
          ok: false,
          message:
            "Este login ou e-mail já está registado. Peça ao utilizador para iniciar sessão uma vez neste site antes de ser associado à equipe, ou contacte o suporte.",
        };
      }
      newUserId = profile.id;
    } else if (data.user) {
      newUserId = data.user.id;
      createdAuthUser = true;
    } else {
      return { ok: false, message: GENERIC };
    }

    const existingMember = await getPrisma().tenantMember.findUnique({
      where: { tenantId_userId: { tenantId, userId: newUserId } },
    });
    if (existingMember) {
      if (createdAuthUser) {
        await admin.auth.admin.deleteUser(newUserId);
      }
      return { ok: false, message: "Este utilizador já pertence à equipe." };
    }

    const prof = userProfileExtrasToPrismaData(input.profile);
    await getPrisma().$transaction(async (tx) => {
      await tx.userProfile.upsert({
        where: { id: newUserId! },
        create: { id: newUserId!, email: authEmail, ...prof },
        update: { email: authEmail, ...prof },
      });
      await tx.tenantMember.create({
        data: {
          tenantId,
          userId: newUserId!,
          role: input.role,
          permissions: input.role === "ADMIN" ? [...ALL_SITE_PERMISSIONS] : perms,
        },
      });
    });

    revalidatePath("/app/usuarios");
    revalidatePath("/app");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    if (createdAuthUser && newUserId) {
      try {
        const admin = createSupabaseAdminClient();
        await admin.auth.admin.deleteUser(newUserId);
      } catch {
        /* ignore rollback failure */
      }
    }
    console.error(e);
    return { ok: false, message: GENERIC };
  }
}
