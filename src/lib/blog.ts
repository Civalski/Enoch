export const blogCategories = ["acao_caridade", "evento", "geral"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Conteúdo em Markdown (parágrafos, negrito, links, imagens ![alt](url), etc.) */
  bodyMarkdown: string;
  image: string;
  /** ISO 8601 date */
  publishedAt: string;
  /** Slug da categoria (ex.: geral, acao_caridade ou uma criada na base). */
  category: string;
  /** Rótulo para exibição no site. */
  categoryLabel: string;
  readingTimeMinutes: number;
  /** Preenchido só para artigos persistidos na base (não para exemplos estáticos). */
  dbPostId?: string;
};

/** Capas locais em /public/blog/covers — substituir por fotos reais quando disponíveis. */
const COVER = (n: 1 | 2 | 3 | 4) => `/blog/covers/cover-${n}.svg`;

export const categoryLabels: Record<BlogCategory, string> = {
  acao_caridade: "Ação de caridade",
  evento: "Evento",
  geral: "Geral",
};

export function defaultCategoryLabel(slug: string): string {
  return (
    (categoryLabels as Record<string, string>)[slug] ??
    slug.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

const rawPosts: Array<
  Omit<BlogPost, "bodyMarkdown" | "categoryLabel"> & { body: string[] }
> = [
  {
    slug: "arrecadacao-inverno-2026",
    title: "Campanha do Agasalho: arrecadação até 30 de maio",
    excerpt:
      "Estamos arrecadando roupas e cobertores para famílias em vulnerabilidade. Veja os pontos de entrega e como ajudar.",
    image: COVER(1),
    publishedAt: "2026-04-10",
    category: "acao_caridade",
    readingTimeMinutes: 3,
    body: [
      "A Campanha do Agasalho da A.R.L.S Enoch entra em sua etapa de arrecadação. Aceitamos roupas em bom estado, cobertores, toalhas e itens de cama, alinhados às necessidades mapeadas junto às famílias atendidas.",
      "As doações podem ser entregues em nossa sede em horário comercial ou nos pontos parceiros indicados no site e nas redes sociais. Pedimos que as peças estejam limpas e embaladas, facilitando a triagem e a distribuição.",
      "No dia da entrega às famílias, contaremos com apoio de voluntários. Se deseja participar, entre em contato pelo formulário de voluntariado. Toda ajuda fortalece quem mais precisa neste inverno.",
    ],
  },
  {
    slug: "ceia-solidaria-de-maio",
    title: "Ceia solidária: inscrições abertas para voluntários",
    excerpt:
      "Evento comunitário em maio: refeição gratuita, música e espaço kids. Saiba como se inscrever ou apoiar.",
    image: COVER(4),
    publishedAt: "2026-04-15",
    category: "evento",
    readingTimeMinutes: 2,
    body: [
      "A Ceia Solidária é um dos momentos de maior encontro da comunidade com a Enoch. Em maio, realizaremos a edição anual com refeição gratuita, apresentações culturais e oficina recreativa para crianças.",
      "Voluntários para montagem, serviço e desmontagem podem se inscrever até duas semanas antes da data, sujeita à confirmação na agenda oficial. Empresas e parceiros podem apoiar com insumos ou patrocínio de etapa do evento.",
      "A entrada é gratuita para as famílias convidadas e para quem acompanha as inscrições abertas na comunidade. Acompanhe nossas redes para datas e local exatos.",
    ],
  },
  {
    slug: "transparencia-novo-relatorio-1s2026",
    excerpt:
      "Publicamos o resumo trimestral de receitas e aplicação. Acesse os links e o que mudou no formato dos balancetes.",
    title: "Transparência: destaques do 1º trimestre de 2026",
    image: COVER(3),
    publishedAt: "2026-04-18",
    category: "geral",
    readingTimeMinutes: 4,
    body: [
      "Reforçamos o compromisso com a prestação de contas. O boletim do primeiro trimestre reúne receitas, despesas por eixo (assistência, administrativo, projetos) e comentários dos responsáveis financeiros.",
      "A partir deste ciclo, o relatório traz gráficos comparativos com o trimestre anterior, facilitando o acompanhamento por doadores e conselheiros. Os documentos completos seguem anexos na área de Transparência do site.",
      "Dúvidas e sugestões podem ser encaminhadas pelo e-mail institucional. Agradecemos a confiança de todos que apoiam a missão da Enoch.",
    ],
  },
  {
    slug: "mutirao-escola-reforco",
    title: "Mutirão de reforço escolar nas comunidades parceiras",
    excerpt:
      "Equipes de voluntários reforçam aulas de português e matemática em três bairros. Conheça o cronograma e como indicar famílias.",
    image: COVER(2),
    publishedAt: "2026-04-01",
    category: "acao_caridade",
    readingTimeMinutes: 3,
    body: [
      "O programa de reforço escolar ampliou o atendimento com mutirões mensais. Em abril e maio, as turmas concentram-se em leitura, escrita e operações básicas, com material didático doado e espaços cedidos por parceiros.",
      "Indicações de novas crianças e adolescentes passam por entrevista breve com responsáveis, garantindo vaga nos horários disponíveis. A lista de presença alimenta relatório pedagógico compartilhado com a escola pública, quando houver acordo de encaminhamento.",
      "Profissionais e estudantes de pedagogia que queiram atuar como monitores devem se cadastrar na aba de voluntariado, informando disponibilidade semanal.",
    ],
  },
  {
    slug: "encontro-beneficencia-maio-2026",
    title: "Encontro regional de entidades: 24 de maio",
    excerpt:
      "A Enoch participa do encontro com palestras sobre captação e voluntariado. Haverá transmissão parcial e credenciamento no local.",
    image: COVER(3),
    publishedAt: "2026-04-20",
    category: "evento",
    readingTimeMinutes: 2,
    body: [
      "O Encontro Regional reúne gestores e voluntários de organizações de caridade. Nossa equipe apresentará o case da Campanha do Agasalho e trocas de boas práticas em captação de pequenos doadores.",
      "Credenciamento no auditório a partir das 8h, com programação até o fim da tarde. Parte das mesas redondas será transmitida online; o link será divulgado na semana do evento.",
      "Há limite de vagas presenciais. Inscrição por e-mail com assunto 'Encontro maio' até 15/05, conforme vaga na lista de espera.",
    ],
  },
  {
    slug: "voluntariado-como-fazer-parte",
    title: "Como fazer parte do voluntariado em 2026",
    excerpt:
      "Passo a passo: cadastro, entrevista inicial e trilhas (assistência, eventos, comunicação). Tire dúvidas frequentes.",
    image: COVER(2),
    publishedAt: "2026-03-28",
    category: "geral",
    readingTimeMinutes: 5,
    body: [
      "O voluntariado na Enoch passa por cadastro no site, triagem e conversa alinhada de expectativas. Oferecemos trilhas em assistência social, apoio a eventos, comunicação e suporte administrativo.",
      "A carga mínima sugerida é de quatro horas mensais, podendo ser concentrada em campanhas ou distribuída ao longo do mês. Emitimos certificado anual e horas para projetos de extensão, mediante convênio com instituições de ensino.",
      "Perguntas frequentes: menores acompanhados de responsável podem atuar em atividades específicas; estrangeiros residentes precisam apresentar documentação conforme a política interna. Estamos abertos a novas ideias: use o contato e sugira pautas na sua área de interesse.",
    ],
  },
  {
    slug: "caminhada-solidaria-junho-2026",
    title: "Caminhada solidária: 7 de junho, largada às 8h",
    excerpt:
      "Inscrições gratuitas com camiseta e lanche. Percurso acessível de 3 km; arrecadamos alimentos não perecíveis na chegada.",
    image: COVER(2),
    publishedAt: "2026-04-25",
    category: "evento",
    readingTimeMinutes: 2,
    body: [
      "A Caminhada Solidária da A.R.L.S Enoch celebra a união em torno de uma causa: arrecadar alimentos e visibilidade para as famílias atendidas. O percurso tem cerca de 3 km, com apoio de equipe e ponto de hidratação no trajeto.",
      "A concentração é no pátio da sede, com aquecimento às 7h30 e largada simbólica às 8h. Crianças acompanhadas podem participar; animais de estimação são bem-vindos com guia e higiene garantidos.",
      "Na chegada, entregue sua doação de alimentos não perecíveis e retire seu certificado de participação. Vagas limitadas: confirme presença pelo e-mail de eventos com nome completo e tamanho da camiseta.",
    ],
  },
  {
    slug: "bazar-beneficente-maio-2026",
    title: "Bazar beneficente: 17 de maio, das 9h às 17h",
    excerpt:
      "Roupas, livros, brinquedos e artesanato. Entrada 1 quilo de alimento. Espaço kids com oficina à tarde; food trucks parceiros.",
    image: COVER(4),
    publishedAt: "2026-04-12",
    category: "evento",
    readingTimeMinutes: 3,
    body: [
      "O Bazar Beneficente reúne peças cedidas por apoiadores e voluntários, com preços acessíveis. Toda a renda reverterá para custos de transporte e compra de cestas para o programa de assistência alimentar.",
      "A entrada simbólica é de 1 kg de alimento não perecível. Teremos provador voluntário, caixa com PIX e maquininha, e setor infantil com brinquedos usados em bom estado.",
      "No período da tarde, crianças de 5 a 12 anos podem participar de oficina de pintura (vagas no local, por ordem de chegada). Food trucks têm cardápio à parte, com percentual revertido a uma vaquinha interna do evento.",
    ],
  },
  {
    slug: "workshop-pertencimento-abril-2026",
    title: "Workshop Sentir pertencimento: 3 de maio, tarde",
    excerpt:
      "Encontro aberto a voluntários e comunidade, com roda de conversa e técnicas de escuta. Inscrição pelo site até 28/04.",
    image: COVER(3),
    publishedAt: "2026-04-08",
    category: "evento",
    readingTimeMinutes: 2,
    body: [
      "O workshop propõe reflexão sobre acolhimento e vínculo em grupos de voluntariado, com mediação de convidada especialista em trabalho de grupo. Haverá momentos de escuta e exercícios leves, sem exigir experiência prévia.",
      "Duração de três horas, com intervalo. Limite de 40 lugares, prioridade para quem atua em frentes de assistência. Material de apoio será enviado por e-mail após a inscrição confirmada.",
      "O endereço e link para transmissão híbrida (para participantes fora da cidade) serão divulgados na lista de inscritos. O evento é gratuito, com oferta de voluntária a ser revertida a um fundo de transporte de insumos.",
    ],
  },
  {
    slug: "mutirao-de-saude-comunitaria-junho-2026",
    title: "Mutirão de saúde comunitária: 14 de junho",
    excerpt:
      "Aferição de pressão, orientação nutricional e encaminhamento. Profissionais voluntários. Senhas a partir das 7h30.",
    image: COVER(2),
    publishedAt: "2026-04-30",
    category: "evento",
    readingTimeMinutes: 3,
    body: [
      "A A.R.L.S Enoch organiza um mutirão de saúde com apoio de profissionais voluntários: enfermagem, nutrição e escuta de demandas de encaminhamento. O público é a comunidade cadastrada e vizinhança, com prioridade para idosos e gestantes.",
      "Haverá aferição de pressão arterial, orientação geral e orientação alimentar; exames de imagem ou laboratório não estão inclusos, mas a equipe anota encaminhamentos possíveis à rede pública de saúde.",
      "Senhas no local, sem custo, respeitando a ordem de chegada. Pedimos leve identidade e, se tiver, cartão do SUS. Dúvidas: canal de e-mail e telefone exibido na convocatória da semana do evento.",
    ],
  },
];

const posts: BlogPost[] = rawPosts.map(({ body, ...rest }) => ({
  ...rest,
  bodyMarkdown: body.join("\n\n"),
  categoryLabel: defaultCategoryLabel(rest.category),
}));

function byDateDesc(a: BlogPost, b: BlogPost): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort(byDateDesc);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): { slug: string }[] {
  return posts.map((p) => ({ slug: p.slug }));
}