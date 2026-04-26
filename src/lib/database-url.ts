import { getCloudflareContext } from "@opennextjs/cloudflare";

type HyperdriveLike = { connectionString: string };

/**
 * Resolves the Postgres connection string: Hyperdrive (Workers) when the binding
 * exists, otherwise `DATABASE_URL` (local dev, Vercel, `next build` / SSG).
 */
export function getDatabaseUrl(): string {
  try {
    const { env } = getCloudflareContext();
    const e = env as { HYPERDRIVE?: HyperdriveLike; DATABASE_URL?: string };
    if (e.HYPERDRIVE?.connectionString) {
      return e.HYPERDRIVE.connectionString;
    }
    if (typeof e.DATABASE_URL === "string" && e.DATABASE_URL.length > 0) {
      return e.DATABASE_URL;
    }
  } catch {
    // SSG, or dev without OpenNext worker context
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set (or Hyperdrive is not bound as HYPERDRIVE in wrangler).",
    );
  }
  return url;
}
