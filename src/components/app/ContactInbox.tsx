"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { markContactMessageReadAction } from "@/app/app/(backoffice)/contato/actions";
import type { InboxMessageRow } from "@/lib/contact/inbox-messages";
import {
  CategoryFilter,
  contactInitials,
  formatInboxDate,
  PAGE_SIZE,
  SUBJECT_LABEL,
  SUBJECT_ORDER,
} from "@/components/app/contact-inbox-helpers";
import { ContactInboxMessageList } from "@/components/app/ContactInboxMessageList";

export type { InboxMessageRow };

type Props = {
  initialMessages: InboxMessageRow[];
};

export function ContactInbox({ initialMessages }: Props) {
  const [rows, setRows] = useState(initialMessages);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialMessages[0]?.id ?? null);
  const [pending, startTransition] = useTransition();
  const detailRef = useRef<HTMLDivElement>(null);

  const filteredRows = useMemo(() => {
    if (categoryFilter === "all") return rows;
    return rows.filter((m) => m.subject === categoryFilter);
  }, [rows, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev && paginatedRows.some((m) => m.id === prev)) return prev;
      return paginatedRows[0]?.id ?? null;
    });
  }, [paginatedRows]);

  const selected = useMemo(
    () => rows.find((m) => m.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const unreadInFilter = useMemo(
    () => filteredRows.filter((m) => !m.readAt).length,
    [filteredRows],
  );

  const onMarkRead = () => {
    if (!selected || selected.readAt) return;
    startTransition(async () => {
      await markContactMessageReadAction(selected.id);
      setRows((prev) =>
        prev.map((m) =>
          m.id === selected.id ? { ...m, readAt: new Date().toISOString() } : m,
        ),
      );
    });
  };

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-600 rounded-lg border border-slate-200 bg-white px-4 py-8 text-center">
        Ainda não há mensagens recebidas pelo formulário público.
      </p>
    );
  }

  const selectMessage = (id: string) => {
    setSelectedId(id);
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por assunto"
      >
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
            categoryFilter === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Todas ({rows.length})
        </button>
        {SUBJECT_ORDER.map((key) => {
          const count = rows.filter((m) => m.subject === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryFilter(key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                categoryFilter === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {SUBJECT_LABEL[key]} ({count})
            </button>
          );
        })}
      </div>

      {filteredRows.length === 0 ? (
        <p className="text-sm text-slate-600 rounded-lg border border-slate-200 bg-white px-4 py-8 text-center">
          Nenhuma mensagem nesta categoria.
        </p>
      ) : (
        <div className="rounded-xl border border-slate-200/90 bg-slate-100/80 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
                aria-hidden
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-900 truncate">Caixa de entrada</h2>
                <p className="text-sm text-slate-500">
                  {filteredRows.length} mensagem(ns)
                  {unreadInFilter > 0 ? ` · ${unreadInFilter} não lida(s)` : ""}
                </p>
              </div>
            </div>
            {totalPages > 1 ? (
              <nav
                className="flex items-center gap-1 text-sm text-slate-600"
                aria-label="Paginação da lista"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Anterior
                </button>
                <span className="tabular-nums px-2">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Seguinte
                </button>
              </nav>
            ) : null}
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(22rem,1fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(24rem,1fr)_minmax(0,1.55fr)] 2xl:grid-cols-[minmax(26rem,1fr)_minmax(0,1.7fr)] lg:items-stretch lg:min-h-[min(78vh,760px)] bg-slate-50/90">
            <ContactInboxMessageList
              paginatedRows={paginatedRows}
              selectedId={selectedId}
              onSelectMessage={selectMessage}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              filteredTotal={filteredRows.length}
            />

            {selected && paginatedRows.some((m) => m.id === selected.id) ? (
              <div
                ref={detailRef}
                className="bg-white p-5 sm:p-7 lg:p-8 min-h-[min(50vh,320px)] lg:h-full lg:min-h-0 lg:overflow-y-auto scroll-mt-4 flex flex-col"
              >
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug pr-2">
                      {SUBJECT_LABEL[selected.subject] ?? selected.subject}
                    </h3>
                    {!selected.readAt ? (
                      <button
                        type="button"
                        onClick={onMarkRead}
                        disabled={pending}
                        className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md px-4 py-2 disabled:opacity-50 shrink-0"
                      >
                        {pending ? "A guardar…" : "Marcar como lida"}
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 shrink-0">
                        Lida
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-3 tabular-nums">
                    {formatInboxDate(selected.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-6 flex-1 min-h-0 flex flex-col">
                  <div className="flex gap-4 sm:gap-5 min-h-0 flex-1">
                    <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-base font-semibold text-slate-700">
                      {contactInitials(selected.name)}
                    </span>
                    <div className="min-w-0 flex-1 text-base space-y-4 flex flex-col min-h-0">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                          De
                        </p>
                        <p className="font-semibold text-slate-900 text-lg mt-0.5">{selected.name}</p>
                        <p className="text-slate-600 text-base mt-1">
                          <a
                            href={`mailto:${encodeURIComponent(selected.email)}`}
                            className="text-sky-700 hover:underline break-all"
                          >
                            {selected.email}
                          </a>
                        </p>
                        {selected.phone ? (
                          <p className="text-slate-600 mt-1.5 text-base">{selected.phone}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col flex-1 min-h-0">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                          Mensagem
                        </p>
                        <div className="rounded-lg bg-white border border-slate-200 px-4 py-4 sm:px-6 sm:py-5 text-slate-800 whitespace-pre-wrap text-base sm:text-[1.05rem] leading-[1.65] flex-1 min-h-[12rem] overflow-y-auto">
                          {selected.body}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
