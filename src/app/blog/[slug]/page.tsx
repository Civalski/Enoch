import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMergedPostBySlug } from "@/lib/blog-data";
import { getPublicBlogManageCapability } from "@/lib/permissions/site-permissions";
import { BlogPostMarkdown } from "@/components/site/BlogPostMarkdown";
import { BlogPostAdminControls } from "@/components/site/BlogPostAdminControls";
import { BlogPostStaticAdminControls } from "@/components/site/BlogPostStaticAdminControls";

const dateLong = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Params = { slug: string };

export const dynamic = "force-dynamic";

/** Sem `generateStaticParams`: a lista de slugs vem de Prisma/merge; mantemos rotas resolvidas em runtime. */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getMergedPostBySlug(slug);
  if (!post) return { title: "Artigo" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, { canManage }] = await Promise.all([
    getMergedPostBySlug(slug),
    getPublicBlogManageCapability(),
  ]);
  if (!post) notFound();

  const dateStr = dateLong.format(new Date(post.publishedAt + "T12:00:00"));
  const category = post.categoryLabel;
  const showDbAdmin = Boolean(canManage && post.dbPostId);
  const showStaticAdmin = Boolean(canManage && !post.dbPostId);

  return (
    <article>
      <div className="bg-slate-50 border-b border-slate-200/80">
        <div className="container mx-auto px-4 py-8 max-w-3xl relative">
          {showDbAdmin && post.dbPostId && (
            <div className="absolute top-6 right-4 md:right-0 z-30">
              <BlogPostAdminControls postId={post.dbPostId} title={post.title} />
            </div>
          )}
          {showStaticAdmin && (
            <div className="absolute top-6 right-4 md:right-0 z-30">
              <BlogPostStaticAdminControls slug={post.slug} title={post.title} />
            </div>
          )}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao blog
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <time dateTime={post.publishedAt}>{dateStr}</time>
            <span className="text-gray-300">·</span>
            <span>{post.readingTimeMinutes} min de leitura</span>
            <span className="text-gray-300">·</span>
            <span className="font-medium text-blue-600">{category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-heading leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pt-2 pb-2">
        <figure className="m-0 rounded-xl overflow-hidden bg-slate-100/90 ring-1 ring-slate-200/80">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[min(85vh,960px)] object-contain object-center block"
            sizes="(max-width: 768px) 100vw, 48rem"
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <p className="text-xl text-gray-700 font-medium leading-relaxed mb-10 border-l-4 border-blue-500 pl-4 md:pl-6">
          {post.excerpt}
        </p>
        <div className="text-lg text-gray-700 leading-relaxed">
          <BlogPostMarkdown markdown={post.bodyMarkdown} />
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao blog
          </Link>
        </div>
      </div>
    </article>
  );
}
