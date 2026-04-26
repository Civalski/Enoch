"use client";

import { useTransition } from "react";
import { hideStaticBlogPostAction } from "@/app/app/(backoffice)/blog/actions";
import { hideStaticProjectAction } from "@/app/app/(backoffice)/projetos/actions";

type BlogProps = { slug: string; title: string };
type ProjectProps = { title: string };

const iconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50";

function CrossIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function HideStaticBlogPostButton({ slug, title }: BlogProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title="Remover notícia de exemplo do site"
      aria-label={`Remover notícia de exemplo «${title}» do site público`}
      disabled={isPending}
      className={iconClass}
      onClick={() => {
        if (
          !window.confirm(
            `Remover a notícia de exemplo «${title}» do site? (O ficheiro no código permanece; pode voltar a publicar criando o artigo na base.)`,
          )
        ) {
          return;
        }
        const fd = new FormData();
        fd.set("slug", slug);
        startTransition(() => {
          void hideStaticBlogPostAction(fd);
        });
      }}
    >
      <CrossIcon />
    </button>
  );
}

export function HideStaticProjectButton({ title }: ProjectProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title="Remover bloco de exemplo do site"
      aria-label={`Remover bloco de exemplo «${title}» do site público`}
      disabled={isPending}
      className={iconClass}
      onClick={() => {
        if (
          !window.confirm(
            `Remover o bloco de exemplo «${title}»? (Só deixa de aparecer no site; crie o projeto na base para o substituir.)`,
          )
        ) {
          return;
        }
        const fd = new FormData();
        fd.set("title", title);
        startTransition(() => {
          void hideStaticProjectAction(fd);
        });
      }}
    >
      <CrossIcon />
    </button>
  );
}
