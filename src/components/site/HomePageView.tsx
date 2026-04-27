"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { loadInstitutionalActions } from "@/lib/institutional-site/institutional-actions-client";
import { Hero } from "@/components/site/Hero";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Preloader } from "@/components/site/Preloader";
import { Section } from "@/components/site/Section";
import { HomeProjetosBlock } from "@/components/site/home/HomeProjetosBlock";
import { HomeStatsComoLocBlock } from "@/components/site/home/HomeStatsComoLocBlock";
import { DEFAULT_HERO_BACKGROUND_IMAGE } from "@/lib/institutional-site/defaults";
import type { HomeContentV1, PublicSiteView } from "@/lib/institutional-site/types";

type Props = { site: PublicSiteView; canManage: boolean };

export function HomePageView({ site, canManage }: Props) {
  const router = useRouter();
  const [home, setHome] = useState<HomeContentV1>(() => site.home);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(site.home));
  const h = canManage ? home : site.home;
  const dirty = canManage && JSON.stringify(home) !== savedJson;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const sc = site.scalars;
  const mapSrc = sc.mapEmbedUrl;
  const missionImageSrc = (h.quemSomos?.missionImageUrl ?? "").trim() || sc.logoUrl;
  const rawHeroImageUrl = (h.hero?.imageUrl ?? "").trim();
  const heroImageSrc = rawHeroImageUrl || DEFAULT_HERO_BACKGROUND_IMAGE;

  const pushHome = useCallback(
    (fn: (p: HomeContentV1) => HomeContentV1) => {
      if (!canManage) return;
      setHome((p) => fn(structuredClone(p)));
      setMsg(null);
    },
    [canManage],
  );

  const onSave = () => {
    startTransition(async () => {
      const { saveHomeContentObjectAction } = await loadInstitutionalActions();
      const r = await saveHomeContentObjectAction(home);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSavedJson(JSON.stringify(home));
        router.refresh();
      }
    });
  };

  return (
    <div className={canManage && dirty ? "pb-24" : undefined}>
      <Preloader logoUrl={sc.logoUrl} orgName={sc.orgName} />
      {canManage ? (
        <div className="relative z-30 border-b border-amber-200 bg-amber-50/95 px-4 py-2 text-slate-800">
          <p className="mb-1 text-xs text-amber-900/90">
            Imagem de fundo do destaque (URL). Vazio = imagem predefinida. Guarde as alterações em baixo
            para aplicar.
          </p>
          <InlinePencilText
            block
            enabled
            value={h.hero?.imageUrl ?? ""}
            onChange={(v) => pushHome((p) => ({ ...p, hero: { ...p.hero, imageUrl: v } }))}
            className="w-full break-all text-sm font-mono"
            editLabel="Editar URL da imagem de fundo do destaque"
          />
        </div>
      ) : null}
      <Hero
        imageSrc={heroImageSrc}
        title={
          canManage ? (
            <InlinePencilText
              block
              enabled
              value={h.hero?.title ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, hero: { ...p.hero, title: v } }))}
              className="bg-clip-text text-transparent bg-gradient-to-r from-white from-[28%] via-sky-200 to-blue-600"
              editLabel="Editar título do destaque"
            />
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white from-[28%] via-sky-200 to-blue-600">
              {h.hero?.title ?? ""}
            </span>
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={h.hero?.subtitle ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, hero: { ...p.hero, subtitle: v } }))}
              className="text-sky-100/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
              editLabel="Editar subtítulo do destaque"
            />
          ) : h.hero?.subtitle ? (
            h.hero.subtitle
          ) : undefined
        }
      />

      <Section
        title={
          canManage ? (
            <InlinePencilText
              enabled
              value={h.quemSomos?.sectionTitle ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, sectionTitle: v } }))}
              className="text-gradient-heading"
              editLabel="Editar título da secção Quem somos"
            />
          ) : (
            (h.quemSomos?.sectionTitle ?? "")
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={h.quemSomos?.sectionSubtitle ?? ""}
              onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, sectionSubtitle: v } }))}
              className="text-gradient-subtle"
              editLabel="Editar subtítulo da secção Quem somos"
            />
          ) : (
            (h.quemSomos?.sectionSubtitle ?? "")
          )
        }
        className="bg-white relative overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="reveal">
            <h3 className="text-3xl font-bold mb-6">
              {canManage ? (
                <InlinePencilText
                  enabled
                  value={h.quemSomos?.missionHeading ?? ""}
                  onChange={(v) =>
                    pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, missionHeading: v } }))
                  }
                  className="text-gradient-heading"
                  editLabel="Editar título do bloco da missão"
                />
              ) : (
                <span className="text-gradient-heading">{h.quemSomos?.missionHeading ?? ""}</span>
              )}
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {canManage ? (
                <InlinePencilText
                  multiline
                  enabled
                  value={h.quemSomos?.p1 ?? ""}
                  onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, p1: v } }))}
                  className="text-gray-600"
                  editLabel="Editar primeiro parágrafo"
                />
              ) : (
                <span className="whitespace-pre-line">{h.quemSomos?.p1 ?? ""}</span>
              )}
            </p>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {canManage ? (
                <InlinePencilText
                  multiline
                  enabled
                  value={h.quemSomos?.p2 ?? ""}
                  onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, p2: v } }))}
                  className="text-gray-600"
                  editLabel="Editar segundo parágrafo"
                />
              ) : (
                <span className="whitespace-pre-line">{h.quemSomos?.p2 ?? ""}</span>
              )}
            </p>
            {canManage ? (
              <div className="space-y-1">
                <div className="text-xs text-amber-800/80">Texto do botão (editar o label; o destino continua a apontar para Sobre)</div>
                <InlinePencilText
                  enabled
                  asLink={{
                    href: "/sobre",
                    className:
                      "inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform",
                  }}
                  value={h.quemSomos?.ctaLabel ?? ""}
                  onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, ctaLabel: v } }))}
                  editLabel="Editar texto do botão (Quem somos)"
                />
              </div>
            ) : (
              <Link
                href="/sobre"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
              >
                {h.quemSomos?.ctaLabel ?? ""}
              </Link>
            )}
          </div>
          <div className="w-full h-96 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden reveal group flex flex-col items-center justify-center p-6 relative">
            {canManage ? (
              <p className="w-full text-xs text-amber-800/80 mb-2 self-start z-20">
                Imagem ao lado do texto (URL). Vazio = mesmo logótipo do cabeçalhor.
              </p>
            ) : null}
            {canManage ? (
              <div className="w-full mb-3 z-20">
                <InlinePencilText
                  block
                  enabled
                  value={h.quemSomos?.missionImageUrl ?? ""}
                  onChange={(v) => pushHome((p) => ({ ...p, quemSomos: { ...p.quemSomos, missionImageUrl: v } }))}
                  className="w-full break-all text-sm text-slate-800 font-mono"
                  editLabel="Editar URL da imagem (secção missão)"
                />
              </div>
            ) : null}
            <div className="flex flex-1 w-full min-h-0 items-center justify-center">
              <img
                src={missionImageSrc}
                alt={`Imagem — ${h.quemSomos?.missionHeading ?? "Missão"}`}
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105 relative z-10 bg-white"
              />
            </div>
          </div>
        </div>
      </Section>

      <HomeProjetosBlock h={h} canManage={canManage} pushHome={pushHome} />
      <HomeStatsComoLocBlock h={h} canManage={canManage} mapSrc={mapSrc} pushHome={pushHome} />

      {canManage && dirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 px-4 py-3 shadow-lg">
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
              {pending ? "A guardar…" : "Guardar alterações da página inicial"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
