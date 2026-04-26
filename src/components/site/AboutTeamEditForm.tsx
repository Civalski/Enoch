"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadBlogImageAction } from "@/app/app/(backoffice)/blog/upload-image";
import { updateAboutTeamMemberAction } from "@/app/sobre/actions";
import {
  aboutTeamFormInitial,
  type AboutTeamFormState,
} from "@/app/sobre/about-team-form-state";
import type { PublicAboutTeamMember } from "@/lib/about-team-data";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 text-sm";

type Props = {
  member: PublicAboutTeamMember;
  onCancel: () => void;
};

export function AboutTeamEditForm({ member, onCancel }: Props) {
  const router = useRouter();
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  const [state, formAction, pending] = useActionState<AboutTeamFormState, FormData>(
    updateAboutTeamMemberAction,
    aboutTeamFormInitial,
  );

  useEffect(() => {
    if (state.ok) {
      onCancel();
      router.refresh();
    }
  }, [state.ok, onCancel, router]);

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
      className="rounded-2xl border border-blue-200 bg-slate-50/90 p-4 text-left shadow-md md:col-span-2"
      onClick={(e) => e.stopPropagation()}
    >
      <form action={formAction} className="space-y-3">
        {state.message ? (
          <p
            className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        ) : null}
        <input type="hidden" name="id" value={member.id} />
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor={`name-${member.id}`}>
            Nome
          </label>
          <input
            id={`name-${member.id}`}
            name="name"
            required
            maxLength={200}
            defaultValue={member.name}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor={`role-${member.id}`}>
            Cargo
          </label>
          <input
            id={`role-${member.id}`}
            name="roleTitle"
            required
            maxLength={200}
            defaultValue={member.roleTitle}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-0.5" htmlFor={`img-${member.id}`}>
            Imagem (URL)
          </label>
          <input
            ref={imageUrlRef}
            id={`img-${member.id}`}
            name="imageUrl"
            type="text"
            required
            maxLength={2000}
            defaultValue={member.imageUrl}
            placeholder="https://…"
            className={inputClass}
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
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "A guardar…" : "Guardar"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
