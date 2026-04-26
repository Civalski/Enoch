import Link from "next/link";
import type { SiteCapabilities } from "@/lib/permissions/site-permission-logic";

const BASE_LINKS: readonly { href: string; label: string; key: keyof SiteCapabilities }[] = [
  { href: "/app/institucional", label: "Dados da entidade", key: "institutional" },
  { href: "/blog", label: "Blog (site)", key: "blog" },
  { href: "/projetos", label: "Projetos (site)", key: "projects" },
  { href: "/estudos", label: "Estudos (site)", key: "institutional" },
  { href: "/app/transparencia/doacoes", label: "Transparência", key: "transparency" },
] as const;

type Props = {
  caps: SiteCapabilities;
  showUsersLink: boolean;
};

export function AppBackofficeNav({ caps, showUsersLink }: Props) {
  const links = BASE_LINKS.filter((item) => caps[item.key]);
  return (
    <nav
      className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-200"
      aria-label="Atalhos do painel"
    >
      {showUsersLink ? (
        <Link
          href="/app/usuarios"
          className="text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 hover:border-violet-400 hover:text-violet-800 transition-colors"
        >
          Usuários
        </Link>
      ) : null}
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 hover:border-blue-400 hover:text-blue-700 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
