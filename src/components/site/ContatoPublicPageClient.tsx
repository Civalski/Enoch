"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { loadInstitutionalActions } from "@/lib/institutional-site/institutional-actions-client";
import { ContatoPublicDonationSection } from "@/components/site/ContatoPublicDonationSection";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import type { ContatoContentV1 } from "@/lib/institutional-site/types";

const titleClass =
  "text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg";
const subClass =
  "text-xl text-blue-100 animate-fade-in-up drop-shadow-md whitespace-pre-line";

type Props = {
  canEdit: boolean;
  initial: ContatoContentV1;
  mailto: string;
  children: ReactNode;
};

export function ContatoPublicPageClient({ canEdit, initial, mailto, children }: Props) {
  const router = useRouter();
  const [c, setC] = useState<ContatoContentV1>(() => initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const v = canEdit ? c : initial;
  const dirty = canEdit && JSON.stringify(c) !== saved;
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const prevInit = useRef<string | null>(null);

  useEffect(() => {
    const s = JSON.stringify(initial);
    if (prevInit.current === s) return;
    prevInit.current = s;
    setC(JSON.parse(s) as ContatoContentV1);
    setSaved(s);
  }, [initial]);

  const h = c.hero ?? {};
  const hero = v.hero ?? {};

  const push = useCallback(
    (fn: (p: ContatoContentV1) => ContatoContentV1) => {
      if (!canEdit) return;
      setC((p) => fn(structuredClone(p)));
      setMsg(null);
    },
    [canEdit],
  );

  const onSave = () => {
    startTransition(async () => {
      const { saveContatoContentObjectAction } = await loadInstitutionalActions();
      const r = await saveContatoContentObjectAction(c);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        setSaved(JSON.stringify(c));
        router.refresh();
      }
    });
  };

  return (
    <div className={canEdit && dirty ? "pb-20" : undefined}>
      <section className="gradient-animated text-white py-20 relative overflow-hidden particles-bg">
        <div className="absolute inset-0 bg-gradient-blue-subtle opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="mb-4">
            {canEdit ? (
              <InlinePencilText
                block
                enabled
                value={h.title ?? ""}
                onChange={(t) => push((p) => ({ ...p, hero: { ...p.hero, title: t } }))}
                className="inline-block max-w-full pb-1.5 text-4xl md:text-5xl font-bold leading-[1.15] bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg"
                inputClassName="text-4xl md:text-5xl font-bold text-slate-900"
                editLabel="Título no topo (página de contacto)"
              />
            ) : (
              <span className={titleClass}>{hero.title ?? ""}</span>
            )}
          </h1>
          <p className={subClass} style={{ animationDelay: "0.2s" }}>
            {canEdit ? (
              <InlinePencilText
                multiline
                enabled
                value={h.subtitle ?? ""}
                onChange={(t) => push((p) => ({ ...p, hero: { ...p.hero, subtitle: t } }))}
                className="text-xl text-blue-100"
                editLabel="Subtítulo (página de contacto)"
              />
            ) : (
              (hero.subtitle ?? "")
            )}
          </p>
        </div>
      </section>

      {children}

      <ContatoPublicDonationSection canEdit={canEdit} mailto={mailto} v={v} c={c} push={push} />

      {canEdit && dirty ? (
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
              {pending ? "A guardar…" : "Guardar página de contacto"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
