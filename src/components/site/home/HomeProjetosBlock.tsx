"use client";

import Link from "next/link";
import { Card } from "@/components/site/Card";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import { ensureCards } from "@/components/site/home/home-content-helpers";
import type { HomeContentV1, TeaserCard } from "@/lib/institutional-site/types";

type P = {
  h: HomeContentV1;
  canManage: boolean;
  pushHome: (fn: (p: HomeContentV1) => HomeContentV1) => void;
};

export function HomeProjetosBlock({ h, canManage, pushHome }: P) {
  const cards = ensureCards(h);
  return (
    <Section
      title={
        canManage ? (
          <InlinePencilText
            enabled
            value={h.projetosTeaser?.title ?? ""}
            onChange={(v) =>
              pushHome((p) => ({ ...p, projetosTeaser: { ...p.projetosTeaser, title: v, cards: ensureCards(p) } }))
            }
            className="text-gradient-heading"
            editLabel="Editar título da secção de projetos"
          />
        ) : (
          (h.projetosTeaser?.title ?? "")
        )
      }
      subtitle={
        canManage ? (
          <InlinePencilText
            multiline
            enabled
            value={h.projetosTeaser?.subtitle ?? ""}
            onChange={(v) =>
              pushHome((p) => ({ ...p, projetosTeaser: { ...p.projetosTeaser, subtitle: v, cards: ensureCards(p) } }))
            }
            className="text-gradient-subtle"
            editLabel="Editar subtítulo da secção de projetos"
          />
        ) : (
          (h.projetosTeaser?.subtitle ?? "")
        )
      }
      className="bg-white relative"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((c, i) => (
          <div key={i} className="reveal" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
            <Card
              title={
                canManage ? (
                  <InlinePencilText
                    enabled
                    value={c?.title ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const ch = ensureCards(p);
                        const next = [...ch] as [TeaserCard, TeaserCard, TeaserCard];
                        next[i] = { ...next[i], title: v };
                        return { ...p, projetosTeaser: { ...p.projetosTeaser, cards: next } };
                      })
                    }
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300"
                    editLabel={`Editar título do cartão ${i + 1}`}
                  />
                ) : (
                  (c?.title ?? "")
                )
              }
              description={
                canManage ? (
                  <InlinePencilText
                    multiline
                    enabled
                    value={c?.description ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const ch = ensureCards(p);
                        const next = [...ch] as [TeaserCard, TeaserCard, TeaserCard];
                        next[i] = { ...next[i], description: v };
                        return { ...p, projetosTeaser: { ...p.projetosTeaser, cards: next } };
                      })
                    }
                    className="text-gray-600"
                    editLabel={`Editar descrição do cartão ${i + 1}`}
                  />
                ) : (
                  (c?.description ?? "")
                )
              }
              image={c?.image}
              link={c?.link ?? "/projetos"}
            />
            {canManage ? (
              <div className="mt-2 space-y-1 text-xs text-slate-600 max-w-sm mx-auto">
                <p>
                  Imagem:{" "}
                  <InlinePencilText
                    enabled
                    value={c?.image ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const ch = ensureCards(p);
                        const next = [...ch] as [TeaserCard, TeaserCard, TeaserCard];
                        next[i] = { ...next[i], image: v };
                        return { ...p, projetosTeaser: { ...p.projetosTeaser, cards: next } };
                      })
                    }
                    className="font-mono break-all"
                    editLabel={`URL da imagem do cartão ${i + 1}`}
                  />
                </p>
                <p>
                  Link:{" "}
                  <InlinePencilText
                    enabled
                    value={c?.link ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const ch = ensureCards(p);
                        const next = [...ch] as [TeaserCard, TeaserCard, TeaserCard];
                        next[i] = { ...next[i], link: v };
                        return { ...p, projetosTeaser: { ...p.projetosTeaser, cards: next } };
                      })
                    }
                    className="font-mono break-all"
                    editLabel={`URL do link do cartão ${i + 1}`}
                  />
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="text-center mt-12 reveal">
        {canManage ? (
          <InlinePencilText
            enabled
            asLink={{
              href: "/projetos",
              className:
                "inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 transform",
            }}
            value={h.projetosTeaser?.ctaLabel ?? ""}
            onChange={(v) =>
              pushHome((p) => ({ ...p, projetosTeaser: { ...p.projetosTeaser, ctaLabel: v, cards: ensureCards(p) } }))
            }
            editLabel="Editar texto do botão (projetos)"
          />
        ) : (
          <Link
            href="/projetos"
            className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 transform"
          >
            {h.projetosTeaser?.ctaLabel ?? ""}
          </Link>
        )}
      </div>
    </Section>
  );
}
