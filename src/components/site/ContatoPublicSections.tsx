import { Section } from "@/components/site/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { ContatoPublicPageClient } from "@/components/site/ContatoPublicPageClient";
import { getPublicSiteView } from "@/lib/institutional-site/public";

type Props = { canEditContatoCopy: boolean };

/**
 * Conteúdo da página pública /contato (formulário, blocos, doações) — o que um visitante vê.
 */
export async function ContatoPublicSections({ canEditContatoCopy }: Props) {
  const site = await getPublicSiteView();
  const sc = site.scalars;
  const mailto = `mailto:${encodeURIComponent(sc.contactEmail)}`;

  return (
    <ContatoPublicPageClient canEdit={canEditContatoCopy} initial={site.contato} mailto={mailto}>
      <Section id="formulario" title="Envie Sua Mensagem" className="bg-white">
        <div className="max-w-2xl mx-auto reveal space-y-4">
          <ContactForm />
        </div>
      </Section>

      <Section title="Informações de Contato" className="bg-gray-50">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gradient-heading mb-2">E-mail</h3>
            <p className="text-gradient-subtle font-medium break-all">{sc.contactEmail}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gradient-heading mb-2">Telefone</h3>
            <p className="text-gradient-subtle font-medium">{sc.contactPhone}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gradient-heading mb-2">Endereço</h3>
            <p className="text-gradient-subtle font-medium whitespace-pre-line">{sc.address}</p>
          </div>
        </div>
      </Section>
    </ContatoPublicPageClient>
  );
}
