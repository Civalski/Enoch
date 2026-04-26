"use client";

import { useActionState } from "react";
import { saveInstitutionalContentAction } from "@/app/app/institucional/actions";
import {
  initialInstitutionalFormState,
  type InstitutionalFormState,
} from "@/app/app/institucional/form-state";
import type { PublicSiteView } from "@/lib/institutional-site/types";

type Props = {
  site: PublicSiteView;
};

export function InstitutionalEditorForm({ site }: Props) {
  const sc = site.scalars;
  const [state, formAction, pending] = useActionState<
    InstitutionalFormState,
    FormData
  >(saveInstitutionalContentAction, initialInstitutionalFormState);

  return (
    <form action={formAction} className="space-y-10 max-w-4xl">
      {state.message ? (
        <p
          className={`text-sm rounded-md px-3 py-2 border ${
            state.ok ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-800"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <section className="space-y-4 bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-slate-900">Rodapé</h2>
        <p className="text-sm text-slate-600">
          Nome, logótipo e títulos das páginas públicas editam-se no próprio site (lápis junto ao texto no
          cabeçalho, em Estudos, no destaque da página de contacto, etc.).
        </p>
        <label className="block text-sm">
          <span className="text-slate-700">Texto no rodapé</span>
          <textarea
            name="footerTagline"
            defaultValue={sc.footerTagline}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700">Linha de copyright (opcional)</span>
          <input
            name="copyrightLine"
            defaultValue={sc.copyrightLine ?? ""}
            placeholder="Vazio = © ano + nome da entidade"
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
            maxLength={500}
          />
        </label>
      </section>

      <section className="space-y-4 bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-slate-900">Contacto e redes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-slate-700">E-mail</span>
            <input
              name="contactEmail"
              type="email"
              defaultValue={sc.contactEmail}
              className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
              maxLength={320}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Telefone</span>
            <input
              name="contactPhone"
              defaultValue={sc.contactPhone}
              className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
              maxLength={120}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-slate-700">Endereço</span>
          <textarea
            name="address"
            defaultValue={sc.address}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="text-slate-700">Facebook</span>
            <input
              name="facebookUrl"
              defaultValue={sc.facebookUrl}
              placeholder="https://"
              className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
              maxLength={2000}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Instagram</span>
            <input
              name="instagramUrl"
              defaultValue={sc.instagramUrl}
              placeholder="https://"
              className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
              maxLength={2000}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">WhatsApp (link)</span>
            <input
              name="whatsappUrl"
              defaultValue={sc.whatsappUrl}
              placeholder="https://wa.me/..."
              className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
              maxLength={2000}
            />
          </label>
        </div>
      </section>

      <section className="space-y-2 bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-slate-900">Mapa (início)</h2>
        <label className="block text-sm">
          <span className="text-slate-700">URL do iframe Google Maps (embed)</span>
          <input
            name="mapEmbedUrl"
            defaultValue={sc.mapEmbedUrl}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono text-xs"
            maxLength={4000}
          />
        </label>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "A guardar…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
