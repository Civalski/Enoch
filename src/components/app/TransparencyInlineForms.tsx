"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  updateDonationFormAction,
  updateTransparencyExpenseFormAction,
} from "@/app/app/(backoffice)/transparencia/actions";
import {
  initialDonationFormState,
  type DonationFormState,
} from "@/app/app/(backoffice)/transparencia/donation-form-state";
import {
  initialTransparencyExpenseFormState,
  type TransparencyExpenseFormState,
} from "@/app/app/(backoffice)/transparencia/expense-form-state";
import {
  TRANSPARENCY_CATEGORY_PRESENTATION,
  TRANSPARENCY_EXPENSE_CATEGORY_ORDER,
} from "@/lib/transparency-categories";
import type { TransparencyExpenseCategory } from "@prisma/client";
import type { DonationPublicRow } from "@/lib/donations-data";

export type TransparencyDonationRow = {
  id: string;
  donorName: string;
  amount: string;
  donatedAtMs: number;
};

export type TransparencyExpenseRow = {
  id: string;
  category: TransparencyExpenseCategory;
  amount: string;
  spentAtMs: number;
  description: string | null;
};

export function donationRowFromPublic(d: DonationPublicRow): TransparencyDonationRow {
  return {
    id: d.id,
    donorName: d.donorName,
    amount: String(d.amount),
    donatedAtMs: new Date(d.donatedAt).getTime(),
  };
}

function msToDateInput(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type DonationFormProps = {
  row: TransparencyDonationRow;
  onCancel: () => void;
  onSaved: () => void;
};

export function TransparencyDonationEditForm({ row, onCancel, onSaved }: DonationFormProps) {
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;
  const [state, formAction, pending] = useActionState<DonationFormState, FormData>(
    updateDonationFormAction,
    initialDonationFormState,
  );

  useEffect(() => {
    if (!state.ok) return;
    onSavedRef.current();
  }, [state]);

  const fieldClass =
    "mt-1 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={row.id} />
      {state.message && !state.ok ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}
      <div>
        <label className="block text-sm font-medium text-slate-700">Nome de quem doou</label>
        <input name="donorName" required maxLength={200} defaultValue={row.donorName} className={fieldClass} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            min={0.01}
            step={0.01}
            required
            defaultValue={row.amount}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Data</label>
          <input
            name="donatedAt"
            type="date"
            required
            defaultValue={msToDateInput(row.donatedAtMs)}
            className={fieldClass}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "A guardar…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

type ExpenseFormProps = {
  row: TransparencyExpenseRow;
  onCancel: () => void;
  onSaved: () => void;
};

export function TransparencyExpenseEditForm({ row, onCancel, onSaved }: ExpenseFormProps) {
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;
  const [state, formAction, pending] = useActionState<TransparencyExpenseFormState, FormData>(
    updateTransparencyExpenseFormAction,
    initialTransparencyExpenseFormState,
  );

  useEffect(() => {
    if (!state.ok) return;
    onSavedRef.current();
  }, [state]);

  const fieldClass =
    "mt-1 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={row.id} />
      {state.message && !state.ok ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}
      <div>
        <label className="block text-sm font-medium text-slate-700">Categoria</label>
        <select name="category" required className={fieldClass} defaultValue={row.category}>
          {TRANSPARENCY_EXPENSE_CATEGORY_ORDER.map((id) => (
            <option key={id} value={id}>
              {TRANSPARENCY_CATEGORY_PRESENTATION[id].title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            min={0.01}
            step={0.01}
            required
            defaultValue={row.amount}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Data</label>
          <input
            name="spentAt"
            type="date"
            required
            defaultValue={msToDateInput(row.spentAtMs)}
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Descrição (opcional)</label>
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={row.description ?? ""}
          className={`${fieldClass} resize-y`}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "A guardar…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
