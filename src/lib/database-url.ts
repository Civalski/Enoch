import { getCloudflareContext } from "@opennextjs/cloudflare";

type HyperdriveLike = { connectionString: string };

function envTruthy(name: string): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function stripWorkerUnsupportedTlsFileParams(connectionString: string): string {
  let s = connectionString.replace(
    /([?&])(sslcert|sslkey|sslrootcert)=[^&]*(?=&|$)/gi,
    (_m, prefix: string) => (prefix === "?" ? "?" : ""),
  );
  s = s.replace(/\?&/, "?");
  s = s.replace(/[?&]$/, "");
  return s;
}

/**
 * Quando verdadeiro, o pool `pg` não exige cadeia de confiança (ver `prisma-factory`).
 * - `next dev` (`NODE_ENV=development`): activo por omissão (proxies / certificados internos).
 * - `next start` / Workers: só com `DATABASE_SSL_INSECURE`; ou desactivar relax em dev com `DATABASE_SSL_STRICT`.
 */
export function isDatabaseSslInsecure(): boolean {
  if (envTruthy("DATABASE_SSL_STRICT")) {
    return false;
  }
  if (envTruthy("DATABASE_SSL_INSECURE")) {
    return true;
  }
  return process.env.NODE_ENV === "development";
}

/**
 * Cloudflare Workers block TCP to localhost, RFC1918, etc. The runtime surfaces
 * that as: "proxy request failed, cannot connect to the specified address".
 * @see https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/#troubleshooting
 */
function assertPostgresHostReachableFromWorkers(connectionString: string): void {
  let hostname: string;
  try {
    const normalized = connectionString.replace(/^postgresql(\+[a-z]+)?:/i, "http:");
    hostname = new URL(normalized).hostname;
  } catch {
    return;
  }
  if (!hostname) return;
  const disallowed =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost") ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname);
  if (disallowed) {
    throw new Error(
      `Postgres host "${hostname}" cannot be reached over TCP from Cloudflare Workers (use the public Supabase host, Transaction pooler, or Hyperdrive). See Workers TCP troubleshooting: https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/#troubleshooting`,
    );
  }
}

/**
 * Supabase (Prisma + Workers): manter TLS activo sem impor `verify-full` por omissão.
 * O `pg` actual trata `sslmode=require` como `verify-full`, o que pode falhar com
 * cadeias intermédias do pooler; `uselibpqcompat=true` repõe a semântica libpq
 * (TLS obrigatório, sem verificação rígida de cadeia) até o ecossistema estabilizar.
 * No pooler de transacções (6543 / `*.pooler.supabase.*`), `pgbouncer=true` é obrigatório
 * para o Prisma — sem isto as ligações caem com "Connection terminated unexpectedly".
 */
export function enhanceSupabasePostgresUrl(connectionString: string): string {
  if (!/supabase\.(co|com)/i.test(connectionString)) {
    return connectionString;
  }
  const sslInsecure = isDatabaseSslInsecure();
  let s = connectionString;
  if (sslInsecure) {
    if (/[?&]sslmode=verify-full(?=&|$)/i.test(s)) {
      s = s.replace(/([?&])sslmode=verify-full(?=&|$)/i, "$1sslmode=require");
    } else if (!/sslmode=/i.test(s)) {
      s += (s.includes("?") ? "&" : "?") + "sslmode=require";
    }
  } else if (!/sslmode=/i.test(s)) {
    s += (s.includes("?") ? "&" : "?") + "sslmode=require";
  }
  if (
    /[?&]sslmode=require(?=&|$)/i.test(s) &&
    !/[?&]uselibpqcompat=true(?=&|$)/i.test(s)
  ) {
    s += "&uselibpqcompat=true";
  }
  const hostPath = s.split("?")[0] ?? s;
  const isTransactionPooler =
    /pooler\.supabase\.(com|co)/i.test(hostPath) || /:6543([/?]|$)/.test(hostPath);
  if (isTransactionPooler && !/[?&]pgbouncer=true(?=&|$)/i.test(s)) {
    s += (s.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return s;
}

/**
 * Resolves the Postgres connection string: Hyperdrive (Workers) when the binding
 * exists, otherwise `DATABASE_URL` (local dev, Vercel, `next build` / SSG).
 */
export function getDatabaseUrl(): string {
  let inWorker = false;
  try {
    const { env } = getCloudflareContext();
    inWorker = true;
    const e = env as { HYPERDRIVE?: HyperdriveLike; DATABASE_URL?: string };
    if (e.HYPERDRIVE?.connectionString) {
      // Não validar host: a string do binding é gerida pelo Hyperdrive e pode não ser um host "público" parseável.
      return stripWorkerUnsupportedTlsFileParams(e.HYPERDRIVE.connectionString);
    }
    if (typeof e.DATABASE_URL === "string" && e.DATABASE_URL.length > 0) {
      const u = stripWorkerUnsupportedTlsFileParams(
        enhanceSupabasePostgresUrl(e.DATABASE_URL),
      );
      assertPostgresHostReachableFromWorkers(u);
      return u;
    }
  } catch (err) {
    if (inWorker) throw err;
    // SSG, or dev without OpenNext worker context
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set (or Hyperdrive is not bound as HYPERDRIVE in wrangler).",
    );
  }
  const resolved = stripWorkerUnsupportedTlsFileParams(enhanceSupabasePostgresUrl(url));
  if (inWorker) {
    assertPostgresHostReachableFromWorkers(resolved);
  }
  return resolved;
}
