"use client";

import Link from "next/link";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import type { AboutContentV1 } from "@/lib/institutional-site/types";

type P = {
  a: AboutContentV1;
  canManage: boolean;
  pushAbout: (fn: (p: AboutContentV1) => AboutContentV1) => void;
};

export function SobreCtaBlock({ a, canManage, pushAbout }: P) {
  return (
    <Section className="gradient-animated text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-blue-subtle opacity-95" />
      <div className="text-center relative z-10">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
          {canManage ? (
            <InlinePencilText
              block
              enabled
              value={a.cta?.title ?? ""}
              onChange={(v) => pushAbout((p) => ({ ...p, cta: { ...p.cta, title: v } }))}
              className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              editLabel="Título (chamada final)"
            />
          ) : (
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {a.cta?.title ?? ""}
            </span>
          )}
        </h2>
        <p className="text-xl text-blue-100 mb-8 drop-shadow-md">
          {canManage ? (
            <InlinePencilText
              multiline
              enabled
              value={a.cta?.p ?? ""}
              onChange={(v) => pushAbout((p) => ({ ...p, cta: { ...p.cta, p: v } }))}
              className="text-blue-100"
              editLabel="Texto (chamada final)"
            />
          ) : (
            <span className="whitespace-pre-line">{a.cta?.p ?? ""}</span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {canManage ? (
            <InlinePencilText
              enabled
              asLink={{
                href: "/como-ajudar",
                className:
                  "inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform",
              }}
              value={a.cta?.primaryLabel ?? ""}
              onChange={(v) => pushAbout((p) => ({ ...p, cta: { ...p.cta, primaryLabel: v } }))}
              editLabel="Texto do botão principal"
            />
          ) : (
            <Link
              href="/como-ajudar"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {a.cta?.primaryLabel ?? ""}
            </Link>
          )}
          {canManage ? (
            <InlinePencilText
              enabled
              asLink={{
                href: "/contato",
                className:
                  "inline-block bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform",
              }}
              value={a.cta?.secondaryLabel ?? ""}
              onChange={(v) => pushAbout((p) => ({ ...p, cta: { ...p.cta, secondaryLabel: v } }))}
              editLabel="Texto do botão secundário"
            />
          ) : (
            <Link
              href="/contato"
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {a.cta?.secondaryLabel ?? ""}
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}
