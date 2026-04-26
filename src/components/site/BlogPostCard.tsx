import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogPostAdminControls } from "@/components/site/BlogPostAdminControls";
import { BlogPostStaticAdminControls } from "@/components/site/BlogPostStaticAdminControls";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Props = {
  post: BlogPost;
  canManage?: boolean;
};

export function BlogPostCard({ post, canManage }: Props) {
  const date = dateFormatter.format(new Date(post.publishedAt + "T12:00:00"));
  const label = post.categoryLabel;
  const showDbAdmin = Boolean(canManage && post.dbPostId);
  const showStaticAdmin = Boolean(canManage && !post.dbPostId);

  return (
    <article className="glass-card rounded-2xl overflow-hidden hover-lift group flex flex-col h-full transition-all duration-300 relative">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full text-left">
        <div className="w-full h-48 bg-gray-200 overflow-hidden relative shrink-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
          <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide bg-white/90 text-blue-700 px-2.5 py-1 rounded-lg shadow">
            {label}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <time dateTime={post.publishedAt} className="text-sm text-gray-500 mb-2">
            {date}
            <span className="text-gray-400 mx-2">·</span>
            {post.readingTimeMinutes} min de leitura
          </time>
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">{post.excerpt}</p>
          <span className="text-blue-600 font-semibold group-hover:text-blue-700 inline-flex items-center mt-auto">
            Ler a notícia completa
            <svg
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
      {showDbAdmin && post.dbPostId && (
        <div className="absolute top-3 right-3 z-30 pointer-events-auto">
          <BlogPostAdminControls postId={post.dbPostId} title={post.title} />
        </div>
      )}
      {showStaticAdmin && (
        <div className="absolute top-3 right-3 z-30 pointer-events-auto">
          <BlogPostStaticAdminControls slug={post.slug} title={post.title} />
        </div>
      )}
    </article>
  );
}
