"use client";

import Link from "next/link";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import { participarRowsMerged, patchParticiparItem } from "@/lib/institutional-site/projetos-inline-patch";
import type { ProjetosContentV1 } from "@/lib/institutional-site/types";

type P = {
  p: ProjetosContentV1;
  canManage: boolean;
  pushProj: (fn: (x: ProjetosContentV1) => ProjetosContentV1) => void;
};

export function ProjetosPageParticiparSection({ p, canManage, pushProj }: P) {
  const pr = participarRowsMerged(p);

  return (
    <Section
      title={
        canManage ? (
          <InlinePencilText
            enabled
            value={p.participar?.title ?? ""}
            onChange={(v) => pushProj((x) => ({ ...x, participar: { ...x.participar, title: v } }))}
            className="text-gradient-heading"
            editLabel="Título — como participar"
          />
        ) : (
          (p.participar?.title ?? "")
        )
      }
      subtitle={
        canManage ? (
          <InlinePencilText
            multiline
            enabled
            value={p.participar?.subtitle ?? ""}
            onChange={(v) =>
              pushProj((x) => ({ ...x, participar: { ...x.participar, subtitle: v } }))
            }
            className="text-gradient-subtle font-medium"
            editLabel="Subtítulo — como participar"
          />
        ) : (
          (p.participar?.subtitle ?? "")
        )
      }
      className="bg-white"
    >
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {pr.map((row, idx) => (
          <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              {canManage ? (
                <InlinePencilText
                  enabled
                  value={row.n ?? ""}
                  onChange={(v) => pushProj((x) => patchParticiparItem(x, idx as 0 | 1 | 2, { n: v }))}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
                  editLabel={`Número cartão ${idx + 1}`}
                />
              ) : (
                (row.n ?? "")
              )}
            </div>
            <h3 className="font-bold text-gradient-heading mb-3">
              {canManage ? (
                <InlinePencilText
                  enabled
                  value={row.t ?? ""}
                  onChange={(v) => pushProj((x) => patchParticiparItem(x, idx as 0 | 1 | 2, { t: v }))}
                  className="font-bold text-gradient-heading"
                  editLabel={`Título cartão ${idx + 1}`}
                />
              ) : (
                (row.t ?? "")
              )}
            </h3>
            <p className="text-gradient-subtle font-medium">
              {canManage ? (
                <InlinePencilText
                  multiline
                  enabled
                  value={row.d ?? ""}
                  onChange={(v) => pushProj((x) => patchParticiparItem(x, idx as 0 | 1 | 2, { d: v }))}
                  className="text-gradient-subtle font-medium"
                  editLabel={`Texto cartão ${idx + 1}`}
                />
              ) : (
                (row.d ?? "")
              )}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 reveal">
        <Link
          href="/contato"
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
        >
          {canManage ? (
            <span className="inline-flex max-w-md justify-center">
              <InlinePencilText
                enabled
                value={p.participar?.ctaLabel ?? ""}
                onChange={(v) =>
                  pushProj((x) => ({ ...x, participar: { ...x.participar, ctaLabel: v } }))
                }
                className="text-white font-medium"
                editLabel="Texto do botão (Contacto)"
              />
            </span>
          ) : (
            (p.participar?.ctaLabel ?? "Entre em Contato")
          )}
        </Link>
      </div>
    </Section>
  );
}
