"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteCapabilities } from "@/lib/permissions/site-permission-logic";
import { AppBackofficeNav } from "./AppBackofficeNav";
import { LogoutButton } from "./LogoutButton";

const USUARIOS = "/app/usuarios";
const BLOG_APP = "/app/blog";

function isUsuariosRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === USUARIOS || pathname.startsWith(`${USUARIOS}/`);
}

function isBlogAppRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === BLOG_APP || pathname.startsWith(`${BLOG_APP}/`);
}

type Props = {
  children: React.ReactNode;
  displayName: string;
  caps: SiteCapabilities;
  showUsersLink: boolean;
};

export function AppBackofficeShell({ children, displayName, caps, showUsersLink }: Props) {
  const pathname = usePathname();
  const hidePanel = isUsuariosRoute(pathname) || isBlogAppRoute(pathname);
  const panelOnly = !hidePanel;
  /** Em rotas sem cabeçalho do painel o `main` cresce além do conteúdo: min-height evita faixa (cor do body) e camadas atrapalhem o conteúdo. */
  const shellClass = hidePanel
    ? "min-h-[calc(100dvh-5.5rem)] bg-slate-100 border-b border-slate-200"
    : "min-h-[60vh] bg-slate-100 border-y border-slate-200";

  return (
    <div className={shellClass}>
      <div className="container mx-auto px-4 py-8">
        {panelOnly ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Área reservada</p>
                <h1 className="text-xl font-bold text-slate-900">Painel</h1>
                <p className="text-sm text-slate-600 mt-1">{displayName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LogoutButton />
                <Link
                  href="/"
                  className="text-sm text-slate-600 hover:text-blue-600 underline-offset-2 hover:underline"
                >
                  Voltar ao site
                </Link>
              </div>
            </div>
            <AppBackofficeNav caps={caps} showUsersLink={showUsersLink} />
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
}
