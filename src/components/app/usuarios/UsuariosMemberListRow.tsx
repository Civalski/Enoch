"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useActionState, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  removeMemberFormAction,
  setMemberPasswordFormAction,
  updateMemberPermissionsFormAction,
  updateMemberUserDataFormAction,
  type UsuariosMemberFormState,
} from "@/app/app/(backoffice)/usuarios/actions";
import type { TenantRole } from "@/generated/prisma/client";
import { accountIdentifierForDisplay } from "@/lib/auth/login-identity";
import type { UsuarioRow } from "./UsuariosManager";
import { UsuariosMemberListRowModals } from "./UsuariosMemberListRowModals";

const initialForm: UsuariosMemberFormState = { ok: true, message: "" };

function roleLabel(role: TenantRole): string {
  switch (role) {
    case "OWNER":
      return "Proprietário";
    case "ADMIN":
      return "Administrador";
    default:
      return "Membro";
  }
}

function PencilButton({
  onClick,
  "aria-expanded": ariaExpanded,
  "aria-label": ariaLabel,
}: {
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
      aria-label={ariaLabel}
      aria-haspopup="menu"
      aria-expanded={ariaExpanded}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
  );
}

type Props = { member: UsuarioRow; actorUserId: string };

export function UsuariosMemberListRow({ member, actorUserId }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [modal, setModal] = useState<null | "perms" | "dados" | "senha" | "excluir">(null);
  const triggerWrapRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLUListElement | null>(null);

  const [updState, updAction, updPending] = useActionState(updateMemberPermissionsFormAction, initialForm);
  const [dataState, dataAction, dataPending] = useActionState(updateMemberUserDataFormAction, initialForm);
  const [pwState, pwAction, pwPending] = useActionState(setMemberPasswordFormAction, initialForm);
  const [rmState, rmAction, rmPending] = useActionState(removeMemberFormAction, initialForm);

  const isOwner = member.role === "OWNER";
  const isAdmin = member.role === "ADMIN";
  const canEditPerms = !isOwner && !isAdmin;
  const canRemove = !isOwner;
  const selfBlock = member.userId === actorUserId;

  const updateMenuPosition = useCallback(() => {
    const el = triggerWrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Abre para cima: ancorado ao topo do botão, deslocado por translateY para não cortar no fim da lista.
    setMenuPosition({ top: r.top, right: document.documentElement.clientWidth - r.right });
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) {
      setMenuPosition(null);
      return;
    }
    updateMenuPosition();
    const onWin = () => updateMenuPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [menuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerWrapRef.current?.contains(t) || menuPanelRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  useEffect(() => {
    if (updState.ok && updState.message) {
      setModal(null);
      router.refresh();
    }
  }, [updState, router]);

  useEffect(() => {
    if (dataState.ok && dataState.message) {
      setModal(null);
      router.refresh();
    }
  }, [dataState, router]);

  useEffect(() => {
    if (pwState.ok && pwState.message) {
      setModal(null);
      router.refresh();
    }
  }, [pwState, router]);

  useEffect(() => {
    if (rmState.ok && rmState.message) {
      setModal(null);
      router.refresh();
    }
  }, [rmState, router]);

  const open = (m: typeof modal) => {
    setMenuOpen(false);
    setModal(m);
  };

  const label = accountIdentifierForDisplay(member.email);

  return (
    <li className="list-none border-b border-slate-100 last:border-b-0">
      <div className="flex min-h-[52px] items-center gap-3 px-3 py-2 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-900">{label}</p>
          {member.fullName ? <p className="truncate text-sm text-slate-600">{member.fullName}</p> : null}
          {member.phone || member.contactEmail ? (
            <p className="truncate text-xs text-slate-500">
              {[member.phone, member.contactEmail].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {roleLabel(member.role)}
        </span>
        <div className="relative shrink-0" ref={triggerWrapRef}>
          <PencilButton
            aria-label="Ações do utilizador"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </div>
      {menuOpen && menuPosition
        ? createPortal(
            <ul
              ref={menuPanelRef}
              className="pointer-events-auto fixed z-[10000] min-w-[12rem] rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg"
              style={{
                top: menuPosition.top,
                right: menuPosition.right,
                transform: "translateY(calc(-100% - 4px))",
              }}
              role="menu"
            >
              {canEditPerms ? (
                <li role="none" className="list-none">
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left text-slate-800 hover:bg-slate-50"
                    onClick={() => open("perms")}
                  >
                    Editar permissões
                  </button>
                </li>
              ) : null}
              <li role="none" className="list-none">
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-2 text-left text-slate-800 hover:bg-slate-50"
                  onClick={() => open("dados")}
                >
                  Editar dados
                </button>
              </li>
              <li role="none" className="list-none">
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-2 text-left text-slate-800 hover:bg-slate-50"
                  onClick={() => open("senha")}
                >
                  Alterar senha
                </button>
              </li>
              {canRemove ? (
                <li role="none" className="list-none">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={selfBlock}
                    className="block w-full px-3 py-2 text-left text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title={selfBlock ? "Não pode remover a sua própria conta aqui." : undefined}
                    onClick={() => {
                      if (!selfBlock) open("excluir");
                    }}
                  >
                    Excluir utilizador
                  </button>
                </li>
              ) : null}
            </ul>,
            document.body,
          )
        : null}

      <UsuariosMemberListRowModals
        member={member}
        modal={modal}
        onClose={() => setModal(null)}
        canEditPerms={canEditPerms}
        updState={updState}
        updAction={updAction}
        updPending={updPending}
        dataState={dataState}
        dataAction={dataAction}
        dataPending={dataPending}
        pwState={pwState}
        pwAction={pwAction}
        pwPending={pwPending}
        rmState={rmState}
        rmAction={rmAction}
        rmPending={rmPending}
      />
    </li>
  );
}
