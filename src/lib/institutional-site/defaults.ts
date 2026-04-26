import type {
  AboutContentV1,
  BlogContentV1,
  ContatoContentV1,
  EstudosContentV1,
  HeaderNavItem,
  HomeContentV1,
  ProjetosContentV1,
  ScalarFields,
} from "./types";

export const DEFAULT_LOGO_URL =
  "https://enoch.ornete.com/Loja/17673/Site/Logotipo.jpg?20240622135039";

export const DEFAULT_SCALARS: ScalarFields = {
  orgName: "A.R.L.S Enoch",
  headerTagline: "Instituição de Caridade",
  footerTagline:
    "Instituição de caridade dedicada a fazer a diferença na vida das pessoas através de ações solidárias e projetos sociais.",
  contactEmail: "contato@arlsenoch.org.br",
  contactPhone: "(00) 0000-0000",
  address: "[Endereço da Instituição]",
  facebookUrl: "",
  instagramUrl: "",
  whatsappUrl: "",
  mapEmbedUrl:
    "https://www.google.com/maps?z=15&q=Brasil,SP,Campinas,Jardim%2bSanta%2bC%c3%a2ndida,R.%2bOlga%2bde%2bGeorgio%2bGeracci,231&output=embed",
  copyrightLine: null,
  logoUrl: DEFAULT_LOGO_URL,
};

export const DEFAULT_HOME_V1: HomeContentV1 = {
  meta: {
    title: "Início",
    description:
      "A.R.L.S Enoch - Transformando vidas através da solidariedade e ações sociais",
  },
  hero: {
    title: "Transformando Vidas Através da Solidariedade",
    subtitle:
      "A.R.L.S Enoch é uma instituição dedicada a fazer a diferença na vida das pessoas através de ações solidárias e projetos sociais.",
  },
  quemSomos: {
    sectionTitle: "Quem Somos",
    sectionSubtitle:
      "Uma instituição comprometida com o bem-estar social e a transformação de vidas",
    missionHeading: "Nossa Missão",
    p1: "A A.R.L.S Enoch tem como missão promover ações de caridade, assistência social e desenvolvimento comunitário, sempre com foco no bem-estar e na dignidade das pessoas que atendemos.",
    p2: "Acreditamos que pequenas ações podem gerar grandes transformações e que juntos podemos construir um mundo mais justo e solidário.",
    ctaLabel: "Conheça Mais Sobre Nós",
  },
  projetosTeaser: {
    title: "Nossos Projetos",
    subtitle: "Conheça algumas das iniciativas que desenvolvemos para transformar vidas",
    ctaLabel: "Ver Todos os Projetos",
    cards: [
      {
        title: "Assistência Social",
        description:
          "Programas de assistência para famílias em situação de vulnerabilidade social, oferecendo apoio alimentar, vestuário e recursos básicos.",
        image:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&q=80",
        link: "/projetos",
      },
      {
        title: "Educação e Capacitação",
        description:
          "Cursos e workshops gratuitos para capacitação profissional e desenvolvimento de habilidades, promovendo a inserção no mercado de trabalho.",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80",
        link: "/projetos",
      },
      {
        title: "Ações Comunitárias",
        description:
          "Eventos e atividades que promovem a integração social, fortalecendo os laços comunitários e criando espaços de convivência.",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
        link: "/projetos",
      },
    ],
  },
  stats: {
    items: [
      { n: "500+", label: "Famílias Atendidas" },
      { n: "50+", label: "Projetos Realizados" },
      { n: "1000+", label: "Voluntários" },
      { n: "10+", label: "Anos de Atuação" },
    ],
  },
  comoAjudar: {
    title: "Como Você Pode Ajudar",
    subtitle: "Existem várias formas de contribuir com nossa causa e fazer a diferença",
    ctaLabel: "Como ajudar?",
    cols: [
      {
        title: "Doações Financeiras",
        body: "Sua contribuição financeira ajuda a manter nossos projetos e ampliar nosso alcance.",
      },
      {
        title: "Voluntariado",
        body: "Doe seu tempo e habilidades para ajudar em nossos projetos e eventos.",
      },
      {
        title: "Doações de Materiais",
        body: "Alimentos, roupas, brinquedos e outros materiais são sempre bem-vindos.",
      },
    ],
  },
  localizacao: {
    title: "Nossa Localização",
    subtitle: "Venha nos visitar",
  },
};

export const DEFAULT_ABOUT_V1: AboutContentV1 = {
  meta: {
    title: "Sobre Nós",
    description: "Conheça a história e os valores da A.R.L.S Enoch",
  },
  hero: {
    title: "Sobre a A.R.L.S Enoch",
    subtitle: "Conheça nossa história, missão e valores",
  },
  historia: {
    p1: "A A.R.L.S Enoch foi fundada com o propósito de transformar vidas através da solidariedade e ações sociais. Desde o início, nossa instituição tem se dedicado a promover o bem-estar social e a dignidade humana.",
    p2: "Ao longo dos anos, desenvolvemos diversos projetos que impactaram positivamente centenas de famílias, sempre mantendo nosso compromisso com a transparência e a eficiência no uso dos recursos.",
  },
  mvv: {
    missao:
      "Promover ações de caridade, assistência social e desenvolvimento comunitário, sempre com foco no bem-estar e na dignidade das pessoas que atendemos.",
    visao:
      "Ser reconhecida como uma instituição de referência em ações sociais, promovendo transformações positivas e duradouras na vida das pessoas e comunidades.",
    valoresTitle: "Valores",
    valoresLines: [
      "Solidariedade",
      "Transparência",
      "Comprometimento",
      "Respeito à dignidade humana",
      "Eficiência e responsabilidade",
    ],
  },
  cta: {
    title: "Faça Parte Desta Causa",
    p: "Junte-se a nós e ajude a transformar vidas através da solidariedade",
    primaryLabel: "Como ajudar?",
    secondaryLabel: "Entre em Contato",
  },
};

