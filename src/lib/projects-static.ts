/**
 * Projetos de texto de exemplo; na base, um registo com o mesmo título substitui a entrada.
 */
export type StaticProject = { title: string; description: string; image: string };

export const STATIC_PROJETOS: StaticProject[] = [
  {
    title: "Assistência Alimentar",
    description:
      "Distribuição de cestas básicas e refeições para famílias em situação de vulnerabilidade social, garantindo segurança alimentar.",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&q=80",
  },
  {
    title: "Programa de Capacitação Profissional",
    description:
      "Cursos gratuitos de capacitação profissional em diversas áreas, promovendo a inserção no mercado de trabalho.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80",
  },
  {
    title: "Apoio à Infância",
    description:
      "Projetos voltados para crianças e adolescentes, incluindo atividades educativas, recreativas e apoio escolar.",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80",
  },
  {
    title: "Assistência ao Idoso",
    description:
      "Programas de atenção e cuidado com idosos, incluindo visitas domiciliares, atividades recreativas e apoio social.",
    image:
      "https://images.unsplash.com/photo-1559027615-51f9f03eceb2?w=800&h=600&fit=crop&q=80",
  },
  {
    title: "Campanhas de Arrecadação",
    description:
      "Organização de campanhas para arrecadação de alimentos, roupas, brinquedos e outros materiais para famílias necessitadas.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&q=80",
  },
  {
    title: "Eventos Comunitários",
    description:
      "Realização de eventos que promovem a integração social e o fortalecimento dos laços comunitários.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
  },
];

export function getStaticProjectByTitle(title: string): StaticProject | undefined {
  return STATIC_PROJETOS.find((p) => p.title === title);
}
