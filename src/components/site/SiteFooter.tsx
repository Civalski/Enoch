import Link from "next/link";
import { copyrightDisplayLine } from "@/lib/institutional-site/merge";
import type { PublicSiteView } from "@/lib/institutional-site/types";
import { FooterSocialLinks } from "@/components/site/FooterSocialLinks";

type Props = { site: PublicSiteView };

export function SiteFooter({ site }: Props) {
  const sc = site.scalars;
  const year = new Date().getFullYear();
  const copyLine = copyrightDisplayLine(sc, year);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{sc.orgName}</h3>
            <p className="text-sm mb-4 whitespace-pre-line">{sc.footerTagline}</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                ["/", "Início"],
                ["/sobre", "Sobre Nós"],
                ["/projetos", "Projetos"],
                ["/estudos", "Estudos"],
                ["/blog", "Blog"],
                ["/contato", "Contato"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-2 text-sm whitespace-pre-line">
              <li>Email: {sc.contactEmail}</li>
              <li>Telefone: {sc.contactPhone}</li>
              <li>Endereço: {sc.address}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Redes Sociais</h3>
            <FooterSocialLinks
              facebookUrl={sc.facebookUrl}
              instagramUrl={sc.instagramUrl}
              whatsappUrl={sc.whatsappUrl}
            />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <div className="relative">
            <p>{copyLine}</p>
            <p className="mt-2 text-gray-500">
              Desenvolvido por{" "}
              <a
                href="https://arkersoft.com.br"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                arkersoft.com.br
              </a>
            </p>
            <Link
              href="/admpainel"
              className="absolute right-0 bottom-0 -m-0.5 inline-flex rounded p-0.5 text-gray-500/15 transition-colors hover:text-gray-300/80 focus-visible:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              aria-label="Iniciar sessão"
            >
              <svg
                className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
