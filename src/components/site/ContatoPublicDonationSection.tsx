"use client";

import Link from "next/link";
import { ContatoDonationAnonymousCard } from "@/components/site/ContatoDonationAnonymousCard";
import { ContatoDonationBankMaterialsGrid } from "@/components/site/ContatoDonationBankMaterialsGrid";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import type { ContatoContentV1 } from "@/lib/institutional-site/types";

type Props = {
  canEdit: boolean;
  mailto: string;
  v: ContatoContentV1;
  c: ContatoContentV1;
  push: (fn: (p: ContatoContentV1) => ContatoContentV1) => void;
};

export function ContatoPublicDonationSection({ canEdit, mailto, v, c, push }: Props) {
  const ds = v.doarSection ?? {};
  const dt = v.doacaoTransferencia ?? {};
  const dm = v.doacaoMateriais ?? {};
  const da = v.doacaoAnonima ?? {};
  const ch = c.doacaoTransferencia ?? {};
  const cm = c.doacaoMateriais ?? {};
  const ca = c.doacaoAnonima ?? {};
  const cds = c.doarSection ?? {};
  const itemsLines = (cm.items ?? []).join("\n");

  return (
    <Section
      id="doar"
      title={
        canEdit ? (
          <InlinePencilText
            block
            enabled
            value={cds.title ?? ds.title ?? ""}
            onChange={(t) => push((p) => ({ ...p, doarSection: { ...p.doarSection, title: t } }))}
            className="inline-block text-3xl md:text-4xl font-bold text-gradient-heading"
            inputClassName="text-2xl font-bold text-slate-900"
            editLabel="Título da secção de doações"
          />
        ) : (
          (ds.title ?? "")
        )
      }
      subtitle={
        canEdit ? (
          <InlinePencilText
            multiline
            enabled
            value={cds.subtitle ?? ds.subtitle ?? ""}
            onChange={(t) => push((p) => ({ ...p, doarSection: { ...p.doarSection, subtitle: t } }))}
            className="text-lg font-medium text-gradient-subtle max-w-2xl mx-auto"
            editLabel="Subtítulo da secção de doações"
          />
        ) : (
          (ds.subtitle ?? "")
        )
      }
      className="bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <ContatoDonationBankMaterialsGrid
          canEdit={canEdit}
          dt={dt}
          ch={ch}
          dm={dm}
          cm={cm}
          itemsLines={itemsLines}
          push={push}
        />
        <ContatoDonationAnonymousCard canEdit={canEdit} da={da} ca={ca} push={push} />
        <div className="text-center">
          <p className="text-gradient-subtle mb-4 font-medium">
            {canEdit ? (
              <InlinePencilText
                multiline
                enabled
                pencilVariant="compact"
                value={cds.transparencyNote ?? ds.transparencyNote ?? ""}
                onChange={(t) =>
                  push((p) => ({ ...p, doarSection: { ...p.doarSection, transparencyNote: t } }))
                }
                className="text-base font-medium text-gradient-subtle"
                editLabel="Texto de transparência (antes do botão)"
              />
            ) : (
              (ds.transparencyNote ?? "")
            )}
          </p>
          {canEdit ? (
            <InlinePencilText
              enabled
              pencilVariant="compact"
              value={cds.ctaLabel ?? ds.ctaLabel ?? ""}
              onChange={(t) => push((p) => ({ ...p, doarSection: { ...p.doarSection, ctaLabel: t } }))}
              className="inline text-white font-medium"
              inputClassName="text-slate-900"
              editLabel="Texto do botão de contacto"
              asLink={{
                href: mailto,
                className:
                  "inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform",
              }}
            />
          ) : (
            <Link
              href={mailto}
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {ds.ctaLabel ?? ""}
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}
