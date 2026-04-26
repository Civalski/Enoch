"use client";

import { Fragment, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { DonationMonthBucket, DonationPublicRow } from "@/lib/donations-data";
import { TransparenciaRegisterDrawer } from "@/components/site/transparencia/TransparenciaRegisterDrawer";
import { PencilIcon } from "@/components/site/inline-edit/PencilIcon";
import { TrashIcon } from "@/components/site/inline-edit/TrashIcon";
import { deleteDonationAction } from "@/app/app/(backoffice)/transparencia/actions";
import {
  donationRowFromPublic,
  TransparencyDonationEditForm,
} from "@/components/app/TransparencyInlineForms";
import { ConfirmDestructiveDialog } from "@/components/ui/ConfirmDestructiveDialog";

function formatBrl(amount: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

type Props = {
  months: DonationMonthBucket[];
  canManage: boolean;
};

export function TransparenciaDoacoes({ months, canManage }: Props) {
  const router = useRouter();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; donorName: string } | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {canManage ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <TransparenciaRegisterDrawer />
        </div>
      ) : null}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Mês</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Total doado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold w-24">Detalhe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {months.map((m, i) => {
                const open = openKey === m.key;
                const stripe = i % 2 === 1 ? "bg-gray-50/50" : "";
                return (
                  <Fragment key={m.key}>
                    <tr className={`hover:bg-gray-50/80 transition-colors ${stripe}`}>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-left text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent hover:underline"
                          onClick={() => setOpenKey(open ? null : m.key)}
                          aria-expanded={open}
                        >
                          {m.label}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {formatBrl(m.total)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                          onClick={() => setOpenKey(open ? null : m.key)}
                          aria-expanded={open}
                        >
                          {open ? "Ocultar" : "Quem doou"}
                        </button>
                      </td>
                    </tr>
                    {open ? (
                      <tr className={stripe}>
                        <td colSpan={3} className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                          {m.donations.length === 0 ? (
                            <p className="text-sm text-slate-600">Nenhuma doação registada neste mês.</p>
                          ) : (
                            <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                              {m.donations.map((d) => (
                                <DonacaoDetalheLinha
                                  key={d.id}
                                  d={d}
                                  canManage={canManage}
                                  editing={editingDonationId === d.id}
                                  onStartEdit={() => setEditingDonationId(d.id)}
                                  onCancelEdit={() => setEditingDonationId(null)}
                                  onSaved={() => {
                                    setEditingDonationId(null);
                                    refresh();
                                  }}
                                  onRequestDelete={() => setDeleteTarget({ id: d.id, donorName: d.donorName })}
                                />
                              ))}
                            </ul>
                          )}
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
          <p className="text-sm text-center text-slate-600">
            Totais referentes aos últimos seis meses de calendário. Clique no mês para ver os doadores.
            {canManage ? " Com permissão de gestão, use o lápis para editar ou o ícone de lixo para apagar." : ""}
          </p>
        </div>
      </div>

      <ConfirmDestructiveDialog
        open={deleteTarget != null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remover doação?"
        description={
          deleteTarget
            ? `O registo de «${deleteTarget.donorName}» será apagado da transparência. Esta ação não pode ser anulada.`
            : ""
        }
        confirmLabel="Sim, apagar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!deleteTarget) return { ok: false, message: "Nada para apagar." };
          const r = await deleteDonationAction(deleteTarget.id);
          if (r.ok) {
            setEditingDonationId(null);
            refresh();
            return { ok: true };
          }
          return { ok: false, message: r.message };
        }}
      />
    </div>
  );
}

function DonacaoDetalheLinha({
  d,
  canManage,
  editing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onRequestDelete,
}: {
  d: DonationPublicRow;
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
        <TransparencyDonationEditForm
          row={donationRowFromPublic(d)}
          onCancel={onCancelEdit}
          onSaved={onSaved}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <div className="min-w-0 flex-1">
        <span className="font-medium text-slate-900">{d.donorName}</span>
        <span className="ml-2 tabular-nums font-semibold text-green-700">{formatBrl(d.amount)}</span>
      </div>
      {canManage ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700"
            aria-label={`Editar doação de ${d.donorName}`}
            onClick={onStartEdit}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-700"
            aria-label={`Apagar doação de ${d.donorName}`}
            onClick={onRequestDelete}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </li>
  );
}