export const DEFAULT_CONTATO_V1: ContatoContentV1 = {
  meta: {
    title: "Contato",
    description: "Entre em contato com a A.R.L.S Enoch e saiba como ajudar",
  },
  hero: {
    title: "Entre em Contato",
    subtitle: "Estamos aqui para ajudar e responder suas dúvidas",
  },
  doarSection: {
    title: "Como Fazer uma Doação",
    subtitle: "Sua contribuição faz a diferença na vida de muitas pessoas",
    transparencyNote:
      "Todas as doações são utilizadas exclusivamente para os projetos da instituição. Mantemos total transparência sobre o uso dos recursos.",
    ctaLabel: "Entre em Contato para Mais Informações",
  },
  doacaoTransferencia: {
    blockTitle: "Doação por Transferência/PIX",
    intro: "Faça sua doação diretamente via transferência bancária ou PIX:",
    bankName: "[Nome do Banco]",
    agency: "[Número]",
    account: "[Número da Conta]",
    beneficiary: "",
    pixKey: "[Chave PIX]",
  },
  doacaoMateriais: {
    blockTitle: "Doação de Materiais",
    intro: "Aceitamos doações de:",
    items: [
      "Alimentos não perecíveis",
      "Roupas e calçados",
      "Brinquedos",
      "Material de higiene",
      "Material escolar",
    ],
    footer: "Entre em contato para combinar a entrega.",
  },
  doacaoAnonima: {
    title: "Doação Anônima via PIX",
    body:
      "Prefere fazer sua doação de forma anônima? Utilize nossa chave PIX exclusiva para doações anônimas. Sua identidade será mantida em total sigilo.",
    pixLabel: "Chave PIX para Doação Anônima:",
    pixKey: "[Chave PIX Anônima]",
    footer: "Sua generosidade faz a diferença, mesmo sem revelar sua identidade.",
  },
};

export const DEFAULT_HEADER_NAV: readonly HeaderNavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/estudos", label: "Estudos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
  { href: "/transparencia", label: "Transparência" },
];

export const DEFAULT_ESTUDOS_V1: EstudosContentV1 = {
  meta: {
    title: "Estudos",
  },
  pageHeader: {
    title: "Estudos",
    subtitle: "Sala de conhecimento: links de download e material educacional gratuito.",
  },
};

export const DEFAULT_BLOG_V1: BlogContentV1 = {
  meta: {
    title: "Blog",
    description:
      "Prévias de notícias, eventos e artigos da A.R.L.S Enoch — clique para ler cada publicação na íntegra.",
  },
  hero: {
    title: "Blog",
    subtitle:
      "Abaixo você vê uma prévia de cada notícia. Toque ou clique para abrir a publicação completa.",
  },
  listSection: {
    title: "Prévia das notícias",
    subtitle:
      "Resumo e imagem de cada publicação. Use o filtro por categoria ou abra a notícia completa no clique.",
  },
};

export const DEFAULT_PROJETOS_V1: ProjetosContentV1 = {
  meta: {
    title: "Projetos",
    description: "Conheça os projetos e iniciativas da A.R.L.S Enoch",
  },
  hero: {
    title: "Nossos Projetos",
    subtitle: "Conheça as iniciativas que transformam vidas",
  },
  emAndamento: {
    title: "Projetos em Andamento",
    subtitle: "Iniciativas que fazem a diferença na vida das pessoas",
  },
  impacto: {
    sectionTitle: "Impacto dos Nossos Projetos",
    numbersTitle: "Números que Transformam",
    imageUrl:
      "https://images.unsplash.com/photo-1504439268584-b72c5019471e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    items: [
      {
        n: "1",
        h: "500+ Famílias Atendidas",
        sub: "Famílias que receberam assistência através de nossos projetos",
      },
      {
        n: "2",
        h: "50+ Projetos Realizados",
        sub: "Iniciativas desenvolvidas ao longo dos anos",
      },
      {
        n: "3",
        h: "1000+ Voluntários",
        sub: "Pessoas que dedicam seu tempo para fazer a diferença",
      },
    ],
  },
  participar: {
    title: "Como Participar dos Projetos",
    subtitle:
      "Existem várias formas de se envolver e fazer parte das nossas iniciativas",
    ctaLabel: "Entre em Contato",
    items: [
      {
        n: "1",
        t: "Seja Voluntário",
        d: "Participe diretamente dos nossos projetos como voluntário e faça a diferença na vida das pessoas.",
      },
      {
        n: "2",
        t: "Faça uma Doação",
        d: "Sua contribuição financeira ajuda a manter e ampliar nossos projetos e iniciativas.",
      },
      {
        n: "3",
        t: "Divulgue",
        d: "Compartilhe nossos projetos e ajude a aumentar o alcance das nossas ações.",
      },
    ],
  },
};
