import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl, isDatabaseSslInsecure } from "@/lib/database-url";

/**
 * Creates a new PrismaClient per request.
 *
 * Follows the official OpenNext + Prisma + PostgreSQL pattern:
 * @see https://opennext.js.org/cloudflare/howtos/db#postgresql-1
 *
 * Key decisions:
 * - `maxUses: 1` prevents connection reuse across requests, which causes
 *   "Connection terminated unexpectedly" errors in Cloudflare Workers.
 * - Imports from `@prisma/client` directly (not `/wasm`). OpenNext patches the
 *   generated client to use the WASM query engine for the workerd runtime.
 * - SSL config: In production Workers, Supabase's transaction pooler (:6543)
 *   requires TLS, but the workerd TLS stack may not validate the full cert chain.
 *   We set `ssl: { rejectUnauthorized: false }` to avoid "Connection terminated".
 */
export function createPrismaClient() {
  const connectionString = getDatabaseUrl();

  // Build adapter options for pg.Pool
  // Instead of maxUses: 1 (which destroys the connection immediately and causes spam),
  // we use max: 1 (one concurrent connection) and idleTimeoutMillis: 10.
  // This ensures the connection is closed gracefully right after the request ends,
  // before Cloudflare freezes the socket, avoiding "Connection terminated unexpectedly".
  const adapterOptions: Record<string, unknown> = {
    connectionString,
    max: 1,
    idleTimeoutMillis: 10,
    connectionTimeoutMillis: 5000,
  };

  // In production (Workers), relax SSL verification for Supabase pooler.
  // The workerd TLS implementation may reject Supabase's cert chain.
  if (isDatabaseSslInsecure()) {
    adapterOptions.ssl = { rejectUnauthorized: false };
  }

  const adapter = new PrismaPg(adapterOptions as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}
