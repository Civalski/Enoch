"use client";

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadBlogImageAction } from "@/app/app/(backoffice)/blog/upload-image";
import { createAboutTeamMemberAction } from "@/app/sobre/actions";
import {
  aboutTeamFormInitial,
  type AboutTeamFormState,
} from "@/app/sobre/about-team-form-state";

type Props = {
  onClose: () => void;
};

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 text-sm";

export function AboutTeamAddForm({ onClose }: Props) {
  const router = useRouter();
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  const [state, formAction, pending] = useActionState<AboutTeamFormState, FormData>(
    createAboutTeamMemberAction,
    aboutTeamFormInitial,
  );

  const handleSuccess = useCallback(() => {
    setFormKey((k) => k + 1);
    setUploadMsg(null);
    setUploadErr(null);
    onClose();
    router.refresh();
  }, [onClose, router]);

  useEffect(() => {
    if (state.ok) {
      handleSuccess();
    }
  }, [state.ok, handleSuccess]);

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
          setUploadMsg("URL da imagem preenchida.");
        }
      } catch (e) {
        setUploadErr(e instanceof Error ? e.message : "Falha no envio.");
      }
    });
  }

  return (
    <div
      className="mb-8 max-w-2xl mx-auto rounded-2xl border border-blue-200 bg-slate-50/90 p-5 text-left shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Novo membro</h3>
      <form key={formKey} action={formAction} className="space-y-3">
        {state.message && !state.ok ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {state.message}
          </p>
        ) : null}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor="about-new-name">
            Nome
          </label>
          <input
            id="about-new-name"
            name="name"
            required
            maxLength={200}
            className={inputClass}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor="about-new-role">
            Cargo
          </label>
          <input
            id="about-new-role"
            name="roleTitle"
            required
            maxLength={200}
            className={inputClass}
            placeholder="Função na instituição"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor="about-new-img">
            Imagem (URL)
          </label>
          <input
            ref={imageUrlRef}
            id="about-new-img"
            name="imageUrl"
            type="text"
            required
            maxLength={2000}
            className={inputClass}
            placeholder="https://…"
          />
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="text-xs text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-slate-200 file:px-2 file:py-1 file:font-medium"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) runImageUpload(f);
                e.target.value = "";
              }}
            />
            {isUploading ? <span className="text-xs text-slate-500">A enviar…</span> : null}
          </div>
          {(uploadMsg || uploadErr) && (
            <p
              className={`mt-1 text-xs ${uploadErr ? "text-red-600" : "text-emerald-700"}`}
              role="status"
            >
              {uploadErr ?? uploadMsg}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "A guardar…" : "Adicionar"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
