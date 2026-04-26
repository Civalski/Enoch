"use client";

import Link from "next/link";
import { DeleteBlogPostButton } from "@/components/app/DeleteBlogPostButton";

type Props = {
  postId: string;
  title: string;
};

export function BlogPostAdminControls({ postId, title }: Props) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-white/95 p-1 shadow-md border border-slate-200/80 backdrop-blur-sm relative z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={`/app/blog/${postId}/editar`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
        title="Editar artigo"
        aria-label={`Editar «${title}»`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </Link>
      <DeleteBlogPostButton postId={postId} title={title} variant="icon" />
    </div>
  );
}
