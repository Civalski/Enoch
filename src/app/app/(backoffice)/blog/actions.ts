"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { getPostBySlug } from "@/lib/blog";
import { uniqueCategorySlugForTenant } from "@/lib/blog-category-slug";
import { slugifyTitle } from "@/lib/blog-markdown";
import { requireSitePermissionFast } from "@/lib/permissions/site-permissions";
import { getPrisma } from "@/lib/prisma";


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireWriterTenant() {
  const { tenantId } = await requireSitePermissionFast("BLOG");
  return { tenantId };
}

async function requireCategoryIdForTenant(
  tenantId: string,
  raw: string,
): Promise<string> {
  const s = raw.trim();
  if (!UUID_RE.test(s)) {
    const fallback = await getPrisma().blogPostCategory.findFirst({
      where: { tenantId, slug: "geral" },
    });
    if (!fallback) {
      throw new Error("Categorias do blog em falta. Contacte o suporte.");
    }
    return fallback.id;
  }
  const row = await getPrisma().blogPostCategory.findFirst({
    where: { id: s, tenantId },
  });
  if (!row) {
    throw new Error("Categoria inválida.");
  }
  return row.id;
}

function parsePublishedAt(raw: string): Date {
  const s = raw.trim();
  if (!s) {
    return new Date();
  }
  const d = new Date(s + "T12:00:00");
  if (Number.isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

async function uniqueSlugForTenant(tenantId: string, base: string, excludePostId?: string) {
  let slug = slugifyTitle(base);
  if (!slug) slug = "post";
  let i = 0;
  for (;;) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const clash = await getPrisma().blogPost.findFirst({
      where: {
        tenantId,
        slug: candidate,
        ...(excludePostId ? { NOT: { id: excludePostId } } : {}),
      },
    });
    if (!clash) {
      return candidate;
    }
    i++;
  }
}

export async function createBlogPostAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("O título é obrigatório.");
  }
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "").trim();
  if (!bodyMarkdown) {
    throw new Error("O texto do artigo é obrigatório.");
  }
  const categoryId = await requireCategoryIdForTenant(
    tenantId,
    String(formData.get("categoryId") ?? ""),
  );
  const publishedAt = parsePublishedAt(String(formData.get("publishedAt") ?? ""));
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = await uniqueSlugForTenant(tenantId, slugInput || title);

  await getPrisma().blogPost.create({
    data: {
      tenantId,
      slug,
      title,
      excerpt: excerpt || title,
      coverImageUrl: coverImageUrl || "/blog/covers/cover-1.svg",
      bodyMarkdown,
      publishedAt,
      categoryId,
    },
  });

  revalidatePath("/blog");
  redirect(`/blog/${slug}`);
}

export async function updateBlogPostAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Artigo inválido.");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("O título é obrigatório.");
  }
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "").trim();
  if (!bodyMarkdown) {
    throw new Error("O texto do artigo é obrigatório.");
  }
  const categoryId = await requireCategoryIdForTenant(
    tenantId,
    String(formData.get("categoryId") ?? ""),
  );
  const publishedAt = parsePublishedAt(String(formData.get("publishedAt") ?? ""));
  const slugInput = String(formData.get("slug") ?? "").trim();

  // Fetch only current slug (needed for revalidatePath), and update in one step.
  // tenantId scoping ensures we cannot modify another tenant's post.
  const existing = await getPrisma().blogPost.findFirst({
    where: { id, tenantId },
    select: { slug: true },
  });
  if (!existing) {
    throw new Error("Artigo não encontrado.");
  }
  const prevSlug = existing.slug;
  const slug = await uniqueSlugForTenant(tenantId, slugInput || title, id);

  await getPrisma().blogPost.update({
    where: { id },
    data: {
      slug,
      title,
      excerpt: excerpt || title,
      coverImageUrl: coverImageUrl || "/blog/covers/cover-1.svg",
      bodyMarkdown,
      publishedAt,
      categoryId,
    },
  });

  revalidatePath("/blog");
  if (prevSlug !== slug) {
    revalidatePath(`/blog/${prevSlug}`);
  }
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}

export async function deleteBlogPostAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Artigo inválido.");
  }

  // deleteMany with tenantId scope — avoids extra findFirst, returns count=0 if not found.
  const { count } = await getPrisma().blogPost.deleteMany({ where: { id, tenantId } });
  if (count === 0) {
    throw new Error("Artigo não encontrado ou sem permissão.");
  }

  revalidatePath("/blog");
  redirect("/blog");
}

export type CreateBlogCategoryResult =
  | { ok: true; id: string; slug: string; label: string }
  | { ok: false; message: string };

/**
 * Cria uma categoria nova para o tenant do editor (apenas OWNER/ADMIN, mesmo critério dos artigos).
 * O slug é derivado do nome (ex.: "Campanha de inverno" → campanha-de-inverno) e, se houver conflito, sufixo numérico.
 */
export async function createBlogCategoryAction(labelArg: string): Promise<CreateBlogCategoryResult> {
  try {
    const { tenantId } = await requireWriterTenant();
    const label = String(labelArg ?? "").trim();
    if (label.length < 2) {
      return { ok: false, message: "Indique um nome com pelo menos 2 caracteres." };
    }
    if (label.length > 80) {
      return { ok: false, message: "Nome muito longo (máx. 80 caracteres)." };
    }
    const slug = await uniqueCategorySlugForTenant(tenantId, label);
    const row = await getPrisma().blogPostCategory.create({
      data: { tenantId, slug, label },
    });
    revalidatePath("/blog");
    return { ok: true, id: row.id, slug: row.slug, label: row.label };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Não foi possível criar a categoria." };
  }
}

/** Remove artigos de exemplo (`blog.ts`) do site, persistindo a escolha em `InstitutionalSiteContent`. */
export async function hideStaticBlogPostAction(formData: FormData) {
  const { tenantId } = await requireSitePermissionFast("BLOG");
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    throw new Error("Artigo inválido.");
  }
  if (!getPostBySlug(slug)) {
    throw new Error("Não é um artigo de exemplo do repositório.");
  }

  // Use Prisma array push to append the slug without a prior read.
  await getPrisma().institutionalSiteContent.upsert({
    where: { tenantId },
    create: {
      tenantId,
      hiddenStaticBlogSlugs: [slug],
      homeContent: Prisma.JsonNull,
      aboutContent: Prisma.JsonNull,
      contatoContent: Prisma.JsonNull,
      projetosContent: Prisma.JsonNull,
      blogContent: Prisma.JsonNull,
      estudosContent: Prisma.JsonNull,
      headerNavLabels: Prisma.JsonNull,
    },
    update: {
      hiddenStaticBlogSlugs: { push: slug },
    },
  });

  revalidatePath("/blog");
  redirect("/blog");
}
