/**
 * Sessão assinada (HMAC-SHA256) em cookie — sem e-mail, só utilizador e palavra-passe.
 * Necessita SIMPLE_AUTH_SECRET (mín. 16 caracteres). Usável em Node e Edge.
 */
const COOKIE = "enoch_painel";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecretForVerify() {
  const s = process.env.SIMPLE_AUTH_SECRET?.trim();
  if (!s || s.length < 16) {
    return null;
  }
  return s;
}

function requireSecretForCreate() {
  const s = getSecretForVerify();
  if (!s) {
    throw new Error("Defina SIMPLE_AUTH_SECRET (mín. 16 caracteres) no ficheiro .env");
  }
  return s;
}

export const SIMPLE_SESSION_COOKIE_NAME = COOKIE;
export { MAX_AGE_SEC as SIMPLE_SESSION_MAX_AGE_SEC };

/**
 * UUID do utilizador do painel (Prisma `UserProfile.id` / `TenantMember.userId`).
 * Aceita UUID com hífens ou 32 hex sem hífens. Valores de outro tamanho são ignorados.
 */
export function getSimpleAuthUserId() {
  const v = process.env.SIMPLE_AUTH_USER_ID?.trim();
  if (!v) {
    return "00000000-0000-4000-8000-000000000001";
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)) {
    return v.toLowerCase();
  }
  if (/^[0-9a-f]{32}$/i.test(v)) {
    const s = v.toLowerCase();
    return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
  }
  return "00000000-0000-4000-8000-000000000001";
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

/** Expirar o cookie de sessão do painel (logout / sessão inválida). */
export function getSessionCookieClearOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

function utf8ToB64u(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) {
    bin += String.fromCharCode(b);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uToUtf8(s: string) {
  const pad = 4 - (s.length % 4);
  const b64 = (pad === 4 ? s : s + "=".repeat(pad)).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function hmacB64u(body: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const b = new Uint8Array(sig);
  let bin2 = "";
  for (const x of b) {
    bin2 += String.fromCharCode(x);
  }
  return btoa(bin2).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeSigEq(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return d === 0;
}

type Payload = { v: 1; exp: number; login: string; userId?: string };

export async function createSessionValue(login: string, userId?: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload: Payload = { v: 1, exp, login: login.trim() };
  const uid = userId?.trim();
  if (uid) {
    payload.userId = uid;
  }
  const body = utf8ToB64u(JSON.stringify(payload));
  const sig = await hmacB64u(body, requireSecretForCreate());
  return `${body}.${sig}`;
}

export async function verifySessionValue(token: string | undefined) {
  const secret = getSecretForVerify();
  if (!token || !secret) {
    return null;
  }
  const dot = token.lastIndexOf(".");
  if (dot === -1) {
    return null;
  }
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacB64u(body, secret);
  if (!safeSigEq(sig, expected)) {
    return null;
  }
  let data: Payload;
  try {
    data = JSON.parse(b64uToUtf8(body)) as Payload;
  } catch {
    return null;
  }
  if (data.v !== 1 || !data.login) {
    return null;
  }
  if (data.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return { login: data.login, userId: data.userId };
}
