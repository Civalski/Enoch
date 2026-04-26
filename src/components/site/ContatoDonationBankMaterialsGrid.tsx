"use client";

import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { PixCopyButton } from "@/components/site/PixCopyButton";
import type {
  ContatoDoacaoMateriaisV1,
  ContatoDoacaoTransferenciaV1,
  ContatoContentV1,
} from "@/lib/institutional-site/types";

type Props = {
  canEdit: boolean;
  dt: ContatoDoacaoTransferenciaV1;
  ch: ContatoDoacaoTransferenciaV1;
  dm: ContatoDoacaoMateriaisV1;
  cm: ContatoDoacaoMateriaisV1;
  itemsLines: string;
  push: (fn: (p: ContatoContentV1) => ContatoContentV1) => void;
};

export function ContatoDonationBankMaterialsGrid({
  canEdit,
  dt,
  ch,
  dm,
  cm,
  itemsLines,
  push,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gradient-heading mb-4">
          {canEdit ? (
            <InlinePencilText
              block
              enabled
              pencilVariant="compact"
              value={ch.blockTitle ?? dt.blockTitle ?? ""}
              onChange={(t) =>
                push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, blockTitle: t } }))
              }
              className="inline-block text-xl font-bold text-gradient-heading"
              editLabel="Título do bloco transferência/PIX"
            />
          ) : (
            (dt.blockTitle ?? "")
          )}
        </h3>
        <div className="text-gradient-subtle mb-4 font-medium">
          {canEdit ? (
            <InlinePencilText
              multiline
              enabled
              pencilVariant="compact"
              value={ch.intro ?? dt.intro ?? ""}
              onChange={(t) =>
                push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, intro: t } }))
              }
              className="text-base"
              editLabel="Texto introdutório (transferência)"
            />
          ) : (
            (dt.intro ?? "")
          )}
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Banco:</strong>{" "}
            {canEdit ? (
              <InlinePencilText
                enabled
                pencilVariant="compact"
                value={ch.bankName ?? dt.bankName ?? ""}
                onChange={(t) =>
                  push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, bankName: t } }))
                }
                className="inline"
                editLabel="Nome do banco"
              />
            ) : (
              (dt.bankName ?? "")
            )}
          </p>
          <p>
            <strong>Agência:</strong>{" "}
            {canEdit ? (
              <InlinePencilText
                enabled
                pencilVariant="compact"
                value={ch.agency ?? dt.agency ?? ""}
                onChange={(t) =>
                  push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, agency: t } }))
                }
                className="inline"
                editLabel="Agência"
              />
            ) : (
              (dt.agency ?? "")
            )}
          </p>
          <p>
            <strong>Conta:</strong>{" "}
            {canEdit ? (
              <InlinePencilText
                enabled
                pencilVariant="compact"
                value={ch.account ?? dt.account ?? ""}
                onChange={(t) =>
                  push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, account: t } }))
                }
                className="inline"
                editLabel="Conta"
              />
            ) : (
              (dt.account ?? "")
            )}
          </p>
          {(canEdit || (dt.beneficiary ?? "").trim().length > 0) && (
            <p>
              <strong>Titular / CNPJ:</strong>{" "}
              {canEdit ? (
                <InlinePencilText
                  enabled
                  pencilVariant="compact"
                  value={ch.beneficiary ?? dt.beneficiary ?? ""}
                  onChange={(t) =>
                    push((p) => ({
                      ...p,
                      doacaoTransferencia: { ...p.doacaoTransferencia, beneficiary: t },
                    }))
                  }
                  className="inline"
                  editLabel="Titular ou CNPJ"
                />
              ) : (
                (dt.beneficiary ?? "")
              )}
            </p>
          )}
          <p className="flex flex-wrap items-center gap-2">
            <strong>PIX:</strong>{" "}
            {canEdit ? (
              <InlinePencilText
                enabled
                pencilVariant="compact"
                value={ch.pixKey ?? dt.pixKey ?? ""}
                onChange={(t) =>
                  push((p) => ({ ...p, doacaoTransferencia: { ...p.doacaoTransferencia, pixKey: t } }))
                }
                className="inline break-all min-w-0 flex-1"
                editLabel="Chave PIX"
              />
            ) : (
              <span className="break-all min-w-0 flex-1">{dt.pixKey ?? ""}</span>
            )}
            <PixCopyButton pixKey={(canEdit ? ch.pixKey : dt.pixKey) ?? ""} />
          </p>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gradient-heading mb-4">
          {canEdit ? (
            <InlinePencilText
              block
              enabled
              pencilVariant="compact"
              value={cm.blockTitle ?? dm.blockTitle ?? ""}
              onChange={(t) =>
                push((p) => ({ ...p, doacaoMateriais: { ...p.doacaoMateriais, blockTitle: t } }))
              }
              className="inline-block text-xl font-bold text-gradient-heading"
              editLabel="Título do bloco materiais"
            />
          ) : (
            (dm.blockTitle ?? "")
          )}
        </h3>
        <div className="text-gradient-subtle mb-4 font-medium">
          {canEdit ? (
            <InlinePencilText
              multiline
              enabled
              pencilVariant="compact"
              value={cm.intro ?? dm.intro ?? ""}
              onChange={(t) =>
                push((p) => ({ ...p, doacaoMateriais: { ...p.doacaoMateriais, intro: t } }))
              }
              className="text-base"
              editLabel="Intro (materiais)"
            />
          ) : (
            (dm.intro ?? "")
          )}
        </div>
        {canEdit ? (
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1">Lista (uma linha por item)</p>
            <InlinePencilText
              multiline
              enabled
              pencilVariant="compact"
              value={itemsLines}
              onChange={(raw) => {
                const items = raw
                  .split(/\r?\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 30);
                push((p) => ({ ...p, doacaoMateriais: { ...p.doacaoMateriais, items } }));
              }}
              className="text-sm text-gray-700 whitespace-pre-wrap border border-dashed border-slate-300 rounded p-2 min-h-[6rem]"
              editLabel="Itens aceites (materiais)"
            />
          </div>
        ) : (
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {(dm.items ?? []).map((line, i) => (
              <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>
            ))}
          </ul>
        )}
        <p className="text-gray-600 mt-4 text-sm">
          {canEdit ? (
            <InlinePencilText
              multiline
              enabled
              pencilVariant="compact"
              value={cm.footer ?? dm.footer ?? ""}
              onChange={(t) =>
                push((p) => ({ ...p, doacaoMateriais: { ...p.doacaoMateriais, footer: t } }))
              }
              className="text-sm text-gray-600"
              editLabel="Nota de rodapé (materiais)"
            />
          ) : (
            (dm.footer ?? "")
          )}
        </p>
      </div>
    </div>
  );
}
