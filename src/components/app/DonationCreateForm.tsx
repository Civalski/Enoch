"use client";

import { useActionState, useEffect, useRef } from "react";
import { createDonationFormAction } from "@/app/app/(backoffice)/transparencia/actions";
import {
  initialDonationFormState,
  type DonationFormState,
} from "@/app/app/(backoffice)/transparencia/donation-form-state";

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

export function DonationCreateForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const [state, formAction, pending] = useActionState<DonationFormState, FormData>(
    createDonationFormAction,
    initialDonationFormState,
  );

  useEffect(() => {
    if (!state.ok || !formRef.current) return;
    formRef.current.reset();
    const dateInput = formRef.current.querySelector<HTMLInputElement>('input[name="donatedAt"]');
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
        <label htmlFor="donorName" className="block text-sm font-medium text-slate-700">
          Nome de quem doou
        </label>
        <input
          id="donorName"
          name="donorName"
          required
          maxLength={200}
          autoComplete="name"
          className={fieldClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
            Valor (R$)
          </label>
          <input
            id="amount"
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
          <label htmlFor="donatedAt" className="block text-sm font-medium text-slate-700">
            Data da doação
          </label>
          <input id="donatedAt" name="donatedAt" type="date" defaultValue={todayInputDate()} className={fieldClass} />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {pending ? "A guardar…" : "Registar doação"}
      </button>
    </form>
  );
}
