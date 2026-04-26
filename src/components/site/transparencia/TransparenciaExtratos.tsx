"use client";

import { Fragment, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { ExtratoMonthPublic } from "@/lib/transparency-extrato";
import { PencilIcon } from "@/components/site/inline-edit/PencilIcon";
import { TrashIcon } from "@/components/site/inline-edit/TrashIcon";
import { deleteTransparencyExpenseAction } from "@/app/app/(backoffice)/transparencia/actions";
import { TransparencyExpenseEditForm, type TransparencyExpenseRow } from "@/components/app/TransparencyInlineForms";
import { ConfirmDestructiveDialog } from "@/components/ui/ConfirmDestructiveDialog";

function formatBrl(amount: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function lineToExpenseRow(line: ExtratoMonthPublic["expenseLines"][number]): TransparencyExpenseRow {
  return {
    id: line.id,
    category: line.category,
    amount: String(line.amount),
    spentAtMs: line.spentAtMs,
    description: line.description,
  };
}

type Props = {
  rows: ExtratoMonthPublic[];
  canManage?: boolean;
};

export function TransparenciaExtratos({ rows, canManage = false }: Props) {
  const router = useRouter();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    categoryLabel: string;
    amountLabel: string;
  } | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
              <tr>
                {["Mês/Ano", "Receitas", "Despesas", "Saldo", "Ações"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-sm font-semibold bg-gradient-to-r from-white/90 to-white bg-clip-text text-transparent drop-shadow-sm ${
                      h === "Ações" ? "text-center" : h !== "Mês/Ano" ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r, i) => {
                const open = openKey === r.key;
                const stripe = i % 2 === 1 ? "bg-gray-50/50" : "";
                return (
                  <Fragment key={r.key}>
                    <tr className={`hover:bg-gray-50 transition-colors ${stripe}`}>
                      <td className="px-6 py-4 text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                        {r.label}
                      </td>
                      <td className="px-6 py-4 text-sm text-right bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
                        {formatBrl(r.receitas)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent font-semibold">
                        {formatBrl(r.despesas)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                        {formatBrl(r.saldo)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                          onClick={() => setOpenKey(open ? null : r.key)}
                          aria-expanded={open}
                        >
                          {open ? "Ocultar" : "Ver detalhes"}
                        </button>
                      </td>
                    </tr>
                    {open ? (
                      <tr className={stripe}>
                        <td colSpan={5} className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                          {r.expenseLines.length === 0 ? (
                            <p className="text-sm text-slate-600">Nenhuma despesa registada neste mês.</p>
                          ) : (
                            <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                              {r.expenseLines.map((line) => (
                                <ExtratoDespesaLinha
                                  key={line.id}
                                  line={line}
                                  canManage={canManage}
                                  editing={editingExpenseId === line.id}
                                  onStartEdit={() => setEditingExpenseId(line.id)}
                                  onCancelEdit={() => setEditingExpenseId(null)}
                                  onSaved={() => {
                                    setEditingExpenseId(null);
                                    refresh();
                                  }}
                                  onRequestDelete={() =>
                                    setDeleteTarget({
                                      id: line.id,
                                      categoryLabel: line.categoryLabel,
                                      amountLabel: formatBrl(line.amount),
                                    })
                                  }
                                />
                              ))}
                            </ul>
                          )}
                          {canManage && r.expenseLines.length > 0 ? (
                            <p className="mt-3 text-xs text-slate-500">
                              Lápis: editar despesa. Lixo: apagar. As alterações refletem-se no resumo e na destinação.
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-center">
            <em className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent font-medium">
              Os extratos refletem os últimos seis meses: receitas (doações registadas), despesas por categoria e saldo
              mensal. Para mais informações, entre em contato conosco.
            </em>
          </p>
        </div>
      </div>

      <ConfirmDestructiveDialog
        open={deleteTarget != null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remover despesa?"
        description={
          deleteTarget
            ? `Será apagado o registo «${deleteTarget.categoryLabel}» (${deleteTarget.amountLabel}). Esta ação não pode ser anulada.`
            : ""
        }
        confirmLabel="Sim, apagar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!deleteTarget) return { ok: false, message: "Nada para apagar." };
          const res = await deleteTransparencyExpenseAction(deleteTarget.id);
          if (res.ok) {
            setEditingExpenseId(null);
            refresh();
            return { ok: true };
          }
          return { ok: false, message: res.message };
        }}
      />
    </div>
  );
}

function ExtratoDespesaLinha({
  line,
  canManage,
  editing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onRequestDelete,
}: {
  line: ExtratoMonthPublic["expenseLines"][number];
  canManage: boolean;
  editing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaved: () => void;
  onRequestDelete: () => void;
}) {
  if (editing) {
    return (
      <li className="px-4 py-3">
        <TransparencyExpenseEditForm
          row={lineToExpenseRow(line)}
          onCancel={onCancelEdit}
          onSaved={onSaved}
        />
      </li>
    );
  }

  return (
    <li className="px-4 py-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-slate-900">{line.categoryLabel}</span>
            <span className="tabular-nums font-semibold text-red-700">{formatBrl(line.amount)}</span>
          </div>
          {line.description ? <p className="mt-1 text-xs text-slate-600">{line.description}</p> : null}
        </div>
        {canManage ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700"
              aria-label={`Editar despesa: ${line.categoryLabel}`}
              onClick={onStartEdit}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-700"
              aria-label={`Apagar despesa: ${line.categoryLabel}`}
              onClick={onRequestDelete}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
