"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";

export type ConfirmDestructiveResult = { ok: true } | { ok: false; message: string };

export type ConfirmDestructiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Chamado ao confirmar; o diálogo só fecha se devolver `{ ok: true }`. */
  onConfirm: () => Promise<ConfirmDestructiveResult>;
};

export function ConfirmDestructiveDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Apagar",
  cancelLabel = "Cancelar",
  onConfirm,
}: ConfirmDestructiveDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-[1px]" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
          <AlertDialog.Title className="text-lg font-semibold text-slate-900">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </AlertDialog.Description>
          {error ? (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                disabled={busy}
                className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                disabled={busy}
                className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                onClick={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setBusy(true);
                  try {
                    const r = await onConfirm();
                    if (r.ok) {
                      onOpenChange(false);
                    } else {
                      setError(r.message);
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Ocorreu um erro.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "A processar…" : confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
