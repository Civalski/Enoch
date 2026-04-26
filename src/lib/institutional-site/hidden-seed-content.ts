import { prisma } from "@/lib/prisma";

export async function getHiddenStaticBlogSlugSet(
  publicTenantId: string | null,
): Promise<Set<string>> {
  if (!publicTenantId) {
    return new Set();
  }
  const row = await prisma.institutionalSiteContent.findUnique({
    where: { tenantId: publicTenantId },
    select: { hiddenStaticBlogSlugs: true },
  });
  return new Set(row?.hiddenStaticBlogSlugs ?? []);
}

export async function getHiddenStaticProjectTitleSet(
  publicTenantId: string | null,
): Promise<Set<string>> {
  if (!publicTenantId) {
    return new Set();
  }
  const row = await prisma.institutionalSiteContent.findUnique({
    where: { tenantId: publicTenantId },
    select: { hiddenStaticProjectTitles: true },
  });
  return new Set(row?.hiddenStaticProjectTitles ?? []);
}
