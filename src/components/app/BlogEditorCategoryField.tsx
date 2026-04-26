"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createBlogCategoryAction } from "@/app/app/(backoffice)/blog/actions";

type CategoryRow = { id: string; slug: string; label: string };

type Props = {
  categories: CategoryRow[];
  defaultCategoryId: string;
};

export function BlogEditorCategoryField({ categories, defaultCategoryId }: Props) {
  const router = useRouter();
  const [newLabel, setNewLabel] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(() => {
    if (categories.some((c) => c.id === defaultCategoryId)) {
      return defaultCategoryId;
    }
    return categories[0]?.id ?? "";
  });
  const [isPending, startTransition] = useTransition();

  function onCreateCategory() {
    setMsg(null);
    setErr(null);
    const label = newLabel.trim();
    if (label.length < 2) {
      setErr("Indique um nome com pelo menos 2 caracteres.");
      return;
    }
    startTransition(async () => {
      const r = await createBlogCategoryAction(label);
      if (r.ok) {
        setNewLabel("");
        setMsg(`Categoria «${r.label}» criada.`);
        setSelectedId(r.id);
        router.refresh();
      } else {
        setErr(r.message);
      }
    });
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Não há categorias para este site. Aplique as migrações Prisma na base de dados ou contacte o suporte.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
          Categoria
        </label>
        <input type="hidden" name="categoryId" value={selectedId} readOnly />
        <select
          id="categoryId"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setMsg(null);
            setErr(null);
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">Escolha a categoria do artigo na listagem pública do blog.</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3">
        <p className="text-sm font-medium text-slate-800 mb-2">Criar categoria nova</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1 min-w-0">
            <label htmlFor="newCategoryLabel" className="sr-only">
              Nome da nova categoria
            </label>
            <input
              id="newCategoryLabel"
              type="text"
              value={newLabel}
              onChange={(e) => {
                setNewLabel(e.target.value);
                setErr(null);
                setMsg(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onCreateCategory();
                }
              }}
              maxLength={80}
              placeholder="Ex.: Campanha de fim de ano"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>
          <button
            type="button"
            onClick={onCreateCategory}
            disabled={isPending}
            className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50 disabled:opacity-50"
          >
            {isPending ? "A criar…" : "Adicionar categoria"}
          </button>
        </div>
        {err && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {err}
          </p>
        )}
        {msg && (
          <p className="mt-2 text-sm text-emerald-700" role="status">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
