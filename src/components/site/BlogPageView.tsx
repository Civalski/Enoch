"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { saveBlogContentObjectAction } from "@/app/app/institucional/actions";
import { BlogCategoryFilter } from "@/components/site/BlogCategoryFilter";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import type { BlogPost } from "@/lib/blog";
import type { BlogContentV1, PublicSiteView } from "@/lib/institutional-site/types";

type Props = {
  site: PublicSiteView;
  posts: BlogPost[];
  canManage: boolean;
};

const heroTitleGradient =
  "inline-block max-w-full pb-1.5 leading-[1.15] bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg";

export function BlogPageView({ site, posts, canManage }: Props) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogContentV1>(() => site.blog);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(site.blog));
  const b = canManage ? blog : site.blog;
  const dirty = canManage && JSON.stringify(blog) !== savedJson;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const pushBlog = useCallback(
    (fn: (p: BlogContentV1) => BlogContentV1) => {
      if (!canManage) return;
      setBlog((p) => fn(structuredClone(p)));
      setMsg(null);
    },
    [canManage],
  );

  const onSave = () => {
    startTransition(async () => {
      const r = await saveBlogContentObjectAction(blog);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSavedJson(JSON.stringify(blog));
        router.refresh();
      }
    });
  };

  return (
    <div className={canManage && dirty ? "pb-24" : undefined}>
      {/** `particles-bg` com overflow fica só no fundo; o texto fica noutro ramo para não cortar descendentes (g, y, p). */}
      <section className="gradient-animated relative py-20 text-white">
        <div className="absolute inset-0 bg-gradient-blue-subtle opacity-90" />
        <div className="particles-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            {canManage ? (
              <InlinePencilText
                block
                enabled
                value={b.hero?.title ?? ""}
                onChange={(v) => pushBlog((p) => ({ ...p, hero: { ...p.hero, title: v } }))}
                className={heroTitleGradient}
                editLabel="Editar título do blog (destaque)"
              />
            ) : (
              <span className={heroTitleGradient}>{b.hero?.title ?? "Blog"}</span>
            )}
          </h1>
          <p
            className="text-xl text-blue-100 max-w-2xl animate-fade-in-up drop-shadow-md"
            style={{ animationDelay: "0.2s" }}
          >
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={b.hero?.subtitle ?? ""}
                onChange={(v) => pushBlog((p) => ({ ...p, hero: { ...p.hero, subtitle: v } }))}
                className="text-blue-100"
                editLabel="Editar subtítulo do destaque (blog)"
              />
            ) : (
              b.hero?.subtitle ?? ""
            )}
          </p>
        </div>
      </section>

      <Section
        title={
          canManage ? (
            <InlinePencilText
              enabled
              value={b.listSection?.title ?? ""}
              onChange={(v) =>
                pushBlog((p) => ({ ...p, listSection: { ...p.listSection, title: v } }))
              }
              className="text-gradient-heading"
              editLabel="Editar título da listagem de notícias"
            />
          ) : (
            (b.listSection?.title ?? "Prévia das notícias")
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={b.listSection?.subtitle ?? ""}
              onChange={(v) =>
                pushBlog((p) => ({ ...p, listSection: { ...p.listSection, subtitle: v } }))
              }
              className="text-gradient-subtle"
              editLabel="Editar subtítulo da listagem de notícias"
            />
          ) : (
            (b.listSection?.subtitle ?? "")
          )
        }
        className="bg-slate-50"
      >
        <BlogCategoryFilter posts={posts} canManage={canManage} />
      </Section>

      {canManage && dirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-3">
            {msg ? (
              <p
                className={`text-sm ${msg.ok ? "text-green-800" : "text-red-700"}`}
                role="status"
                aria-live="polite"
              >
                {msg.text}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onSave}
              disabled={pending}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {pending ? "A guardar…" : "Guardar alterações da página do blog"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
