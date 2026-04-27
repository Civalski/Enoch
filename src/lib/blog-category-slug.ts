import { slugifyTitle } from "@/lib/blog-markdown";
import { getPrisma } from "@/lib/prisma";

export async function uniqueCategorySlugForTenant(tenantId: string, labelOrSlug: string): Promise<string> {
  let slug = slugifyTitle(labelOrSlug);
  if (!slug) slug = "categoria";
  let i = 0;
  for (;;) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const clash = await getPrisma().blogPostCategory.findFirst({
      where: { tenantId, slug: candidate },
    });
    if (!clash) {
      return candidate;
    }
    i++;
  }
}
