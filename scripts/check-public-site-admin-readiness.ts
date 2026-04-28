/**
 * Diagnóstico: tenant público, env e membership do administrador principal.
 * Correr com a mesma DATABASE_URL e variáveis do ambiente a verificar (ex.: produção).
 *
 * Uso: npm run check:site-admin
 */
import "dotenv/config";
import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientCtor } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getSimpleAuthUserId } from "../src/lib/auth/simple-session";
import { getDatabaseUrl, isDatabaseSslInsecure } from "../src/lib/database-url";

/** Mesmo critério que `resolvePublicBlogTenant` ([`src/lib/blog-data.ts`]), sem `server-only`/blog-data. */
async function resolvePublicTenant(prisma: PrismaClient): Promise<{ id: string; slug: string } | null> {
  const envSlug = process.env.BLOG_TENANT_SLUG?.trim();
  if (envSlug) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: envSlug },
      select: { id: true, slug: true },
    });
    return tenant;
  }
  const rows = await prisma.tenant.findMany({
    select: { id: true, slug: true },
    orderBy: { createdAt: "asc" },
    take: 2,
  });
  if (rows.length === 1) {
    return rows[0]!;
  }
  return null;
}

function createScriptPrisma(): PrismaClient {
  const connectionString = getDatabaseUrl();
  process.env.DATABASE_URL = connectionString;
  const adapterOptions: Record<string, unknown> = {
    connectionString,
    maxUses: 1,
  };
  if (isDatabaseSslInsecure()) {
    adapterOptions.ssl = { rejectUnauthorized: false };
  }
  const adapter = new PrismaPg(adapterOptions as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClientCtor({ adapter });
}

async function main() {
  const prisma = createScriptPrisma();
  try {
    const envSlug = process.env.BLOG_TENANT_SLUG?.trim() ?? "(não definido)";
    const masterId = getSimpleAuthUserId();
    console.log("BLOG_TENANT_SLUG (env):", envSlug);
    console.log("SIMPLE_AUTH_USER_ID (efectivo):", masterId);

    const wranglerSlug = "(ver Cloudflare Workers: wrangler.json vars)";
    console.log("(Produção) comparar também BLOG_TENANT_SLUG em wrangler/dashboard vs base:", wranglerSlug);

    const publicT = await resolvePublicTenant(prisma);
    if (!publicT) {
      console.error(
        "\n[FAIL] Tenant público não resolvido. Com vários tenants na base, defina BLOG_TENANT_SLUG com o slug correcto.",
      );
      const total = await prisma.tenant.count();
      console.log("Total Tenant na base:", total);
      process.exitCode = 1;
      return;
    }
    console.log("\nTenant público resolvido:", publicT.slug, publicT.id);

    const tenantTotal = await prisma.tenant.count();
    console.log("Total Tenant na base:", tenantTotal);

    const member = await prisma.tenantMember.findFirst({
      where: { tenantId: publicT.id, userId: masterId },
      select: { id: true, role: true },
    });
    if (!member) {
      console.error(
        "\n[FAIL] SIMPLE_AUTH_USER_ID não tem TenantMember no tenant público; as capacidades no site ficam vazias.",
      );
      process.exitCode = 1;
      return;
    }
    console.log("[OK] TenantMember:", member.role);

    console.log("\n--- Cookies / modo visitante ---");
    console.log(
      "Se `enoch_public_visitor_preview` estiver definido como 1, `getSiteCapabilities()` fica vazio até sair desse modo (ícone de olho no cabeçalho para admins principais).",
    );

    console.log("\n--- Cache HTML ---");
    console.log(
      "Rotas públicas com edição usam `force-dynamic`; sem `Cache-Control` agressivo no `next.config`.",
      "Se ainda vier HTML \"sem sessão\", verificar CDN/Workers `cacheEverything` sobre rotas dinâmicas.",
    );
    console.log("[OK] Concluído.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
