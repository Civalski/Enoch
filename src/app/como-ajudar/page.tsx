import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/site/Section";
import { ShareSiteLink } from "@/components/site/ShareSiteLink";

export const metadata: Metadata = {
  title: "Como ajudar",
  description:
    "Três formas de apoiar a A.R.L.S Enoch: doações, voluntariado e divulgação da instituição",
};

const cards = [
  {
    key: "doacao",
    title: "Doar dinheiro ou materiais",
    body:
      "Contribua com doações em dinheiro (transferência ou PIX) ou com alimentos, roupas, brinquedos e outros materiais essenciais para quem atendemos.",
    href: "/contato#doar",
    cta: "Ir para doações",
    isLink: true,
  },
  {
    key: "voluntario",
    title: "Ser voluntário",
    body:
      "Ofereça seu tempo e experiência em nossos projetos sociais. Entre em contato pelo formulário e conte como deseja participar.",
    href: "/contato#formulario",
    cta: "Preencher formulário de contato",
    isLink: true,
  },
  {
    key: "divulgar",
    title: "Divulgar a instituição",
    body:
      "Compartilhe o site e nossas ações com amigos, família e redes sociais. Cada pessoa que conhece a Enoch amplia o alcance da solidariedade.",
    cta: null,
    isLink: false,
  },
] as const;

export default function ComoAjudarPage() {
  return (
    <>
      <section className="gradient-animated text-white py-20 relative overflow-hidden particles-bg">
        <div className="absolute inset-0 bg-gradient-blue-subtle opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
            Como ajudar?
          </h1>
          <p
            className="text-xl text-blue-100 animate-fade-in-up drop-shadow-md max-w-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            Escolha uma das formas abaixo e faça parte da nossa missão
          </p>
        </div>
      </section>

      <Section title="Formas de apoio" className="bg-white">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, i) => (
            <div
              key={card.key}
              className="reveal flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <span className="text-xl font-bold text-white tabular-nums">{i + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h2>
              <p className="text-slate-600 font-medium leading-relaxed flex-1 mb-4">{card.body}</p>
              {card.isLink ? (
                <Link
                  href={card.href!}
                  className="inline-flex justify-center items-center text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  {card.cta}
                </Link>
              ) : (
                <ShareSiteLink />
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
