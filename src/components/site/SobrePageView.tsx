"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { loadInstitutionalActions } from "@/lib/institutional-site/institutional-actions-client";
import { AboutTeamSection } from "@/components/site/AboutTeamSection";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { SobreCtaBlock } from "@/components/site/sobre/SobreCtaBlock";
import { SobreMvvBlock } from "@/components/site/sobre/SobreMvvBlock";
import { Section } from "@/components/site/Section";
import type { PublicAboutTeamMember } from "@/lib/about-team-data";
import type { AboutContentV1, PublicSiteView } from "@/lib/institutional-site/types";

type Props = { site: PublicSiteView; members: PublicAboutTeamMember[]; canManage: boolean };

export function SobrePageView({ site, members, canManage }: Props) {
  const router = useRouter();
  const [about, setAbout] = useState<AboutContentV1>(() => site.about);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(site.about));
  const a = canManage ? about : site.about;
  const dirty = canManage && JSON.stringify(about) !== savedJson;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const logo = site.scalars.logoUrl;
  const org = site.scalars.orgName;
  const historiaImageSrc = (a.historia?.imageUrl ?? "").trim() || logo;
  const valores = a.mvv?.valoresLines ?? [];
  const valoresText = valores.join("\n");

  const pushAbout = useCallback(
    (fn: (p: AboutContentV1) => AboutContentV1) => {
      if (!canManage) return;
      setAbout((p) => fn(structuredClone(p)));
      setMsg(null);
    },
    [canManage],
  );

  const onSave = () => {
    startTransition(async () => {
      const { saveAboutContentObjectAction } = await loadInstitutionalActions();
      const r = await saveAboutContentObjectAction(about);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSavedJson(JSON.stringify(about));
        router.refresh();
      }
    });
  };

  return (
    <div className={canManage && dirty ? "pb-24" : undefined}>
      <section className="gradient-animated text-white py-20 relative overflow-hidden particles-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-800/90" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up leading-tight text-white">
            {canManage ? (
              <InlinePencilText
                block
                enabled
                value={a.hero?.title ?? ""}
                onChange={(v) => pushAbout((p) => ({ ...p, hero: { ...p.hero, title: v } }))}
                className="text-white"
                editLabel="Título (destaque)"
              />
            ) : (
              <span className="text-white">{a.hero?.title ?? ""}</span>
            )}
          </h1>
          <p
            className="text-xl text-sky-100/95 animate-fade-in-up font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
            style={{ animationDelay: "0.2s" }}
          >
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={a.hero?.subtitle ?? ""}
                onChange={(v) => pushAbout((p) => ({ ...p, hero: { ...p.hero, subtitle: v } }))}
                className="text-sky-100/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                editLabel="Subtítulo (destaque)"
              />
            ) : (
              a.hero?.subtitle ?? ""
            )}
          </p>
        </div>
      </section>

      <Section title="Nossa História" className="bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <p className="mb-4 font-medium">
                {canManage ? (
                  <InlinePencilText
                    multiline
                    enabled
                    value={a.historia?.p1 ?? ""}
                    onChange={(v) => pushAbout((p) => ({ ...p, historia: { ...p.historia, p1: v } }))}
                    className="text-gradient-subtle"
                    editLabel="Parágrafo (história 1)"
                  />
                ) : (
                  <span className="text-gradient-subtle whitespace-pre-line">{a.historia?.p1 ?? ""}</span>
                )}
              </p>
              <p className="mb-4 font-medium">
                {canManage ? (
                  <InlinePencilText
                    multiline
                    enabled
                    value={a.historia?.p2 ?? ""}
                    onChange={(v) => pushAbout((p) => ({ ...p, historia: { ...p.historia, p2: v } }))}
                    className="text-gradient-subtle"
                    editLabel="Parágrafo (história 2)"
                  />
                ) : (
                  <span className="text-gradient-subtle whitespace-pre-line">{a.historia?.p2 ?? ""}</span>
                )}
              </p>
            </div>
            <div className="w-full h-64 md:h-80 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden group flex flex-col items-center justify-center p-6 md:p-8 relative">
              {canManage ? (
                <p className="w-full text-xs text-amber-800/80 mb-2 self-start z-20">
                  Imagem ao lado do texto (URL). Vazio = mesmo logótipo do cabeçalho.
                </p>
              ) : null}
              {canManage ? (
                <div className="w-full mb-2 z-20">
                  <InlinePencilText
                    block
                    enabled
                    value={a.historia?.imageUrl ?? ""}
                    onChange={(v) =>
                      pushAbout((p) => ({ ...p, historia: { ...p.historia, imageUrl: v } }))
                    }
                    className="w-full break-all text-sm text-slate-800 font-mono"
                    editLabel="Editar URL da imagem (Nossa História)"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 w-full min-h-0 items-center justify-center">
                <img
                  src={historiaImageSrc}
                  alt={`Nossa história — ${org}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105 relative z-10 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <SobreMvvBlock
        a={a}
        canManage={canManage}
        valores={valores}
        valoresText={valoresText}
        pushAbout={pushAbout}
      />

      <Section title="Nossa Equipe" subtitle="Pessoas dedicadas que fazem a diferença" className="bg-white">
        <AboutTeamSection members={members} canManage={canManage} />
      </Section>

      <SobreCtaBlock a={a} canManage={canManage} pushAbout={pushAbout} />

      {canManage && dirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-lg">
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
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {pending ? "A guardar…" : "Guardar alterações (Sobre)"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
