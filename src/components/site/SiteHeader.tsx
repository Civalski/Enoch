"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { loadInstitutionalActions } from "@/lib/institutional-site/institutional-actions-client";
import { AuthHeaderLinks } from "@/components/app/AuthHeaderLinks";
import { HeaderBrandBlock } from "@/components/site/HeaderBrandBlock";
import { HeaderNavItemLabel } from "@/components/site/inline-edit/HeaderNavItemLabel";
import { VisitorPreviewButton } from "@/components/site/VisitorPreviewButton";
import type { HeaderNavItem } from "@/lib/institutional-site/types";

function HeaderGearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function pathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathActive(pathname, href);
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-all duration-300 relative group ${
        active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
      }`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-all duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

type SiteHeaderProps = {
  canManageInstitutional?: boolean;
  /** Só o administrador principal (login de painel): gestão de contas em /app/usuarios */
  canManageSiteUsers?: boolean;
  /** Só o administrador principal: ícone "ver como visitante" (sem alterar canManage* aqui). */
  showVisitorPreview?: boolean;
  visitorPreviewActive?: boolean;
  isLoggedIn?: boolean;
  logoUrl: string;
  orgName: string;
  headerTagline: string;
  navItems: readonly HeaderNavItem[];
};

export function SiteHeader({
  canManageInstitutional = false,
  canManageSiteUsers = false,
  showVisitorPreview = false,
  visitorPreviewActive = false,
  isLoggedIn = false,
  logoUrl,
  orgName,
  headerTagline,
  navItems,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [labelByHref, setLabelByHref] = useState<Record<string, string>>({});
  const [navSaveErr, setNavSaveErr] = useState<string | null>(null);
  const [navPending, startNavTransition] = useTransition();

  useEffect(() => {
    setLabelByHref(Object.fromEntries(navItems.map((i) => [i.href, i.label])));
  }, [navItems]);

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavLabelEndEdit = useCallback(
    (forHref: string) => (final: string) => {
      const trimmed = final.trim().slice(0, 80);
      setLabelByHref((prev) => ({ ...prev, [forHref]: trimmed }));
      setNavSaveErr(null);

      const o: Record<string, string> = {};
      for (const it of navItems) {
        o[it.href] = it.href === forHref ? trimmed : (labelByHref[it.href] ?? it.label);
      }

      const changed = navItems.some((it) => o[it.href] !== it.label);
      if (!changed) return;

      startNavTransition(async () => {
        const { saveHeaderNavLabelsObjectAction } = await loadInstitutionalActions();
        const r = await saveHeaderNavLabelsObjectAction(o);
        if (r.ok) {
          router.refresh();
        } else {
          setNavSaveErr(r.message);
        }
      });
    },
    [navItems, labelByHref, router],
  );

  return (
    <header
      className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        shadow ? "shadow-lg" : "shadow-md"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        {navSaveErr ? (
          <p className="mb-2 text-center text-sm text-red-600 md:text-left" role="status">
            {navSaveErr}
          </p>
        ) : null}
        <div className="flex items-center justify-between">
          <HeaderBrandBlock
            canEdit={canManageInstitutional}
            orgName={orgName}
            headerTagline={headerTagline}
            logoUrl={logoUrl}
          />

          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const label = canManageInstitutional
                ? (labelByHref[item.href] ?? item.label)
                : item.label;
              const active = pathActive(pathname, item.href);
              const editable = canManageInstitutional && item.cmsEditableLabel !== false;
              return (
                <li key={item.href} className="list-none">
                  {editable ? (
                    <div className={navPending ? "pointer-events-none opacity-70" : undefined}>
                      <HeaderNavItemLabel
                        href={item.href}
                        value={label}
                        active={active}
                        onChange={(v) => {
                          setLabelByHref((p) => ({ ...p, [item.href]: v }));
                          setNavSaveErr(null);
                        }}
                        onEndEdit={onNavLabelEndEdit(item.href)}
                        editLabel={`Editar o nome no menu: ${item.label}`}
                      />
                    </div>
                  ) : (
                    <NavLink href={item.href} label={label} />
                  )}
                </li>
              );
            })}
            {canManageSiteUsers ? (
              <li className="list-none">
                <NavLink href="/app/usuarios" label="Usuários" />
              </li>
            ) : null}
            {showVisitorPreview ? (
              <li className="list-none">
                <VisitorPreviewButton active={visitorPreviewActive} />
              </li>
            ) : null}
            <li>
              <AuthHeaderLinks isLoggedIn={isLoggedIn} />
            </li>
            <li>
              {canManageInstitutional ? (
                <Link
                  href="/app/institucional"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  title="Rodapé, contacto, redes e mapa (informações gerais)"
                  aria-label="Dados gerais da entidade: rodapé, contacto, redes, mapa"
                >
                  <HeaderGearIcon className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  href="/como-ajudar"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Como ajudar?
                </Link>
              )}
            </li>
          </ul>

          <button
            type="button"
            className="md:hidden text-gray-700 focus:outline-none hover:text-blue-600 transition-colors duration-300"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const label = canManageInstitutional
                  ? (labelByHref[item.href] ?? item.label)
                  : item.label;
                const active = pathActive(pathname, item.href);
                const editable = canManageInstitutional && item.cmsEditableLabel !== false;
                return (
                  <li key={item.href} className="min-w-0 list-none">
                    {editable ? (
                      <div className={navPending ? "pointer-events-none opacity-70" : undefined}>
                        <HeaderNavItemLabel
                          href={item.href}
                          value={label}
                          active={active}
                          block
                          onLinkClick={() => setOpen(false)}
                          onChange={(v) => {
                            setLabelByHref((p) => ({ ...p, [item.href]: v }));
                            setNavSaveErr(null);
                          }}
                          onEndEdit={onNavLabelEndEdit(item.href)}
                          editLabel={`Editar o nome no menu: ${item.label}`}
                        />
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block w-full min-w-0 text-sm font-medium ${
                          active ? "text-blue-600" : "text-gray-700"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
              {canManageSiteUsers ? (
                <li className="list-none">
                  <Link
                    href="/app/usuarios"
                    className={`block w-full min-w-0 text-sm font-medium ${
                      pathActive(pathname, "/app/usuarios") ? "text-blue-600" : "text-gray-700"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    Usuários
                  </Link>
                </li>
              ) : null}
              {showVisitorPreview ? (
                <li className="list-none">
                  <div className="pt-1">
                    <VisitorPreviewButton active={visitorPreviewActive} />
                  </div>
                </li>
              ) : null}
              <li className="pt-2">
                <div onClick={() => setOpen(false)} className="block">
                  <AuthHeaderLinks isLoggedIn={isLoggedIn} />
                </div>
              </li>
              <li>
                {canManageInstitutional ? (
                  <Link
                    href="/app/institucional"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpen(false)}
                    title="Rodapé, contacto, redes e mapa (informações gerais)"
                    aria-label="Dados gerais da entidade: rodapé, contacto, redes, mapa"
                  >
                    <HeaderGearIcon className="h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href="/como-ajudar"
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium text-center"
                    onClick={() => setOpen(false)}
                  >
                    Como ajudar?
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
