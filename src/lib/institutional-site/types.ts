/** Estruturas JSON (v1) guardadas em InstitutionalSiteContent — merge com defaults no código. */

import type { Prisma } from "@prisma/client";

export type PageMeta = {
  title?: string;
  description?: string;
};

export type TeaserCard = {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
};

export type StatItem = {
  n?: string;
  label?: string;
};

export type HelpColumn = {
  title?: string;
  body?: string;
};

export type HomeContentV1 = {
  meta?: PageMeta;
  hero?: { title?: string; subtitle?: string };
  quemSomos?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    missionHeading?: string;
    /** Vazio ou omitido: usa o logótipo scalar (`logoUrl`) */
    missionImageUrl?: string;
    p1?: string;
    p2?: string;
    ctaLabel?: string;
  };
  projetosTeaser?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    cards?: [TeaserCard?, TeaserCard?, TeaserCard?];
  };
  stats?: { items?: StatItem[] };
  comoAjudar?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    cols?: [HelpColumn?, HelpColumn?, HelpColumn?];
  };
  localizacao?: { title?: string; subtitle?: string };
};

export type AboutContentV1 = {
  meta?: PageMeta;
  hero?: { title?: string; subtitle?: string };
  /** Vazio ou omitido: usa o logótipo scalar (`logoUrl`) na secção Nossa História */
  historia?: { p1?: string; p2?: string; imageUrl?: string };
  mvv?: {
    missao?: string;
    visao?: string;
    valoresTitle?: string;
    valoresLines?: string[];
  };
  cta?: {
    title?: string;
    p?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  };
};

/** Secção «Como Fazer uma Doação» na página /contato. */
export type ContatoDoarSectionV1 = {
  title?: string;
  subtitle?: string;
  transparencyNote?: string;
  ctaLabel?: string;
};

/** Bloco transferência bancária + PIX identificado. */
export type ContatoDoacaoTransferenciaV1 = {
  blockTitle?: string;
  intro?: string;
  bankName?: string;
  agency?: string;
  account?: string;
  /** Titular, CNPJ ou nota curta (opcional). */
  beneficiary?: string;
  pixKey?: string;
};

export type ContatoDoacaoMateriaisV1 = {
  blockTitle?: string;
  intro?: string;
  items?: string[];
  footer?: string;
};

export type ContatoDoacaoAnonimaV1 = {
  title?: string;
  body?: string;
  pixLabel?: string;
  pixKey?: string;
  footer?: string;
};

export type ContatoContentV1 = {
  meta?: PageMeta;
  hero?: { title?: string; subtitle?: string };
  doarSection?: ContatoDoarSectionV1;
  doacaoTransferencia?: ContatoDoacaoTransferenciaV1;
  doacaoMateriais?: ContatoDoacaoMateriaisV1;
  doacaoAnonima?: ContatoDoacaoAnonimaV1;
};

/** Página pública /projetos (textos; cartões de projetos vêm da base ou estáticos). */
export type ProjetosLineTriple = { n?: string; h?: string; sub?: string };
export type ProjetosParticiparCard = { n?: string; t?: string; d?: string };

export type ProjetosContentV1 = {
  meta?: PageMeta;
  hero?: { title?: string; subtitle?: string };
  emAndamento?: { title?: string; subtitle?: string };
  impacto?: {
    sectionTitle?: string;
    numbersTitle?: string;
    imageUrl?: string;
    items?: [ProjetosLineTriple?, ProjetosLineTriple?, ProjetosLineTriple?];
  };
  participar?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    items?: [ProjetosParticiparCard?, ProjetosParticiparCard?, ProjetosParticiparCard?];
  };
};

export type BlogContentV1 = {
  meta?: PageMeta;
  hero?: { title?: string; subtitle?: string };
  listSection?: { title?: string; subtitle?: string };
};

/** Página pública /estudos: títulos no topo e meta. */
export type EstudosContentV1 = {
  meta?: PageMeta;
  pageHeader?: { title?: string; subtitle?: string };
};

/** Item do menu principal (após merge com defaults + overrides em `headerNavLabels` na base). */
export type HeaderNavItem = {
  href: string;
  label: string;
  /** Se false, o rótulo não é editável no cabeçalho. Omitido = editável quando há permissão institucional. */
  cmsEditableLabel?: boolean;
};

export type ScalarFields = {
  orgName: string;
  /** Texto pequeno abaixo do nome da entidade no cabeçalho. */
  headerTagline: string;
  footerTagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  mapEmbedUrl: string;
  /** Se preenchido, substitui a linha gerada com ano + orgName */
  copyrightLine: string | null;
  logoUrl: string;
};

export type PublicSiteView = {
  scalars: ScalarFields;
  home: HomeContentV1;
  about: AboutContentV1;
  contato: ContatoContentV1;
  projetos: ProjetosContentV1;
  blog: BlogContentV1;
  estudos: EstudosContentV1;
  /** Ordem fixa; `label` vem do default ou do override em base. */
  headerNav: HeaderNavItem[];
  /** JSON bruto `headerNavLabels` (para rótulos extra, ex. /app/email). */
  headerNavLabelsRaw: Prisma.JsonValue | null;
};
