import { normalizeLogin } from "@/lib/auth/login-identity";
import { getSimpleAuthUserId } from "@/lib/auth/simple-session";
import type { User } from "@supabase/supabase-js";

const DEFAULT_LOGIN = "Thiago";

/**
 * Nome de utilizador admin (comparar com env ADMIN_LOGIN).
 */
export function getAdminLoginNormalized() {
  const raw = (process.env.ADMIN_LOGIN ?? DEFAULT_LOGIN).trim();
  return normalizeLogin(raw || DEFAULT_LOGIN);
}

export function isMasterUser(user: User | null) {
  if (!user) {
    return false;
  }
  return user.id === getSimpleAuthUserId();
}

/** Utilizador da conta de painel (administrador máximo) — não deve aparecer na gestão de equipa nem ser removido. */
export function isMasterPanelTenantUserId(userId: string) {
  return userId === getSimpleAuthUserId();
}
