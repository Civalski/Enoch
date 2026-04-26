"use client";

import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { Section } from "@/components/site/Section";
import type { AboutContentV1 } from "@/lib/institutional-site/types";

type P = {
  a: AboutContentV1;
  canManage: boolean;
  valores: string[];
  valoresText: string;
  pushAbout: (fn: (p: AboutContentV1) => AboutContentV1) => void;
};

export function SobreMvvBlock({ a, canManage, valores, valoresText, pushAbout }: P) {
  return (
    <Section title="Missão, Visão e Valores" className="bg-gray-50">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gradient-heading mb-3">Missão</h3>
          <p className="font-medium">
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={a.mvv?.missao ?? ""}
                onChange={(v) => pushAbout((p) => ({ ...p, mvv: { ...p.mvv, missao: v } }))}
                className="text-gradient-subtle"
                editLabel="Missão (texto)"
              />
            ) : (
              <span className="text-gradient-subtle whitespace-pre-line">{a.mvv?.missao ?? ""}</span>
            )}
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gradient-heading mb-3">Visão</h3>
          <p className="font-medium">
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={a.mvv?.visao ?? ""}
                onChange={(v) => pushAbout((p) => ({ ...p, mvv: { ...p.mvv, visao: v } }))}
                className="text-gradient-subtle"
                editLabel="Visão (texto)"
              />
            ) : (
              <span className="text-gradient-subtle whitespace-pre-line">{a.mvv?.visao ?? ""}</span>
            )}
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">
            {canManage ? (
              <InlinePencilText
                enabled
                value={a.mvv?.valoresTitle ?? "Valores"}
                onChange={(v) => pushAbout((p) => ({ ...p, mvv: { ...p.mvv, valoresTitle: v } }))}
                className="text-gray-900"
                editLabel="Título (valores)"
              />
            ) : (
              <span className="text-gray-900">{a.mvv?.valoresTitle ?? "Valores"}</span>
            )}
          </h3>
          <div className="text-gray-600 space-y-2">
            {canManage ? (
              <InlinePencilText
                multiline
                enabled
                value={valoresText}
                onChange={(v) => {
                  const lines = v
                    .split(/\r?\n/)
                    .map((l) => l.trim())
                    .filter((l) => l.length > 0);
                  pushAbout((p) => ({ ...p, mvv: { ...p.mvv, valoresLines: lines } }));
                }}
                className="text-gray-600 w-full"
                editLabel="Valores (um por linha; o site mostra com marcador no modo público)"
              />
            ) : (
              <ul className="space-y-2">
                {valores.map((line, i) => (
                  <li key={`${i}-${line}`}>• {line}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
