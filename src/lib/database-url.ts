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

export function isDatabaseSslInsecure(): boolean {
  if (envTruthy("DATABASE_SSL_STRICT")) {
    return false;
  }
  if (envTruthy("DATABASE_SSL_INSECURE")) {
    return true;
  }
  return process.env.NODE_ENV === "development";
}

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
      `Postgres host "${hostname}" cannot be reached over TCP from Cloudflare Workers.`
    );
  }
}

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
  return s;
}

export function getDatabaseUrl(): string {
  let inWorker = false;
  try {
    const { env } = getCloudflareContext();
    inWorker = true;
    const e = env as { HYPERDRIVE?: HyperdriveLike; DATABASE_URL?: string };
    if (e.HYPERDRIVE?.connectionString) {
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
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  const resolved = stripWorkerUnsupportedTlsFileParams(enhanceSupabasePostgresUrl(url));
  if (inWorker) {
    assertPostgresHostReachableFromWorkers(resolved);
  }
  return resolved;
}
