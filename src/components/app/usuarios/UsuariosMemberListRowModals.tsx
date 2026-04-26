"use client";

import { useEffect, type ReactNode } from "react";
import type { UsuariosMemberFormState } from "@/app/app/(backoffice)/usuarios/actions";
import { accountIdentifierForDisplay } from "@/lib/auth/login-identity";
import { ALL_SITE_PERMISSIONS } from "@/lib/permissions/site-permission-logic";
import type { SitePermission } from "@/generated/prisma/client";
import type { UsuarioRow } from "./UsuariosManager";
import { UserProfileOptionalFields } from "./UserProfileOptionalFields";

const PERM_LABEL: Record<SitePermission, string> = {
  BLOG: "Blog",
  TRANSPARENCY: "Transparência",
  CONTACT_INBOX: "Mensagens (contacto)",
  ABOUT: "Sobre / equipe",
  PROJECTS: "Projetos",
  INSTITUTIONAL: "Dados da entidade",
};

type SimpleModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** `lg` para formulários mais largos (dados de perfil). */
  size?: "md" | "lg";
};

function SimpleModal({ open, title, onClose, children, size = "md" }: SimpleModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10050] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div
        className={`relative z-10 w-full rounded-lg border border-slate-200 bg-white p-5 shadow-xl ${
          size === "lg" ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-md"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title" className="text-base font-semibold text-slate-900">
          {title}
        </h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

type ModalType = "perms" | "dados" | "senha" | "excluir" | null;

type Props = {
  member: UsuarioRow;
  modal: ModalType;
  onClose: () => void;
  canEditPerms: boolean;
  updState: UsuariosMemberFormState;
  updAction: (formData: FormData) => void;
  updPending: boolean;
  dataState: UsuariosMemberFormState;
  dataAction: (formData: FormData) => void;
  dataPending: boolean;
  pwState: UsuariosMemberFormState;
  pwAction: (formData: FormData) => void;
  pwPending: boolean;
  rmState: UsuariosMemberFormState;
  rmAction: (formData: FormData) => void;
  rmPending: boolean;
};

export function UsuariosMemberListRowModals({
  member,
  modal,
  onClose,
  canEditPerms,
  updState,
  updAction,
  updPending,
  dataState,
  dataAction,
  dataPending,
  pwState,
  pwAction,
  pwPending,
  rmState,
  rmAction,
  rmPending,
}: Props) {
  const displayLabel = accountIdentifierForDisplay(member.email);

  return (
    <>
      <SimpleModal open={modal === "perms"} onClose={onClose} title="Editar permissões">
        {updState.message && !updState.ok ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {updState.message}
          </p>
        ) : null}
        {canEditPerms ? (
          <form action={updAction} className="space-y-3">
            <input type="hidden" name="memberId" value={member.id} />
            <fieldset className="space-y-2" disabled={updPending}>
              <legend className="sr-only">Áreas de edição</legend>
              <div className="flex flex-col gap-2 sm:flex-wrap sm:gap-x-4">
                {ALL_SITE_PERMISSIONS.map((p) => (
                  <label key={p} className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name={`perm_${p}`}
                      value="on"
                      defaultChecked={member.permissions.includes(p)}
                      className="rounded border-slate-300"
                    />
                    {PERM_LABEL[p]}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updPending}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {updPending ? "A guardar…" : "Guardar"}
              </button>
            </div>
          </form>
        ) : null}
      </SimpleModal>

      <SimpleModal open={modal === "dados"} onClose={onClose} title="Editar dados" size="lg">
        {dataState.message && !dataState.ok ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {dataState.message}
          </p>
        ) : null}
        <form action={dataAction} className="space-y-3">
          <input type="hidden" name="memberId" value={member.id} />
          <div>
            <p className="text-xs text-slate-500">Identificador de início de sessão (só leitura)</p>
            <p className="text-sm text-slate-800">{displayLabel}</p>
          </div>
          <UserProfileOptionalFields
            idPrefix={`m-${member.id}`}
            defaults={{
              fullName: member.fullName,
              contactEmail: member.contactEmail,
              phone: member.phone,
              address: member.address,
              cpf: member.cpf,
              rg: member.rg,
              description: member.description,
            }}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={dataPending}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {dataPending ? "A guardar…" : "Guardar"}
            </button>
          </div>
        </form>
      </SimpleModal>

      <SimpleModal open={modal === "senha"} onClose={onClose} title="Alterar senha">
        {pwState.message && !pwState.ok ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {pwState.message}
          </p>
        ) : null}
        <p className="mb-3 text-sm text-slate-600">Nova palavra-passe para {displayLabel}</p>
        <form action={pwAction} className="space-y-3">
          <input type="hidden" name="memberId" value={member.id} />
          <div>
            <label htmlFor={`np-${member.id}`} className="block text-sm font-medium text-slate-700">
              Nova senha
            </label>
            <input
              id={`np-${member.id}`}
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label htmlFor={`npc-${member.id}`} className="block text-sm font-medium text-slate-700">
              Confirmar senha
            </label>
            <input
              id={`npc-${member.id}`}
              name="passwordConfirm"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pwPending}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {pwPending ? "A guardar…" : "Definir senha"}
            </button>
          </div>
        </form>
      </SimpleModal>

      <SimpleModal open={modal === "excluir"} onClose={onClose} title="Excluir utilizador">
        {rmState.message && !rmState.ok ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {rmState.message}
          </p>
        ) : null}
        <p className="text-sm text-slate-600">
          Remover <strong className="font-medium text-slate-800">{displayLabel}</strong> da equipe? Esta ação
          revoga o acesso ao painel; a conta de autenticação pode continuar a existir.
        </p>
        <form action={rmAction} className="mt-4 flex justify-end gap-2">
          <input type="hidden" name="memberId" value={member.id} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={rmPending}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {rmPending ? "A remover…" : "Excluir"}
          </button>
        </form>
      </SimpleModal>
    </>
  );
}
