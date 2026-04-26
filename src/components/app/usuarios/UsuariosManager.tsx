"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { createMemberFormAction, type UsuariosMemberFormState } from "@/app/app/(backoffice)/usuarios/actions";
import { ALL_SITE_PERMISSIONS } from "@/lib/permissions/site-permission-logic";
import type { SitePermission, TenantRole } from "@/generated/prisma/client";
import { UsuariosMemberListRow } from "./UsuariosMemberListRow";
import { UserProfileOptionalFields } from "./UserProfileOptionalFields";

const PERM_LABEL: Record<SitePermission, string> = {
  BLOG: "Blog",
  TRANSPARENCY: "Transparência",
  CONTACT_INBOX: "Mensagens (contacto)",
  ABOUT: "Sobre / equipe",
  PROJECTS: "Projetos",
  INSTITUTIONAL: "Dados da entidade",
};

const initialForm: UsuariosMemberFormState = { ok: true, message: "" };

export type UsuarioRow = {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  cpf: string | null;
  rg: string | null;
  description: string | null;
  role: TenantRole;
  permissions: SitePermission[];
};

type Props = {
  members: readonly UsuarioRow[];
  actorUserId: string;
};

export function UsuariosManager({ members, actorUserId }: Props) {
  const router = useRouter();
  const [createState, createAction, createPending] = useActionState(createMemberFormAction, initialForm);
  const createRef = useRef<HTMLFormElement>(null);
  const [newRole, setNewRole] = useState<"MEMBER" | "ADMIN">("MEMBER");

  useEffect(() => {
    if (createState.ok && createState.message) {
      router.refresh();
    }
  }, [createState, router]);

  useEffect(() => {
    if (!createState.ok || !createRef.current) return;
    createRef.current.reset();
    setNewRole("MEMBER");
  }, [createState]);

  return (
    <div className="space-y-10 max-w-4xl">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Adicionar membro</h2>
        <p className="mt-1 text-sm text-slate-600">
          Só o login e a palavra-passe são obrigatórios. Pode ainda preencher dados de contacto (opcionais). Para quem
          já exista na autenticação, use o mesmo e-mail ou login. Identificador único por membro.
        </p>
        {createState.message ? (
          <p
            className={`mt-4 rounded-md px-3 py-2 text-sm ${
              createState.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
            }`}
            role={createState.ok ? "status" : "alert"}
          >
            {createState.message}
          </p>
        ) : null}
        <form ref={createRef} action={createAction} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="new-login" className="block text-sm font-medium text-slate-700">
                Login
              </label>
              <input
                id="new-login"
                name="login"
                type="text"
                required
                autoComplete="username"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                Senha inicial
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <p className="mt-0.5 text-xs text-slate-500">Mínimo 8 caracteres. O utilizador pode alterar depois.</p>
            </div>
          </div>
          <div>
            <label htmlFor="new-role" className="block text-sm font-medium text-slate-700">
              Papel
            </label>
            <select
              id="new-role"
              name="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value === "ADMIN" ? "ADMIN" : "MEMBER")}
              className="mt-1 w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:w-auto"
            >
              <option value="MEMBER">Membro (permissões por área)</option>
              <option value="ADMIN">Administrador (acesso completo ao painel)</option>
            </select>
          </div>
          {newRole === "MEMBER" ? (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">Áreas de edição no site</legend>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {ALL_SITE_PERMISSIONS.map((p) => (
                  <label key={p} className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name={`perm_${p}`} value="on" className="rounded border-slate-300" />
                    {PERM_LABEL[p]}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-medium text-slate-700">Dados adicionais (opcional)</p>
            <div className="mt-3">
              <UserProfileOptionalFields idPrefix="create" />
            </div>
          </div>
          <button
            type="submit"
            disabled={createPending}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {createPending ? "A criar…" : "Criar membro"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-base font-semibold text-slate-900">Equipe ({members.length})</h2>
        <ul className="mt-4 list-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {members.map((m) => (
            <UsuariosMemberListRow key={m.id} member={m} actorUserId={actorUserId} />
          ))}
        </ul>
      </section>
    </div>
  );
}
