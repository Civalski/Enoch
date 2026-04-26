"use client";

import { useActionState, useEffect } from "react";
import { createStudyFormAction, updateStudyFormAction } from "@/app/app/(backoffice)/estudos/actions";
import { initialStudyFormState, type StudyFormState } from "@/app/app/(backoffice)/estudos/study-form-state";
import {
  STUDY_FORM_KIND_OPTIONS,
  type StudyResourceKind,
} from "@/lib/study-kinds-constants";

type EditValues = {
  id: string;
  kind: StudyResourceKind;
  title: string;
  description: string;
  linkUrl: string;
};

type Props = { mode: "create" } | { mode: "edit"; values: EditValues };

export function StudyResourceForm(props: Props) {
  const action = props.mode === "create" ? createStudyFormAction : updateStudyFormAction;
  const [state, formAction, pending] = useActionState<StudyFormState, FormData>(
    action,
    initialStudyFormState,
  );

  useEffect(() => {
    if (state.ok) {
      window.location.assign("/estudos");
    }
  }, [state.ok]);

  const edit = props.mode === "edit" ? props.values : undefined;
  const defaultKind: StudyResourceKind = edit?.kind ?? "artigo";
  return (
    <form action={formAction} className="max-w-2xl space-y-4">
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
      {edit && <input type="hidden" name="id" value={edit.id} />}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="kind">
          Categoria
        </label>
        <select
          id="kind"
          name="kind"
          required
          defaultValue={defaultKind}
          className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        >
          {STUDY_FORM_KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={500}
          defaultValue={edit?.title ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
          Descrição (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={edit?.description ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="linkUrl">
          Ligação (opcional)
        </label>
        <input
          id="linkUrl"
          name="linkUrl"
          type="text"
          maxLength={2000}
          defaultValue={edit?.linkUrl ?? ""}
          placeholder="https://… (ex. Google Drive)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />
        <p className="text-xs text-slate-500 mt-1">Deixe em branco se não houver ficheiro ou página online.</p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {pending
          ? "A guardar…"
          : props.mode === "create"
            ? "Criar material"
            : "Guardar alterações"}
      </button>
    </form>
  );
}
