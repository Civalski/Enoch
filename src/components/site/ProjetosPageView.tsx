"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { saveProjetosContentObjectAction } from "@/app/app/institucional/actions";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { ProjetosPageImpactSection } from "@/components/site/projetos/ProjetosPageImpactSection";
import { ProjetosPageParticiparSection } from "@/components/site/projetos/ProjetosPageParticiparSection";
import { ProjetosCardsGrid } from "@/components/site/ProjetosCardsGrid";
import { Section } from "@/components/site/Section";
import type { MergedProject } from "@/lib/project-data";
import type { ProjetosContentV1, PublicSiteView } from "@/lib/institutional-site/types";

type Props = { site: PublicSiteView; projetos: MergedProject[]; canManage: boolean };

export function ProjetosPageView({ site, projetos, canManage }: Props) {
  const router = useRouter();
  const [proj, setProj] = useState<ProjetosContentV1>(() => site.projetos);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(site.projetos));
  const p = canManage ? proj : site.projetos;
  const dirty = canManage && JSON.stringify(proj) !== savedJson;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const pushProj = useCallback(
    (fn: (x: ProjetosContentV1) => ProjetosContentV1) => {
      if (!canManage) return;
      setProj((x) => fn(structuredClone(x)));
      setMsg(null);
    },
    [canManage],
  );

  const onSave = () => {
    startTransition(async () => {
      const r = await saveProjetosContentObjectAction(proj);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSavedJson(JSON.stringify(proj));
        router.refresh();
      }
    });
  };

  return (
    <div className={canManage && dirty ? "pb-24" : undefined}>
      <section className="gradient-animated text-white py-20 relative overflow-hidden particles-bg">
        <div className="absolute inset-0 bg-gradient-blue-subtle opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
            {canManage ? (
              <InlinePencilText
                block
                enabled
                value={p.hero?.title ?? ""}
                onChange={(v) => pushProj((x) => ({ ...x, hero: { ...x.hero, title: v } }))}
                className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white"
                editLabel="Título (destaque Projetos)"
              />
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                {p.hero?.title ?? ""}
              </span>
            )}
          </h1>
          <p
            className="text-xl text-blue-100 animate-fade-in-up drop-shadow-md"
            style={{ animationDelay: "0.2s" }}
          >
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={p.hero?.subtitle ?? ""}
                onChange={(v) => pushProj((x) => ({ ...x, hero: { ...x.hero, subtitle: v } }))}
                className="text-blue-100 drop-shadow-md"
                editLabel="Subtítulo (destaque Projetos)"
              />
            ) : (
              (p.hero?.subtitle ?? "")
            )}
          </p>
        </div>
      </section>

      <Section
        title={
          canManage ? (
            <InlinePencilText
              enabled
              value={p.emAndamento?.title ?? ""}
              onChange={(v) => pushProj((x) => ({ ...x, emAndamento: { ...x.emAndamento, title: v } }))}
              className="text-gradient-heading"
              editLabel="Título secção em andamento"
            />
          ) : (
            (p.emAndamento?.title ?? "")
          )
        }
        subtitle={
          canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={p.emAndamento?.subtitle ?? ""}
              onChange={(v) =>
                pushProj((x) => ({ ...x, emAndamento: { ...x.emAndamento, subtitle: v } }))
              }
              className="text-gradient-subtle font-medium"
              editLabel="Subtítulo secção em andamento"
            />
          ) : (
            (p.emAndamento?.subtitle ?? "")
          )
        }
        className="bg-white"
      >
        {canManage && (
          <div className="flex justify-center md:justify-end mb-8">
            <Link
              href="/app/projetos/novo"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              Criar novo projeto
            </Link>
          </div>
        )}
        <ProjetosCardsGrid projects={projetos} canManage={canManage} />
      </Section>

      <ProjetosPageImpactSection p={p} canManage={canManage} pushProj={pushProj} />
      <ProjetosPageParticiparSection p={p} canManage={canManage} pushProj={pushProj} />

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
              {pending ? "A guardar…" : "Guardar alterações da página Projetos"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
