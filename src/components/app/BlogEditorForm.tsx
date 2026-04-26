"use client";

import { useRef, useState, useTransition } from "react";
import { createBlogPostAction, updateBlogPostAction } from "@/app/app/(backoffice)/blog/actions";
import { uploadBlogImageAction } from "@/app/app/(backoffice)/blog/upload-image";
import { BlogEditorCategoryField } from "@/components/app/BlogEditorCategoryField";

type EditablePostFields = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  bodyMarkdown: string;
  publishedAt: string;
  categoryId: string;
};

type CategoryOption = { id: string; slug: string; label: string };

type Props = {
  mode: "create" | "edit";
  post?: EditablePostFields;
  /** Categorias do tenant (tabela `BlogPostCategory`). */
  categories: CategoryOption[];
  /** Só no modo criação: pré-preenche a partir de um artigo estático (ex.: ?exemplo=slug). */
  createPrefill?: Omit<EditablePostFields, "id">;
};

export function BlogEditorForm({ mode, post, createPrefill, categories }: Props) {
  const action = mode === "create" ? createBlogPostAction : updateBlogPostAction;
  const initial =
    mode === "edit" ? post : createPrefill;
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runUpload(file: File, target: "cover" | "body") {
    setUploadErr(null);
    setUploadMsg(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        const { url } = await uploadBlogImageAction(fd);
        if (target === "cover" && coverRef.current) {
          coverRef.current.value = url;
          setUploadMsg("Capa atualizada com a imagem enviada.");
        }
        if (target === "body" && bodyRef.current) {
          const base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
          const insert = `\n\n![${base}](${url})\n\n`;
          const el = bodyRef.current;
          const start = el.selectionStart ?? el.value.length;
          const end = el.selectionEnd ?? el.value.length;
          el.value = el.value.slice(0, start) + insert + el.value.slice(end);
          el.focus();
          const caret = start + insert.length;
          el.setSelectionRange(caret, caret);
          setUploadMsg("Imagem inserida no texto.");
        }
      } catch (e) {
        setUploadErr(e instanceof Error ? e.message : "Falha no envio.");
      }
    });
  }

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      {mode === "edit" && post && <input type="hidden" name="id" value={post.id} />}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initial?.title}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          placeholder="deixe vazio para gerar a partir do título"
          defaultValue={initial?.slug}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">
          Ex.: minha-noticia — aparece em /blog/minha-noticia
        </p>
      </div>
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">
          Resumo (chamada)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={initial?.excerpt}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 sm:items-start">
        <div className="sm:col-span-1">
          <BlogEditorCategoryField
            categories={categories}
            defaultCategoryId={
              initial?.categoryId ??
              categories.find((c) => c.slug === "geral")?.id ??
              categories[0]?.id ??
              ""
            }
          />
        </div>
        <div>
          <label htmlFor="publishedAt" className="block text-sm font-medium text-slate-700 mb-1">
            Data de publicação
          </label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            required
            defaultValue={
              initial?.publishedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="coverImageUrl" className="block text-sm font-medium text-slate-700 mb-1">
          URL da imagem de capa
        </label>
        <input
          ref={coverRef}
          id="coverImageUrl"
          name="coverImageUrl"
          type="text"
          placeholder="https://… ou /blog/covers/cover-1.svg"
          defaultValue={initial?.coverImageUrl}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) runUpload(f, "cover");
            }}
          />
          <span className="text-xs text-slate-500">ou escolha um ficheiro (máx. 5 MB)</span>
        </div>
      </div>
      <div>
        <label htmlFor="bodyMarkdown" className="block text-sm font-medium text-slate-700 mb-1">
          Texto do artigo (Markdown)
        </label>
        <textarea
          ref={bodyRef}
          id="bodyMarkdown"
          name="bodyMarkdown"
          rows={18}
          required
          defaultValue={initial?.bodyMarkdown}
          placeholder={`Parágrafos separados por linha em branco.\n\n**Negrito**, *itálico*, [link](https://exemplo.org)\n\n![descrição da imagem](https://…)`}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm leading-relaxed"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) runUpload(f, "body");
            }}
          />
          <span className="text-xs text-slate-500">
            Inserir imagem no texto — o cursor indica onde o Markdown será colado
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Também pode colar manualmente:{" "}
          <code className="bg-slate-100 px-1 rounded">![legenda](https://url)</code>
        </p>
      </div>
      {(uploadMsg || uploadErr) && (
        <p className={`text-sm ${uploadErr ? "text-red-600" : "text-emerald-700"}`} role="status">
          {uploadErr ?? uploadMsg}
          {isPending ? " …" : ""}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {mode === "create" ? "Publicar artigo" : "Guardar alterações"}
        </button>
      </div>
    </form>
  );
}
