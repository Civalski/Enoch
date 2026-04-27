import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getPrisma } from "@/lib/prisma";
import { BlogEditorForm } from "@/components/app/BlogEditorForm";
import { getPublicSiteMembership, memberHasSitePermission } from "@/lib/permissions/site-permissions";

type Params = { postId: string };

export default async function EditarBlogPostPage({ params }: { params: Promise<Params> }) {
  const { postId } = await params;
  const user = await requireServerUser();
  const email = user.email ?? "";
  if (!email) {
    return null;
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    notFound();
  }
  if (!memberHasSitePermission(m.role, m.permissions, "BLOG")) {
    redirect("/blog");
  }

  const [post, categories] = await Promise.all([
    getPrisma().blogPost.findFirst({
      where: { id: postId, tenantId: m.tenantId },
    }),
    getPrisma().blogPostCategory.findMany({
      where: { tenantId: m.tenantId },
      orderBy: { label: "asc" },
      select: { id: true, slug: true, label: true },
    }),
  ]);
  if (!post) {
    notFound();
  }

  const publishedAt = post.publishedAt.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
        >
          ← Voltar ao blog
        </Link>
        <h2 className="text-lg font-semibold text-slate-900 mt-4">Editar artigo</h2>
      </div>
      <BlogEditorForm
        mode="edit"
        categories={categories}
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          coverImageUrl: post.coverImageUrl,
          bodyMarkdown: post.bodyMarkdown,
          publishedAt,
          categoryId: post.categoryId,
        }}
      />
    </div>
  );
}
