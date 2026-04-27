import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/database-url";

export function createPrismaClient() {
  const url = getDatabaseUrl();
  const adapter = new PrismaPg({ connectionString: url, max: 1 });
  return new PrismaClient({ adapter });
}
