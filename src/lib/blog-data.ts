import type { BlogPost } from "@/lib/blog";
import { getAllPosts as getStaticPosts, getPostBySlug as getStaticPostBySlug } from "@/lib/blog";
import { getPrisma } from "@/lib/prisma";
import { readingTimeFromMarkdown } from "@/lib/blog-markdown";
import { getHiddenStaticBlogSlugSet } from "@/lib/institutional-site/hidden-seed-content";

/**
 * Organização cujos artigos entram em /blog (site público, sem login).
 * — Se `BLOG_TENANT_SLUG` estiver definido, usa esse tenant.
 * — Senão, se existir **apenas um** tenant na base (caso institucional comum), usa esse.
 * — Com vários tenants e sem env, devolve null (é preciso definir o slug).
 */
export async function resolvePublicBlogTenant(): Promise<{ id: string; slug: string } | null> {
  const envSlug = process.env.BLOG_TENANT_SLUG?.trim();
  if (envSlug) {
    const tenant = await getPrisma().tenant.findUnique({
      where: { slug: envSlug },
      select: { id: true, slug: true },
    });
    return tenant;
  }

  const rows = await getPrisma().tenant.findMany({
    select: { id: true, slug: true },
    orderBy: { createdAt: "asc" },
    take: 2,
  });

  if (rows.length === 1) {
    return rows[0]!;
  }

  return null;
}

function publishedDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dbRowToBlogPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  bodyMarkdown: string;
  publishedAt: Date;
  category: { slug: string; label: string };
}): BlogPost {
  return {
    dbPostId: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    image: row.coverImageUrl,
    bodyMarkdown: row.bodyMarkdown,
    publishedAt: publishedDateOnly(row.publishedAt),
    category: row.category.slug,
    categoryLabel: row.category.label,
    readingTimeMinutes: readingTimeFromMarkdown(row.bodyMarkdown),
  };
}

async function getPublicBlogTenantId(): Promise<string | null> {
  const t = await resolvePublicBlogTenant();
  return t?.id ?? null;
}

export async function getDbPostsForPublicBlog(): Promise<BlogPost[]> {
  const tenantId = await getPublicBlogTenantId();
  if (!tenantId) return [];

  const rows = await getPrisma().blogPost.findMany({
    where: { tenantId },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      bodyMarkdown: true,
      publishedAt: true,
      category: { select: { slug: true, label: true } },
    },
  });

  return rows.map(dbRowToBlogPost);
}

export async function getAllPostsMerged(): Promise<BlogPost[]> {
  const tenantId = await getPublicBlogTenantId();
  const hiddenSlugs = await getHiddenStaticBlogSlugSet(tenantId);
  const staticPosts = getStaticPosts().filter((p) => !hiddenSlugs.has(p.slug));
  const dbPosts = await getDbPostsForPublicBlog();
  const bySlug = new Map<string, BlogPost>();
  for (const p of staticPosts) {
    bySlug.set(p.slug, p);
  }
  for (const p of dbPosts) {
    bySlug.set(p.slug, p);
  }
  return [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getMergedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const tenantId = await getPublicBlogTenantId();
  if (tenantId) {
    const row = await getPrisma().blogPost.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImageUrl: true,
        bodyMarkdown: true,
        publishedAt: true,
        category: { select: { slug: true, label: true } },
      },
    });
    if (row) return dbRowToBlogPost(row);
  }
  const hiddenSlugs = await getHiddenStaticBlogSlugSet(tenantId);
  if (hiddenSlugs.has(slug)) {
    return undefined;
  }
  return getStaticPostBySlug(slug);
}

export async function getMergedSlugs(): Promise<{ slug: string }[]> {
  const posts = await getAllPostsMerged();
  return posts.map((p) => ({ slug: p.slug }));
}
