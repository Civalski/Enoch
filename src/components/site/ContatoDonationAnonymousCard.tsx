"use client";

import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { PixCopyButton } from "@/components/site/PixCopyButton";
import type { ContatoDoacaoAnonimaV1, ContatoContentV1 } from "@/lib/institutional-site/types";

type Props = {
  canEdit: boolean;
  da: ContatoDoacaoAnonimaV1;
  ca: ContatoDoacaoAnonimaV1;
  push: (fn: (p: ContatoContentV1) => ContatoContentV1) => void;
};

export function ContatoDonationAnonymousCard({ canEdit, da, ca, push }: Props) {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {canEdit ? (
                <InlinePencilText
                  block
                  enabled
                  pencilVariant="compact"
                  value={ca.title ?? da.title ?? ""}
                  onChange={(t) => push((p) => ({ ...p, doacaoAnonima: { ...p.doacaoAnonima, title: t } }))}
                  className="inline-block text-xl font-bold text-gray-900"
                  editLabel="Título (doação anónima)"
                />
              ) : (
                (da.title ?? "")
              )}
            </h3>
            <div className="text-gray-700 mb-4">
              {canEdit ? (
                <InlinePencilText
                  multiline
                  enabled
                  pencilVariant="compact"
                  value={ca.body ?? da.body ?? ""}
                  onChange={(t) => push((p) => ({ ...p, doacaoAnonima: { ...p.doacaoAnonima, body: t } }))}
                  className="text-base text-gray-700"
                  editLabel="Texto (doação anónima)"
                />
              ) : (
                (da.body ?? "")
              )}
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                {canEdit ? (
                  <InlinePencilText
                    enabled
                    pencilVariant="compact"
                    value={ca.pixLabel ?? da.pixLabel ?? ""}
                    onChange={(t) =>
                      push((p) => ({ ...p, doacaoAnonima: { ...p.doacaoAnonima, pixLabel: t } }))
                    }
                    className="inline text-sm font-medium"
                    editLabel="Etiqueta acima da chave PIX anónima"
                  />
                ) : (
                  (da.pixLabel ?? "")
                )}
              </p>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <code className="text-base font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 flex-1 break-all min-w-0">
                  {canEdit ? (
                    <InlinePencilText
                      multiline
                      enabled
                      pencilVariant="compact"
                      value={ca.pixKey ?? da.pixKey ?? ""}
                      onChange={(t) =>
                        push((p) => ({ ...p, doacaoAnonima: { ...p.doacaoAnonima, pixKey: t } }))
                      }
                      className="block font-mono text-sm text-gray-900 w-full"
                      editLabel="Chave PIX anónima"
                    />
                  ) : (
                    (da.pixKey ?? "")
                  )}
                </code>
                <PixCopyButton pixKey={(canEdit ? ca.pixKey : da.pixKey) ?? ""} />
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              {canEdit ? (
                <InlinePencilText
                  multiline
                  enabled
                  pencilVariant="compact"
                  value={ca.footer ?? da.footer ?? ""}
                  onChange={(t) =>
                    push((p) => ({ ...p, doacaoAnonima: { ...p.doacaoAnonima, footer: t } }))
                  }
                  className="text-sm text-gray-600 italic"
                  editLabel="Nota final (doação anónima)"
                />
              ) : (
                (da.footer ?? "")
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
