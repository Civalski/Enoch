const DEFAULT_AUTH_EMAIL_DOMAIN = "conta.enoch.internal";

/**
 * Anexo à sessão de login simples (utilizador@…) — identificador técnico, não é e-mail real.
 * Manter alinhado com `synthetic-user.ts`.
 */
export const SIMPLE_AUTH_PLACEHOLDER_DOMAIN = "painel.local";

/** Domínio interno (utilizador@domínio) — só o Supabase Auth vê; o utilizador insere o nome de utilizador. */
export function getAuthEmailDomain() {
  return process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN?.trim() || DEFAULT_AUTH_EMAIL_DOMAIN;
}

export function normalizeLogin(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

/**
 * E-mail usado no Supabase Auth: um nome de utilizador vira <normalizado>@<domínio interno>.
 */
export function loginToAuthEmail(login: string) {
  const normalized = normalizeLogin(login);
  if (!normalized) {
    return "";
  }
  return `${normalized}@${getAuthEmailDomain()}`;
}

/**
 * O campo de início de sessão: se tiver @, trata-se de e-mail (contas antigas);
 * caso contrário, nome de utilizador interno.
 */
export function resolveAuthEmail(loginOrEmail: string) {
  const t = loginOrEmail.trim();
  if (t.includes("@")) {
    return t.toLowerCase();
  }
  return loginToAuthEmail(t);
}

type AuthUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

/**
 * Rótulo para interface: e-mail “real” ou, para identificadores técnicos
 * (sessão de painel / login→e-mail), só o nome de utilizador — sem @domínio.
 */
export function accountIdentifierForDisplay(stored: string) {
  const raw = (stored ?? "").trim();
  if (!raw.includes("@")) {
    return raw;
  }
  const lower = raw.toLowerCase();
  const at = lower.lastIndexOf("@");
  const local = raw.slice(0, at);
  const host = lower.slice(at + 1);
  if (host === SIMPLE_AUTH_PLACEHOLDER_DOMAIN || host === getAuthEmailDomain().toLowerCase()) {
    return local || raw;
  }
  return raw;
}

/** Texto a mostrar no painel: login humano, nunca endereço técnico `…@painel.local` / interno. */
export function getSessionDisplayName(user: AuthUserLike) {
  const login = user.user_metadata?.login;
  if (typeof login === "string" && login.length > 0) {
    return login;
  }
  return accountIdentifierForDisplay(user.email ?? "");
}
