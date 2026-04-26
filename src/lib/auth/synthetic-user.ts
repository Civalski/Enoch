import type { User } from "@supabase/supabase-js";
import {
  normalizeLogin,
  resolveAuthEmail,
  SIMPLE_AUTH_PLACEHOLDER_DOMAIN,
} from "@/lib/auth/login-identity";
import { getSimpleAuthUserId } from "@/lib/auth/simple-session";

/** Utilizador compatível com o restante código; não vem do Supabase Auth. */
export function buildSessionUserForLogin(sessionLogin: string, sessionUserId?: string): User {
  const id = sessionUserId ?? getSimpleAuthUserId();
  const n = normalizeLogin(sessionLogin) || "admin";
  const email = sessionUserId
    ? resolveAuthEmail(sessionLogin.trim()) || `${n}@${SIMPLE_AUTH_PLACEHOLDER_DOMAIN}`
    : `${n}@${SIMPLE_AUTH_PLACEHOLDER_DOMAIN}`;
  const now = new Date().toISOString();
  return {
    id,
    aud: "authenticated",
    role: "authenticated",
    email,
    email_confirmed_at: now,
    phone: undefined,
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: {},
    user_metadata: { login: sessionLogin.trim() || n },
    identities: undefined,
    factors: undefined,
    created_at: now,
    updated_at: now,
  } as User;
}
