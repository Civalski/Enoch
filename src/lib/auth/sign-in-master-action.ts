"use server";

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
import { getPrisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";

export type SignInMasterResult = { error: string } | undefined;

async function sha256(s: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function safePasswordEqual(input: string, fromEnv: string) {
  const a = await sha256(input);
  const b = await sha256(fromEnv);
  if (a.length !== b.length) {
    return false;
  }
  // Constant-time comparison for strings
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return d === 0;
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
    const isPasswordCorrect = await safePasswordEqual(input.password, fromEnv);
    if (!isPasswordCorrect) {
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

  const member = await getPrisma().tenantMember.findFirst({
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
