import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseUrl, isDatabaseSslInsecure } from "@/lib/database-url";
import { getPrismaClientModule } from "@/lib/prisma-runtime";

/**
 * Creates a new PrismaClient per request.
 *
 * Follows the official OpenNext + Prisma + PostgreSQL pattern:
 * @see https://opennext.js.org/cloudflare/howtos/db#postgresql-1
 *
 * Key decisions:
 * - `maxUses: 1` prevents connection reuse across requests, which causes
 *   "Connection terminated unexpectedly" errors in Cloudflare Workers.
 * - `getPrismaClientModule()` picks `@prisma/client` on Node (`next dev`) and
 *   `@prisma/client/wasm` on workerd; a static `/wasm` import breaks Next dev on Windows.
 * - SSL config: In production Workers, Supabase's transaction pooler (:6543)
 *   requires TLS, but the workerd TLS stack may not validate the full cert chain.
 *   We set `ssl: { rejectUnauthorized: false }` to avoid "Connection terminated".
 */
export function createPrismaClient() {
  const { PrismaClient } = getPrismaClientModule();
  const connectionString = getDatabaseUrl();

  // pg.Pool configuration for Cloudflare Workers
  // max: 1 ensures only one connection per request.
  // idleTimeoutMillis: 1000 closes the connection quickly to avoid
  // frozen sockets when the V8 isolate is suspended.
  const adapterOptions: Record<string, unknown> = {
    connectionString,
    max: 1,
    idleTimeoutMillis: 1000,
  };

  // In production (Workers), relax SSL verification for Supabase pooler.
  // The workerd TLS implementation may reject Supabase's cert chain.
  if (isDatabaseSslInsecure()) {
    adapterOptions.ssl = { rejectUnauthorized: false };
  }

  // We set process.env as fallback, but also pass datasourceUrl explicitly.
  process.env.DATABASE_URL = connectionString;

  const adapter = new PrismaPg(adapterOptions as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}
