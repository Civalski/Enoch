"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogPostCard } from "@/components/site/BlogPostCard";

type Props = {
  posts: BlogPost[];
  canManage?: boolean;
};

export function BlogCategoryFilter({ posts, canManage }: Props) {
  const [filter, setFilter] = useState<"all" | string>("all");

  const categoryTabs = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of posts) {
      if (!map.has(p.category)) {
        map.set(p.category, p.categoryLabel);
      }
    }
    return [...map.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt"));
  }, [posts]);

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.category === filter);
  }, [posts, filter]);

  return (
    <>
      <div className="flex flex-col items-stretch gap-4 mb-10 md:mb-12">
        {canManage && (
          <div className="flex justify-center md:justify-end">
            <Link
              href="/app/blog/novo"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              Criar novo post
            </Link>
          </div>
        )}
        <div
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
          role="tablist"
          aria-label="Filtrar por categoria"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-500/25"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            Todas
          </button>
          {categoryTabs.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-500/25"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600 py-12 max-w-md mx-auto">
          Nenhuma publicação nesta categoria ainda. Escolha outro filtro ou volte em breve.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, index) => (
            <div
              key={`${filter}-${post.slug}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
            >
              <BlogPostCard post={post} canManage={canManage} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
