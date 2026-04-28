import { getSimpleAuthUserId } from "@/lib/auth/simple-session";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { getPrisma } from "@/lib/prisma";
import { makeTenantSlug } from "@/lib/tenant/slug";
import { ensureDefaultBlogCategories } from "@/lib/tenant/ensure-default-blog-categories";

/**
 * Garante perfil Prisma e pelo menos um tenant + OWNER para o utilizador.
 *
 * O site público (blog, institucional, etc.) liga a permissões a um único tenant
 * (`BLOG_TENANT_SLUG` ou único na base). O primeiro acesso com sessão "simples"
 * (painel) criava por vezes *outro* tenant, ficando o admin sem membership nesse
 * tenant e sem capabilities — como se não tivesse sessão útil. Por isso, quando
 * existir tenant público resolvido e ainda faltar essa ligação, agregámo-lo aqui
 * (conta de painel configurada, ou utilizador ainda sem nenhuma org).
 *
 * Aceita `publicT` já resolvido para evitar uma query extra quando o chamador
 * já o conhece (ex.: `requirePublicSiteContext`).
 */
export async function ensureUserProvisioning(
  userId: string,
  email: string,
  publicT?: { id: string; slug: string } | null,
) {
  const safeEmail = email.trim();
  await getPrisma().userProfile.upsert({
    where: { id: userId },
    create: { id: userId, email: safeEmail },
    update: { email: safeEmail },
  });

  const membershipCount = await getPrisma().tenantMember.count({
    where: { userId },
  });

  // Reuse publicT if already resolved by the caller — avoids an extra DB query.
  const resolvedPublicT = publicT !== undefined ? publicT : await resolvePublicBlogTenant();
  if (resolvedPublicT) {
    const inPublic = await getPrisma().tenantMember.findFirst({
      where: { userId, tenantId: resolvedPublicT.id },
    });
    if (!inPublic && (userId === getSimpleAuthUserId() || membershipCount === 0)) {
      // upsert: pedidos paralelos (ex.: layout + /blog) podem ambos passar o guard e
      // o segundo create() falhava com P2002; idempotente.
      await getPrisma().tenantMember.upsert({
        where: {
          tenantId_userId: { tenantId: resolvedPublicT.id, userId },
        },
        create: { tenantId: resolvedPublicT.id, userId, role: "OWNER" },
        update: {},
      });
      await ensureDefaultBlogCategories(resolvedPublicT.id);
      return;
    }
  }

  if (membershipCount > 0) {
    return;
  }

  const local = safeEmail.split("@")[0] || "Organização";
  const name = `Organização de ${local}`;
  const slug = makeTenantSlug(safeEmail);

  await getPrisma().$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name, slug },
    });
    await ensureDefaultBlogCategories(tenant.id, tx);
    await tx.tenantMember.create({
      data: {
        tenantId: tenant.id,
        userId,
        role: "OWNER",
      },
    });
  });
}
