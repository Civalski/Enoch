"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DonationCreateForm } from "@/components/app/DonationCreateForm";
import { TransparencyExpenseCreateForm } from "@/components/app/TransparencyExpenseCreateForm";

type Tab = "donation" | "expense";

export function TransparenciaRegisterDrawer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("donation");
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const refreshTransparency = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, select, button, textarea")?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, tab]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
      >
        Registar doação ou despesa
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            aria-label="Fechar painel"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                  Registar na transparência
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Os dados passam a constar nesta página após guardar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Fechar"
              >
                <span aria-hidden className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="shrink-0 border-b border-slate-100 px-5 py-3 sm:px-6">
              <div
                className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium"
                role="tablist"
                aria-label="Tipo de registo"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "donation"}
                  className={`flex-1 rounded-md px-3 py-2 transition-colors ${
                    tab === "donation"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  onClick={() => setTab("donation")}
                >
                  Doação
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "expense"}
                  className={`flex-1 rounded-md px-3 py-2 transition-colors ${
                    tab === "expense"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  onClick={() => setTab("expense")}
                >
                  Despesa
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {tab === "donation" ? (
                <div className="space-y-1 pb-2">
                  <p className="text-sm font-medium text-slate-800">Receita (doação)</p>
                  <p className="text-sm text-slate-600">
                    Nome de quem doou, valor em reais e data. Opcionalmente pode fechar o painel após
                    guardar — a tabela atualiza automaticamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 pb-2">
                  <p className="text-sm font-medium text-slate-800">Despesa (destinação)</p>
                  <p className="text-sm text-slate-600">
                    Categoria, valor, data e descrição. Os totais e extratos refletem o registo de seguida.
                  </p>
                </div>
              )}
              <div className="mt-4">
                {tab === "donation" ? (
                  <DonationCreateForm onSuccess={refreshTransparency} />
                ) : (
                  <TransparencyExpenseCreateForm onSuccess={refreshTransparency} />
                )}
              </div>
              <p className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
                Para{" "}
                <Link href="/app/transparencia/doacoes" className="font-medium text-blue-600 underline-offset-2 hover:underline">
                  alterar ou apagar
                </Link>{" "}
                registos já guardados, use o painel de transparência.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
