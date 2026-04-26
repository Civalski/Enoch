"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { normalizeLogin, resolveAuthEmail } from "@/lib/auth/login-identity";
import { getAdminLoginNormalized } from "@/lib/auth/admin-master";
import {
  createSessionValue,
  getSessionCookieOptions,
  SIMPLE_SESSION_COOKIE_NAME,
} from "@/lib/auth/simple-session";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";

export type SignInMasterResult = { error: string } | undefined;

function sha256(s: string) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

function safePasswordEqual(input: string, fromEnv: string) {
  const a = sha256(input);
  const b = sha256(fromEnv);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function isMasterLoginAttempt(raw: string): boolean {
  const t = raw.trim();
  if (t.includes("@")) {
    return false;
  }
  return normalizeLogin(t) === getAdminLoginNormalized();
}

const AUTH_FAIL = "Utilizador ou palavra-passe incorretos.";

export async function signInWithMasterAction(input: {
  login: string;
  password: string;
  nextPath: string;
}): Promise<SignInMasterResult> {
  const store = await cookies();

  if (isMasterLoginAttempt(input.login)) {
    const fromEnv = process.env.ADMIN_PASSWORD?.trim();
    if (!fromEnv) {
      return { error: "Falta ADMIN_PASSWORD no ambiente (servidor)." };
    }
    if (!safePasswordEqual(input.password, fromEnv)) {
      return { error: AUTH_FAIL };
    }
    const token = await createSessionValue(input.login.trim());
    store.set(SIMPLE_SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    revalidatePath("/", "layout");
    redirect(safeNextPath(input.nextPath));
  }

  const authEmail = resolveAuthEmail(input.login);
  if (!authEmail) {
    return { error: "Indique um login ou e-mail válido." };
  }

  const supabase = createClient(store);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password: input.password,
  });

  if (error || !data.user) {
    return { error: AUTH_FAIL };
  }

  const publicT = await resolvePublicBlogTenant();
  if (!publicT) {
    await supabase.auth.signOut();
    return { error: AUTH_FAIL };
  }

  const member = await prisma.tenantMember.findFirst({
    where: { userId: data.user.id, tenantId: publicT.id },
  });
  if (!member) {
    await supabase.auth.signOut();
    return { error: AUTH_FAIL };
  }

  await supabase.auth.signOut();

  const token = await createSessionValue(input.login.trim(), data.user.id);
  store.set(SIMPLE_SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  revalidatePath("/", "layout");
  redirect(safeNextPath(input.nextPath));
}
