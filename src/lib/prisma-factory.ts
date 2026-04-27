import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import parse from "pg-connection-string";
import type { PoolConfig } from "pg";
import { getDatabaseUrl, isDatabaseSslInsecure } from "@/lib/database-url";

/**
 * Com `connectionString`, o `pg` faz `Object.assign({}, config, parse(url))` e o
 * `ssl` vindo do URL (ex.: sslmode=verify-full) substitui um `ssl` explícito.
 * Sem `connectionString`, o `ssl` que passamos mantém-se.
 */
function buildPgPoolConfig(url: string): PoolConfig {
  if (!isDatabaseSslInsecure()) {
    return { connectionString: url, max: 1 };
  }
  const parsed = parse(url) as PoolConfig & { connectionString?: string };
  const spread = { ...parsed };
  delete spread.connectionString;
  return {
    ...spread,
    max: 1,
    ssl: { rejectUnauthorized: false },
  };
}

export function createPrismaClient() {
  const url = getDatabaseUrl();
  const adapter = new PrismaPg(buildPgPoolConfig(url));
  return new PrismaClient({ adapter });
}
