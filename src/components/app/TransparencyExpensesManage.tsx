"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTransparencyExpenseAction } from "@/app/app/(backoffice)/transparencia/actions";
import {
  TransparencyExpenseEditForm,
  type TransparencyExpenseRow,
} from "@/components/app/TransparencyInlineForms";
import { TRANSPARENCY_CATEGORY_PRESENTATION } from "@/lib/transparency-categories";
import { ConfirmDestructiveDialog } from "@/components/ui/ConfirmDestructiveDialog";

export type { TransparencyExpenseRow };

function formatBrl(amountStr: string): string {
  const n = Number(amountStr.replace(",", "."));
  if (!Number.isFinite(n)) return amountStr;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function formatDatePt(ms: number): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(ms),
  );
}

type Props = {
  expenses: TransparencyExpenseRow[];
};

export function TransparencyExpensesManage({ expenses }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransparencyExpenseRow | null>(null);

  return (
    <div className="space-y-3">
      {expenses.length === 0 ? (
        <p className="text-sm text-slate-600">Ainda não há despesas registadas neste tenant.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {expenses.map((e) => (
            <li key={e.id} className="px-4 py-3">
              {editingId === e.id ? (
                <TransparencyExpenseEditForm
                  row={e}
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {TRANSPARENCY_CATEGORY_PRESENTATION[e.category].title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatBrl(e.amount)} · {formatDatePt(e.spentAtMs)}
                    </p>
                    {e.description ? (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{e.description}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                      onClick={() => setEditingId(e.id)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                      onClick={() => setDeleteTarget(e)}
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDestructiveDialog
        open={deleteTarget != null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remover despesa?"
        description={
          deleteTarget
            ? `Será apagado o registo «${TRANSPARENCY_CATEGORY_PRESENTATION[deleteTarget.category].title}» (${formatBrl(deleteTarget.amount)}). Esta ação não pode ser anulada.`
            : ""
        }
        confirmLabel="Sim, apagar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!deleteTarget) return { ok: false, message: "Nada para apagar." };
          const r = await deleteTransparencyExpenseAction(deleteTarget.id);
          if (r.ok) {
            setEditingId(null);
            router.refresh();
            return { ok: true };
          }
          return { ok: false, message: r.message };
        }}
      />
    </div>
  );
}
