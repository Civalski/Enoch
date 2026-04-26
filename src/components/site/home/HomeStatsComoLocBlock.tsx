"use client";

import Link from "next/link";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import { ensureCols, ensureStats } from "@/components/site/home/home-content-helpers";
import type { HomeContentV1 } from "@/lib/institutional-site/types";

type P = {
  h: HomeContentV1;
  canManage: boolean;
  mapSrc: string;
  pushHome: (fn: (p: HomeContentV1) => HomeContentV1) => void;
};

export function HomeStatsComoLocBlock({ h, canManage, mapSrc, pushHome }: P) {
  const stats = ensureStats(h);
  const cols = ensureCols(h);
  return (
    <>
      <Section className="gradient-animated text-white relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-black/10" />
        <div className="particles-bg absolute inset-0" />
        <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((s, i) => (
            <div key={i} className="reveal group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-5xl md:text-6xl font-extrabold mb-2 group-hover:scale-110 transition-transform duration-300">
                {canManage ? (
                  <InlinePencilText
                    enabled
                    value={s.n ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const it = ensureStats(p);
                        it[i] = { ...it[i], n: v };
                        return { ...p, stats: { items: it } };
                      })
                    }
                    className="text-white"
                    editLabel={`Número ${i + 1}`}
                  />
                ) : (
                  s.n
                )}
              </div>
              <div className="text-blue-100 font-medium text-lg">
                {canManage ? (
                  <InlinePencilText
                    enabled
                    value={s.label ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const it = ensureStats(p);
                        it[i] = { ...it[i], label: v };
                        return { ...p, stats: { items: it } };
                      })
                    }
                    className="text-blue-100"
                    editLabel={`Legenda estatística ${i + 1}`}
                  />
                ) : (
                  s.label
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={
          canManage ? (
            <InlinePencilText
              enabled
              value={h.comoAjudar?.title ?? ""}
              onChange={(v) =>
                pushHome((p) => ({ ...p, comoAjudar: { ...p.comoAjudar, title: v, cols: ensureCols(p) } }))
              }
              className="text-gradient-heading"
              editLabel="Editar título (como ajudar)"
            />
          ) : (
            (h.comoAjudar?.title ?? "")
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={h.comoAjudar?.subtitle ?? ""}
              onChange={(v) =>
                pushHome((p) => ({ ...p, comoAjudar: { ...p.comoAjudar, subtitle: v, cols: ensureCols(p) } }))
              }
              className="text-gradient-subtle"
              editLabel="Editar subtítulo (como ajudar)"
            />
          ) : (
            (h.comoAjudar?.subtitle ?? "")
          )
        }
        className="bg-white relative overflow-hidden"
      >
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {cols.map((col, i) => (
            <div
              key={i}
              className="text-center p-8 reveal hover-lift glass-card rounded-2xl transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl ${
                  i % 2 === 0 ? "rotate-3" : "-rotate-3"
                } flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                {i === 0 ? (
                  <svg className="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : i === 1 ? (
                  <svg className="w-10 h-10 text-white rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {canManage ? (
                  <InlinePencilText
                    enabled
                    value={col?.title ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const c0 = ensureCols(p);
                        const next = [...c0] as typeof c0;
                        next[i] = { ...next[i], title: v };
                        return { ...p, comoAjudar: { ...p.comoAjudar, cols: next } };
                      })
                    }
                    className="text-gray-800"
                    editLabel={`Título coluna ${i + 1}`}
                  />
                ) : (
                  (col?.title ?? "")
                )}
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                {canManage ? (
                  <InlinePencilText
                    multiline
                    enabled
                    value={col?.body ?? ""}
                    onChange={(v) =>
                      pushHome((p) => {
                        const c0 = ensureCols(p);
                        const next = [...c0] as typeof c0;
                        next[i] = { ...next[i], body: v };
                        return { ...p, comoAjudar: { ...p.comoAjudar, cols: next } };
                      })
                    }
                    className="text-gray-600"
                    editLabel={`Texto coluna ${i + 1}`}
                  />
                ) : (
                  <span className="whitespace-pre-line">{col?.body ?? ""}</span>
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 reveal">
          {canManage ? (
            <InlinePencilText
              enabled
              asLink={{
                href: "/como-ajudar",
                className:
                  "inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform",
              }}
              value={h.comoAjudar?.ctaLabel ?? ""}
              onChange={(v) =>
                pushHome((p) => ({ ...p, comoAjudar: { ...p.comoAjudar, ctaLabel: v, cols: ensureCols(p) } }))
              }
              editLabel="Editar botão (como ajudar)"
            />
          ) : (
            <Link
              href="/como-ajudar"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
            >
              {h.comoAjudar?.ctaLabel ?? ""}
            </Link>
          )}
        </div>
      </Section>

      <Section
        title={
          canManage ? (
            <InlinePencilText
              enabled
              value={h.localizacao?.title ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, localizacao: { ...p.localizacao, title: v } }))}
              className="text-gradient-heading"
              editLabel="Título (localização)"
            />
          ) : (
            (h.localizacao?.title ?? "")
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={h.localizacao?.subtitle ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, localizacao: { ...p.localizacao, subtitle: v } }))}
              className="text-gradient-subtle"
              editLabel="Subtítulo (mapa)"
            />
          ) : (
            (h.localizacao?.subtitle ?? "")
          )
        }
        className="bg-white"
      >
        <div className="reveal">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
            <iframe
              className="gp-google-maps w-full"
              title="Mapa"
              height={450}
              src={mapSrc}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
