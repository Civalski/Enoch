"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { saveEstudosContentObjectAction } from "@/app/app/institucional/actions";
import { EstudosListSection } from "@/components/site/estudos/EstudosListSection";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import type { StudyResourcesPageResult } from "@/lib/study-list-public";
import type { StudyResourceKind } from "@/lib/study-kinds-constants";
import type { EstudosContentV1 } from "@/lib/institutional-site/types";

/** Remove `meta.description` (não usada). Ao guardar, `meta.title` segue o título em destaque (aba/SEO). */
function estudosContentWithoutMetaDescription(input: EstudosContentV1): EstudosContentV1 {
  const e = structuredClone(input);
  if (e.meta && "description" in e.meta) {
    const { description: _removed, ...rest } = e.meta;
    e.meta = Object.keys(rest).length > 0 ? rest : undefined;
  }
  return e;
}

function estudosPayloadForSave(input: EstudosContentV1): EstudosContentV1 {
  const e = estudosContentWithoutMetaDescription(input);
  const headerTitle = (e.pageHeader?.title ?? "").trim();
  const fallbackMeta = (e.meta?.title ?? "Estudos").trim() || "Estudos";
  e.meta = { title: headerTitle.length > 0 ? headerTitle : fallbackMeta };
  return e;
}

type Props = {
  result: StudyResourcesPageResult;
  filterKind: StudyResourceKind | undefined;
  /** Listar/editar materiais (backoffice). */
  canManage: boolean;
  /** Editar títulos da página no local (gestão institucional). */
  canEditPageCopy: boolean;
  initialEstudos: EstudosContentV1;
};

export function EstudosPageView({
  result,
  filterKind,
  canManage,
  canEditPageCopy,
  initialEstudos,
}: Props) {
  const router = useRouter();
  const [estudos, setEstudos] = useState<EstudosContentV1>(() =>
    estudosContentWithoutMetaDescription(initialEstudos),
  );
  const [savedJson, setSavedJson] = useState(() =>
    JSON.stringify(estudosContentWithoutMetaDescription(initialEstudos)),
  );
  const e = canEditPageCopy ? estudos : initialEstudos;
  const dirty = canEditPageCopy && JSON.stringify(estudos) !== savedJson;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const prevInitial = useRef<string | null>(null);
  useEffect(() => {
    const s = JSON.stringify(initialEstudos);
    if (prevInitial.current === s) return;
    prevInitial.current = s;
    const normalized = estudosContentWithoutMetaDescription(JSON.parse(s) as EstudosContentV1);
    setEstudos(normalized);
    setSavedJson(JSON.stringify(normalized));
  }, [initialEstudos]);

  const push = useCallback(
    (fn: (p: EstudosContentV1) => EstudosContentV1) => {
      if (!canEditPageCopy) return;
      setEstudos((p) => fn(structuredClone(p)));
      setMsg(null);
    },
    [canEditPageCopy],
  );

  const onSave = () => {
    startTransition(async () => {
      const payload = estudosPayloadForSave(estudos);
      const r = await saveEstudosContentObjectAction(payload);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSavedJson(JSON.stringify(payload));
        router.refresh();
      }
    });
  };

  const ph = e.pageHeader ?? {};

  return (
    <div className={canEditPageCopy && dirty ? "pb-24" : undefined}>
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {canEditPageCopy ? (
                <InlinePencilText
                  block
                  enabled
                  pencilVariant="compact"
                  value={ph.title ?? ""}
                  onChange={(v) => push((p) => ({ ...p, pageHeader: { ...p.pageHeader, title: v } }))}
                  className="text-2xl font-semibold text-slate-900 tracking-tight"
                  inputClassName="text-2xl font-semibold"
                  editLabel="Título em destaque (página e aba do navegador)"
                />
              ) : (
                (ph.title ?? "Estudos")
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              {canEditPageCopy ? (
                <InlinePencilText
                  multiline
                  enabled
                  value={ph.subtitle ?? ""}
                  onChange={(v) => push((p) => ({ ...p, pageHeader: { ...p.pageHeader, subtitle: v } }))}
                  className="text-sm text-slate-500"
                  editLabel="Texto abaixo do título (Estudos)"
                />
              ) : (
                (ph.subtitle ?? "")
              )}
            </p>
          </div>
          {canManage ? (
            <Link
              href="/estudos/novo"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              + Novo material
            </Link>
          ) : null}
        </div>
      </header>

      <Section className="py-10">
        <EstudosListSection result={result} filterKind={filterKind} canManage={canManage} />
      </Section>

      {canEditPageCopy && dirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
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
              {pending ? "A guardar…" : "Guardar textos da página Estudos"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
