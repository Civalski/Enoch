import Link from "next/link";
import { redirect } from "next/navigation";
import { BlogEditorForm } from "@/components/app/BlogEditorForm";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getPublicSiteMembership, memberHasSitePermission } from "@/lib/permissions/site-permissions";
import { getPrisma } from "@/lib/prisma";
import { getPostBySlug } from "@/lib/blog";

type SearchParams = Promise<{ exemplo?: string }>;

export default async function NovoBlogPostPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/blog");
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m || !memberHasSitePermission(m.role, m.permissions, "BLOG")) {
    redirect("/blog");
  }

  const categories = await getPrisma().blogPostCategory.findMany({
    where: { tenantId: m.tenantId },
    orderBy: { label: "asc" },
    select: { id: true, slug: true, label: true },
  });
  const fallbackCategoryId =
    categories.find((c) => c.slug === "geral")?.id ?? categories[0]?.id ?? "";

  const { exemplo: exemploRaw } = await searchParams;
  const exemplo = typeof exemploRaw === "string" ? exemploRaw.trim() : "";
  const exemploPost = exemplo ? getPostBySlug(exemplo) : undefined;
  const createPrefill = exemploPost
    ? {
        slug: exemploPost.slug,
        title: exemploPost.title,
        excerpt: exemploPost.excerpt,
        coverImageUrl: exemploPost.image,
        bodyMarkdown: exemploPost.bodyMarkdown,
        publishedAt: exemploPost.publishedAt,
        categoryId:
          categories.find((c) => c.slug === exemploPost.category)?.id ?? fallbackCategoryId,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
        >
          ← Voltar ao blog
        </Link>
        <h2 className="text-lg font-semibold text-slate-900 mt-4">Novo artigo</h2>
        {createPrefill && (
          <p className="mt-2 text-sm text-slate-600">
            Formulário pré-preenchido a partir do texto de exemplo «{createPrefill.title}». Guarde para
            criar o registo na base.
          </p>
        )}
      </div>
      <BlogEditorForm
        mode="create"
        createPrefill={createPrefill}
        categories={categories}
      />
    </div>
  );
}
