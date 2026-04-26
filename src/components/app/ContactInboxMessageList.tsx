"use client";

import type { InboxMessageRow } from "@/lib/contact/inbox-messages";
import {
  contactInitials,
  formatInboxDate,
  PAGE_SIZE,
  SUBJECT_LABEL,
} from "@/components/app/contact-inbox-helpers";

type Props = {
  paginatedRows: InboxMessageRow[];
  selectedId: string | null;
  onSelectMessage: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filteredTotal: number;
};

export function ContactInboxMessageList({
  paginatedRows,
  selectedId,
  onSelectMessage,
  page,
  totalPages,
  onPageChange,
  filteredTotal,
}: Props) {
  const pageStart = filteredTotal === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, filteredTotal);

  return (
    <div className="flex flex-col min-w-0 min-h-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white lg:h-full">
      <div
        className="hidden sm:grid grid-cols-[3.25rem_minmax(0,1fr)_7.5rem] gap-3 px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500"
        aria-hidden
      >
        <span />
        <span>Remetente e assunto</span>
        <span className="text-right">Data</span>
      </div>
      <ul className="overflow-y-auto divide-y divide-slate-100 max-h-[min(68vh,600px)] lg:max-h-none lg:flex-1 lg:min-h-0">
        {paginatedRows.map((m) => {
          const isSel = m.id === selectedId;
          const unread = !m.readAt;
          const preview = m.body.replace(/\s+/g, " ").trim();
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelectMessage(m.id)}
                className={`w-full text-left px-3 sm:px-5 py-4 sm:py-[1.125rem] transition-colors grid grid-cols-1 sm:grid-cols-[3.25rem_minmax(0,1fr)_7.5rem] gap-x-3 gap-y-2 sm:gap-y-0 sm:items-start ${
                  isSel
                    ? "bg-sky-50 ring-inset ring-1 ring-sky-200/90"
                    : unread
                      ? "bg-white hover:bg-slate-50/90"
                      : "bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="hidden sm:flex justify-center pt-1">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      unread
                        ? "bg-sky-100 text-sky-800 ring-2 ring-sky-200/80"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {contactInitials(m.name)}
                  </span>
                </div>
                <div className="min-w-0 sm:col-span-1 col-span-full">
                  <div className="flex items-baseline justify-between gap-2 sm:hidden">
                    <span
                      className={`text-base truncate ${
                        unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                      }`}
                    >
                      {unread ? "● " : ""}
                      {m.name}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0 tabular-nums">
                      {formatInboxDate(m.createdAt)}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-baseline gap-2 min-w-0">
                    <span
                      className={`text-base truncate min-w-0 ${
                        unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                      }`}
                    >
                      {unread ? "● " : ""}
                      {m.name}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      unread ? "text-slate-800" : "text-slate-700"
                    }`}
                  >
                    {SUBJECT_LABEL[m.subject] ?? m.subject}
                  </p>
                  <p
                    className={`text-sm mt-1 line-clamp-2 leading-snug ${
                      unread ? "text-slate-600" : "text-slate-500"
                    }`}
                  >
                    {preview || "—"}
                  </p>
                </div>
                <span className="hidden sm:block text-xs text-slate-500 text-right tabular-nums pt-1.5 self-start">
                  {formatInboxDate(m.createdAt)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {totalPages > 1 ? (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600 shrink-0">
          <span>
            Mostrando {pageStart}–{pageEnd} de {filteredTotal}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="rounded border border-slate-200 bg-white px-2 py-1 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              ←
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className="rounded border border-slate-200 bg-white px-2 py-1 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
