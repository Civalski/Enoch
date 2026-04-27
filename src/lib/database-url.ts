import { getCloudflareContext } from "@opennextjs/cloudflare";

type HyperdriveLike = { connectionString: string };

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
      assertPostgresHostReachableFromWorkers(e.HYPERDRIVE.connectionString);
      return e.HYPERDRIVE.connectionString;
    }
    if (typeof e.DATABASE_URL === "string" && e.DATABASE_URL.length > 0) {
      assertPostgresHostReachableFromWorkers(e.DATABASE_URL);
      return e.DATABASE_URL;
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
  if (inWorker) {
    assertPostgresHostReachableFromWorkers(url);
  }
  return url;
}
