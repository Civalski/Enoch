"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { uploadBlogImageAction } from "@/app/app/(backoffice)/blog/upload-image";
import { createProjectFormAction, updateProjectFormAction } from "@/app/app/(backoffice)/projetos/actions";
import {
  initialProjectFormState,
  type ProjectFormState,
} from "@/app/app/(backoffice)/projetos/project-form-state";

type CreatePrefill = {
  title: string;
  description: string;
  imageUrl: string;
};

type EditValues = {
  id: string;
  displayOrder: string;
} & CreatePrefill;

type Props =
  | { mode: "create"; createPrefill?: CreatePrefill }
  | { mode: "edit"; values: EditValues };

export function ProjectForm(props: Props) {
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const prefill = props.mode === "create" ? props.createPrefill : undefined;
  const edit = props.mode === "edit" ? props.values : undefined;
  const action = props.mode === "create" ? createProjectFormAction : updateProjectFormAction;

  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    action,
    initialProjectFormState,
  );

  useEffect(() => {
    if (state.ok) {
      // Navegação com recarga completa: evita o router do cliente a servir a lista antiga
      // (cartões ainda “estáticos”, sem dbId) logo após o primeiro create.
      window.location.assign("/projetos");
    }
  }, [state.ok]);

  const titleDefault = prefill?.title ?? edit?.title ?? "";
  const descriptionDefault = prefill?.description ?? edit?.description ?? "";
  const imageUrlDefault = prefill?.imageUrl ?? edit?.imageUrl ?? "";
  const orderDefault = edit?.displayOrder ?? "0";

  function runImageUpload(file: File) {
    setUploadErr(null);
    setUploadMsg(null);
    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        const { url } = await uploadBlogImageAction(fd);
        if (imageUrlRef.current) {
          imageUrlRef.current.value = url;
          setUploadMsg("URL da imagem preenchida com o ficheiro enviado.");
        }
      } catch (e) {
        setUploadErr(e instanceof Error ? e.message : "Falha no envio.");
      }
    });
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
      {edit && <input type="hidden" name="id" value={edit.id} />}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={titleDefault}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={descriptionDefault}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="imageUrl">
          Imagem do projeto
        </label>
        <input
          ref={imageUrlRef}
          id="imageUrl"
          name="imageUrl"
          type="text"
          required
          maxLength={2000}
          defaultValue={imageUrlDefault}
          placeholder="Cole um URL (https://…) ou envie um ficheiro abaixo"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="text-sm text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800"
            disabled={isUploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) runImageUpload(f);
              e.target.value = "";
            }}
          />
          {isUploading ? <span className="text-sm text-slate-500">A enviar…</span> : null}
        </div>
        {(uploadMsg || uploadErr) && (
          <p
            className={`mt-2 text-sm ${uploadErr ? "text-red-600" : "text-emerald-700"}`}
            role="status"
          >
            {uploadErr ?? uploadMsg}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          O ficheiro é enviado para o armazenamento (mesmo processo do blog) e o URL público fica
          no campo.
        </p>
      </div>
      {props.mode === "edit" ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="displayOrder">
            Ordem de exibição
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue={orderDefault}
            className="w-40 rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">
            Números menores aparecem primeiro; projetos extra só-DB usam isto.
          </p>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "A guardar…" : props.mode === "create" ? "Criar projeto" : "Guardar alterações"}
      </button>
    </form>
  );
}
