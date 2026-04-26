"use client";

import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import { DEFAULT_PROJETOS_V1 } from "@/lib/institutional-site/defaults";
import { impactRowsMerged, patchImpactItem } from "@/lib/institutional-site/projetos-inline-patch";
import type { ProjetosContentV1 } from "@/lib/institutional-site/types";

type P = {
  p: ProjetosContentV1;
  canManage: boolean;
  pushProj: (fn: (x: ProjetosContentV1) => ProjetosContentV1) => void;
};

export function ProjetosPageImpactSection({ p, canManage, pushProj }: P) {
  const ir = impactRowsMerged(p);
  const impactImage = (p.impacto?.imageUrl ?? "").trim() || DEFAULT_PROJETOS_V1.impacto?.imageUrl;

  return (
    <Section
      title={
        canManage ? (
          <InlinePencilText
            enabled
            value={p.impacto?.sectionTitle ?? ""}
            onChange={(v) => pushProj((x) => ({ ...x, impacto: { ...x.impacto, sectionTitle: v } }))}
            className="text-gradient-heading"
            editLabel="Título impacto"
          />
        ) : (
          (p.impacto?.sectionTitle ?? "")
        )
      }
      className="bg-gray-50"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold text-gradient-heading mb-6">
            {canManage ? (
              <InlinePencilText
                enabled
                value={p.impacto?.numbersTitle ?? ""}
                onChange={(v) =>
                  pushProj((x) => ({ ...x, impacto: { ...x.impacto, numbersTitle: v } }))
                }
                className="text-gradient-heading"
                editLabel="Números — título"
              />
            ) : (
              (p.impacto?.numbersTitle ?? "")
            )}
          </h3>
          <div className="space-y-4">
            {ir.map((row, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                  {canManage ? (
                    <InlinePencilText
                      enabled
                      value={row.n ?? ""}
                      onChange={(v) => pushProj((x) => patchImpactItem(x, idx as 0 | 1 | 2, { n: v }))}
                      className="text-white font-bold"
                      editLabel={`Marca — linha ${idx + 1}`}
                    />
                  ) : (
                    <span className="text-white font-bold">{row.n}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {canManage ? (
                      <InlinePencilText
                        enabled
                        value={row.h ?? ""}
                        onChange={(v) => pushProj((x) => patchImpactItem(x, idx as 0 | 1 | 2, { h: v }))}
                        className="font-bold text-gray-900"
                        editLabel={`Título estatística ${idx + 1}`}
                      />
                    ) : (
                      (row.h ?? "")
                    )}
                  </h4>
                  <p className="text-gray-600">
                    {canManage ? (
                      <InlinePencilText
                        multiline
                        enabled
                        value={row.sub ?? ""}
                        onChange={(v) =>
                          pushProj((x) => patchImpactItem(x, idx as 0 | 1 | 2, { sub: v }))
                        }
                        className="text-gray-600"
                        editLabel={`Texto estatística ${idx + 1}`}
                      />
                    ) : (
                      (row.sub ?? "")
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-96 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm group">
          {canManage ? (
            <div className="relative w-full h-full">
              <img
                src={impactImage}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-2 left-2 right-2 rounded bg-black/50 p-2">
                <InlinePencilText
                  enabled
                  value={(p.impacto?.imageUrl ?? "").trim()}
                  onChange={(v) => pushProj((x) => ({ ...x, impacto: { ...x.impacto, imageUrl: v } }))}
                  className="text-white text-xs"
                  inputClassName="text-black"
                  editLabel="URL da imagem (impacto)"
                />
              </div>
            </div>
          ) : (
            <img
              src={impactImage}
              alt={p.impacto?.sectionTitle ?? "Impacto dos projetos"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
