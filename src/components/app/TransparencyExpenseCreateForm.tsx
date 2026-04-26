"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTransparencyExpenseFormAction } from "@/app/app/(backoffice)/transparencia/actions";
import {
  initialTransparencyExpenseFormState,
  type TransparencyExpenseFormState,
} from "@/app/app/(backoffice)/transparencia/expense-form-state";
import {
  TRANSPARENCY_CATEGORY_PRESENTATION,
  TRANSPARENCY_EXPENSE_CATEGORY_ORDER,
} from "@/lib/transparency-categories";

function todayInputDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Props = {
  onSuccess?: () => void;
};

export function TransparencyExpenseCreateForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const [state, formAction, pending] = useActionState<TransparencyExpenseFormState, FormData>(
    createTransparencyExpenseFormAction,
    initialTransparencyExpenseFormState,
  );

  useEffect(() => {
    if (!state.ok || !formRef.current) return;
    formRef.current.reset();
    const dateInput = formRef.current.querySelector<HTMLInputElement>('input[name="spentAt"]');
    if (dateInput) dateInput.value = todayInputDate();
    onSuccessRef.current?.();
  }, [state]);

  const fieldClass =
    "mt-1.5 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <form ref={formRef} action={formAction} className="flex w-full min-w-0 flex-col space-y-4">
      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="expenseCategory" className="block text-sm font-medium text-slate-700">
          Categoria (destinação)
        </label>
        <select
          id="expenseCategory"
          name="category"
          required
          className={fieldClass}
          defaultValue=""
        >
          <option value="" disabled>
            Escolher…
          </option>
          {TRANSPARENCY_EXPENSE_CATEGORY_ORDER.map((id) => (
            <option key={id} value={id}>
              {TRANSPARENCY_CATEGORY_PRESENTATION[id].title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="expenseAmount" className="block text-sm font-medium text-slate-700">
            Valor gasto (R$)
          </label>
          <input
            id="expenseAmount"
            name="amount"
            type="number"
            inputMode="decimal"
            min={0.01}
            step={0.01}
            required
            className={fieldClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="spentAt" className="block text-sm font-medium text-slate-700">
            Data da despesa
          </label>
          <input
            id="spentAt"
            name="spentAt"
            type="date"
            defaultValue={todayInputDate()}
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="expenseDescription" className="block text-sm font-medium text-slate-700">
          Descrição (opcional)
        </label>
        <textarea
          id="expenseDescription"
          name="description"
          rows={3}
          maxLength={500}
          placeholder="Ex.: compra de material escolar para o projeto X"
          className={`${fieldClass} resize-y`}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {pending ? "A guardar…" : "Registar despesa"}
      </button>
    </form>
  );
}
