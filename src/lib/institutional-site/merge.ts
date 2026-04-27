import type { Prisma } from "@prisma/client";
import {
  DEFAULT_ABOUT_V1,
  DEFAULT_BLOG_V1,
  DEFAULT_CONTATO_V1,
  DEFAULT_ESTUDOS_V1,
  DEFAULT_HEADER_NAV,
  DEFAULT_HOME_V1,
  DEFAULT_PROJETOS_V1,
  DEFAULT_SCALARS,
} from "./defaults";
import type {
  AboutContentV1,
  BlogContentV1,
  ContatoContentV1,
  EstudosContentV1,
  HeaderNavItem,
  HelpColumn,
  HomeContentV1,
  PageMeta,
  ProjetosContentV1,
  ProjetosLineTriple,
  ProjetosParticiparCard,
  ScalarFields,
  StatItem,
} from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function mergePageMeta(base: PageMeta, patch: unknown): PageMeta {
  if (!isRecord(patch)) return { ...base };
  return {
    title: typeof patch.title === "string" ? patch.title : base.title,
    description: typeof patch.description === "string" ? patch.description : base.description,
  };
}

function mergeCards(
  base: NonNullable<NonNullable<HomeContentV1["projetosTeaser"]>["cards"]>,
  patch: unknown,
): NonNullable<NonNullable<HomeContentV1["projetosTeaser"]>["cards"]> {
  if (!Array.isArray(patch)) {
    return base?.map((c) => ({ ...c })) as NonNullable<
      NonNullable<HomeContentV1["projetosTeaser"]>["cards"]
    >;
  }
  const out = (base ?? []).map((b, i) => {
    const p = patch[i];
    if (!isRecord(p)) return { ...b };
    return {
      ...b,
      title: typeof p.title === "string" ? p.title : b?.title,
      description: typeof p.description === "string" ? p.description : b?.description,
      image: typeof p.image === "string" ? p.image : b?.image,
      link: typeof p.link === "string" ? p.link : b?.link,
    };
  });
  return out as NonNullable<NonNullable<HomeContentV1["projetosTeaser"]>["cards"]>;
}

function mergeStats(base: StatItem[], patch: unknown): StatItem[] {
  if (!Array.isArray(patch)) return base.map((x) => ({ ...x }));
  return base.map((b, i) => {
    const p = patch[i];
    if (!isRecord(p)) return { ...b };
    return {
      n: typeof p.n === "string" ? p.n : b.n,
      label: typeof p.label === "string" ? p.label : b.label,
    };
  });
}

function mergeCols(base: HelpColumn[], patch: unknown): HelpColumn[] {
  if (!Array.isArray(patch)) return base.map((x) => ({ ...x }));
  return base.map((b, i) => {
    const p = patch[i];
    if (!isRecord(p)) return { ...b };
    return {
      title: typeof p.title === "string" ? p.title : b?.title,
      body: typeof p.body === "string" ? p.body : b?.body,
    };
  });
}

export function mergeHomeContent(patch: Prisma.JsonValue | null | undefined): HomeContentV1 {
  const base = DEFAULT_HOME_V1;
  if (patch === null || patch === undefined) {
    return structuredClone(base);
  }
  if (!isRecord(patch)) {
    return structuredClone(base);
  }

  const hero = isRecord(patch.hero) ? patch.hero : {};
  const quem = isRecord(patch.quemSomos) ? patch.quemSomos : {};
  const proj = isRecord(patch.projetosTeaser) ? patch.projetosTeaser : {};
  const stats = isRecord(patch.stats) ? patch.stats : {};
  const ajuda = isRecord(patch.comoAjudar) ? patch.comoAjudar : {};
  const loc = isRecord(patch.localizacao) ? patch.localizacao : {};

  return {
    meta: mergePageMeta(base.meta ?? {}, patch.meta),
    hero: {
      title: typeof hero.title === "string" ? hero.title : base.hero?.title,
      subtitle: typeof hero.subtitle === "string" ? hero.subtitle : base.hero?.subtitle,
      imageUrl: typeof hero.imageUrl === "string" ? hero.imageUrl : base.hero?.imageUrl,
    },
    quemSomos: {
      sectionTitle:
        typeof quem.sectionTitle === "string" ? quem.sectionTitle : base.quemSomos?.sectionTitle,
      sectionSubtitle:
        typeof quem.sectionSubtitle === "string"
          ? quem.sectionSubtitle
          : base.quemSomos?.sectionSubtitle,
      missionHeading:
        typeof quem.missionHeading === "string"
          ? quem.missionHeading
          : base.quemSomos?.missionHeading,
      p1: typeof quem.p1 === "string" ? quem.p1 : base.quemSomos?.p1,
      p2: typeof quem.p2 === "string" ? quem.p2 : base.quemSomos?.p2,
      ctaLabel: typeof quem.ctaLabel === "string" ? quem.ctaLabel : base.quemSomos?.ctaLabel,
      missionImageUrl:
        typeof quem.missionImageUrl === "string"
          ? quem.missionImageUrl
          : base.quemSomos?.missionImageUrl,
    },
    projetosTeaser: {
      title: typeof proj.title === "string" ? proj.title : base.projetosTeaser?.title,
      subtitle: typeof proj.subtitle === "string" ? proj.subtitle : base.projetosTeaser?.subtitle,
      ctaLabel:
        typeof proj.ctaLabel === "string" ? proj.ctaLabel : base.projetosTeaser?.ctaLabel,
      cards: mergeCards(base.projetosTeaser?.cards ?? [], proj.cards),
    },
    stats: {
      items: mergeStats(
        base.stats?.items ?? [],
        stats.items,
      ),
    },
    comoAjudar: {
      title: typeof ajuda.title === "string" ? ajuda.title : base.comoAjudar?.title,
      subtitle: typeof ajuda.subtitle === "string" ? ajuda.subtitle : base.comoAjudar?.subtitle,
      ctaLabel:
        typeof ajuda.ctaLabel === "string" ? ajuda.ctaLabel : base.comoAjudar?.ctaLabel,
      cols: mergeCols(
        (base.comoAjudar?.cols?.filter(Boolean) as HelpColumn[]) ?? [],
        ajuda.cols,
      ) as NonNullable<NonNullable<HomeContentV1["comoAjudar"]>["cols"]>,
    },
    localizacao: {
      title: typeof loc.title === "string" ? loc.title : base.localizacao?.title,
      subtitle: typeof loc.subtitle === "string" ? loc.subtitle : base.localizacao?.subtitle,
    },
  };
}

export function mergeAboutContent(patch: Prisma.JsonValue | null | undefined): AboutContentV1 {
  const base = DEFAULT_ABOUT_V1;
  if (patch === null || patch === undefined || !isRecord(patch)) {
    return structuredClone(base);
  }
  const hero = isRecord(patch.hero) ? patch.hero : {};
  const hist = isRecord(patch.historia) ? patch.historia : {};
  const mvv = isRecord(patch.mvv) ? patch.mvv : {};
  const cta = isRecord(patch.cta) ? patch.cta : {};

  let valoresLines = base.mvv?.valoresLines ?? [];
  if (Array.isArray(mvv.valoresLines)) {
    valoresLines = mvv.valoresLines.filter((x): x is string => typeof x === "string");
  }

  return {
    meta: mergePageMeta(base.meta ?? {}, patch.meta),
    hero: {
      title:
        typeof hero.title === "string" && hero.title.trim() !== ""
          ? hero.title.trim()
          : base.hero?.title,
      subtitle:
        typeof hero.subtitle === "string" && hero.subtitle.trim() !== ""
          ? hero.subtitle.trim()
          : base.hero?.subtitle,
    },
    historia: {
      p1: typeof hist.p1 === "string" ? hist.p1 : base.historia?.p1,
      p2: typeof hist.p2 === "string" ? hist.p2 : base.historia?.p2,
      imageUrl:
        typeof hist.imageUrl === "string" && hist.imageUrl.trim() !== ""
          ? hist.imageUrl.trim()
          : base.historia?.imageUrl,
    },
    mvv: {
      missao: typeof mvv.missao === "string" ? mvv.missao : base.mvv?.missao,
      visao: typeof mvv.visao === "string" ? mvv.visao : base.mvv?.visao,
      valoresTitle:
        typeof mvv.valoresTitle === "string" ? mvv.valoresTitle : base.mvv?.valoresTitle,
      valoresLines: valoresLines.length > 0 ? valoresLines : base.mvv?.valoresLines,
    },
    cta: {
      title: typeof cta.title === "string" ? cta.title : base.cta?.title,
      p: typeof cta.p === "string" ? cta.p : base.cta?.p,
      primaryLabel:
        typeof cta.primaryLabel === "string" ? cta.primaryLabel : base.cta?.primaryLabel,
      secondaryLabel:
        typeof cta.secondaryLabel === "string" ? cta.secondaryLabel : base.cta?.secondaryLabel,
    },
  };
}

function mergeContatoStringList(base: string[], patch: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(patch)) {
    return base.map((s) => s.slice(0, maxLen)).slice(0, maxItems);
  }
  if (patch.length === 0) return [];
  return patch
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim().slice(0, maxLen))
    .filter((s) => s.length > 0)
    .slice(0, maxItems);
}

export function mergeContatoContent(
  patch: Prisma.JsonValue | null | undefined,
): ContatoContentV1 {
  const base = DEFAULT_CONTATO_V1;
  if (patch === null || patch === undefined || !isRecord(patch)) {
    return structuredClone(base);
  }
  const hero = isRecord(patch.hero) ? patch.hero : {};
  const doarBase = base.doarSection ?? {};
  const doar = isRecord(patch.doarSection) ? patch.doarSection : {};
  const dtBase = base.doacaoTransferencia ?? {};
  const dt = isRecord(patch.doacaoTransferencia) ? patch.doacaoTransferencia : {};
  const dmBase = base.doacaoMateriais ?? {};
  const dm = isRecord(patch.doacaoMateriais) ? patch.doacaoMateriais : {};
  const daBase = base.doacaoAnonima ?? {};
  const da = isRecord(patch.doacaoAnonima) ? patch.doacaoAnonima : {};
  const itemsBase = dmBase.items ?? [];
  return {
    meta: mergePageMeta(base.meta ?? {}, patch.meta),
    hero: {
      title: typeof hero.title === "string" ? hero.title : base.hero?.title,
      subtitle: typeof hero.subtitle === "string" ? hero.subtitle : base.hero?.subtitle,
    },
    doarSection: {
      title: typeof doar.title === "string" ? doar.title : doarBase.title,
      subtitle: typeof doar.subtitle === "string" ? doar.subtitle : doarBase.subtitle,
      transparencyNote:
        typeof doar.transparencyNote === "string" ? doar.transparencyNote : doarBase.transparencyNote,
      ctaLabel: typeof doar.ctaLabel === "string" ? doar.ctaLabel : doarBase.ctaLabel,
    },
    doacaoTransferencia: {
      blockTitle: typeof dt.blockTitle === "string" ? dt.blockTitle : dtBase.blockTitle,
      intro: typeof dt.intro === "string" ? dt.intro : dtBase.intro,
      bankName: typeof dt.bankName === "string" ? dt.bankName : dtBase.bankName,
      agency: typeof dt.agency === "string" ? dt.agency : dtBase.agency,
      account: typeof dt.account === "string" ? dt.account : dtBase.account,
      beneficiary: typeof dt.beneficiary === "string" ? dt.beneficiary : dtBase.beneficiary,
      pixKey: typeof dt.pixKey === "string" ? dt.pixKey : dtBase.pixKey,
    },
    doacaoMateriais: {
      blockTitle: typeof dm.blockTitle === "string" ? dm.blockTitle : dmBase.blockTitle,
      intro: typeof dm.intro === "string" ? dm.intro : dmBase.intro,
      items: mergeContatoStringList(itemsBase, dm.items, 30, 300),
      footer: typeof dm.footer === "string" ? dm.footer : dmBase.footer,
    },
    doacaoAnonima: {
      title: typeof da.title === "string" ? da.title : daBase.title,
      body: typeof da.body === "string" ? da.body : daBase.body,
      pixLabel: typeof da.pixLabel === "string" ? da.pixLabel : daBase.pixLabel,
      pixKey: typeof da.pixKey === "string" ? da.pixKey : daBase.pixKey,
      footer: typeof da.footer === "string" ? da.footer : daBase.footer,
    },
  };
}

function mergeImpactItems(
  base: NonNullable<NonNullable<ProjetosContentV1["impacto"]>["items"]>,
  patch: unknown,
): NonNullable<NonNullable<ProjetosContentV1["impacto"]>["items"]> {
  if (!Array.isArray(patch)) {
    return base?.map((c) => ({ ...c })) as NonNullable<
      NonNullable<ProjetosContentV1["impacto"]>["items"]
    >;
  }
  const b = (base ?? []) as ProjetosLineTriple[];
  return b.map((row, i) => {
    const p = patch[i];
    if (!isRecord(p)) return { ...row };
    return {
      n: typeof p.n === "string" ? p.n : row?.n,
      h: typeof p.h === "string" ? p.h : row?.h,
      sub: typeof p.sub === "string" ? p.sub : row?.sub,
    };
  }) as NonNullable<NonNullable<ProjetosContentV1["impacto"]>["items"]>;
}

function mergeParticiparItems(
  base: NonNullable<NonNullable<ProjetosContentV1["participar"]>["items"]>,
  patch: unknown,
): NonNullable<NonNullable<ProjetosContentV1["participar"]>["items"]> {
  if (!Array.isArray(patch)) {
    return base?.map((c) => ({ ...c })) as NonNullable<
      NonNullable<ProjetosContentV1["participar"]>["items"]
    >;
  }
  const b = (base ?? []) as ProjetosParticiparCard[];
  return b.map((row, i) => {
    const p = patch[i];
    if (!isRecord(p)) return { ...row };
    return {
      n: typeof p.n === "string" ? p.n : row?.n,
      t: typeof p.t === "string" ? p.t : row?.t,
      d: typeof p.d === "string" ? p.d : row?.d,
    };
  }) as NonNullable<NonNullable<ProjetosContentV1["participar"]>["items"]>;
}

export function mergeBlogContent(patch: Prisma.JsonValue | null | undefined): BlogContentV1 {
  const base = DEFAULT_BLOG_V1;
  if (patch === null || patch === undefined || !isRecord(patch)) {
    return structuredClone(base);
  }
  const hero = isRecord(patch.hero) ? patch.hero : {};
  const list = isRecord(patch.listSection) ? patch.listSection : {};
  return {
    meta: mergePageMeta(base.meta ?? {}, patch.meta),
    hero: {
      title: typeof hero.title === "string" ? hero.title : base.hero?.title,
      subtitle: typeof hero.subtitle === "string" ? hero.subtitle : base.hero?.subtitle,
    },
    listSection: {
      title: typeof list.title === "string" ? list.title : base.listSection?.title,
      subtitle: typeof list.subtitle === "string" ? list.subtitle : base.listSection?.subtitle,
    },
  };
}

export function mergeEstudosContent(
  patch: Prisma.JsonValue | null | undefined,
): EstudosContentV1 {
  const base = DEFAULT_ESTUDOS_V1;
  if (patch === null || patch === undefined || !isRecord(patch)) {
    return structuredClone(base);
  }
  const ph = isRecord(patch.pageHeader) ? patch.pageHeader : {};
  const metaMerged = mergePageMeta(base.meta ?? {}, patch.meta);
  return {
    meta: { title: metaMerged.title ?? base.meta?.title },
    pageHeader: {
      title: typeof ph.title === "string" ? ph.title : base.pageHeader?.title,
      subtitle: typeof ph.subtitle === "string" ? ph.subtitle : base.pageHeader?.subtitle,
    },
  };
}

function parseHeaderNavLabelOverrides(labelOverrides: unknown): Record<string, string> {
  const o: Record<string, string> = {};
  if (labelOverrides != null && isRecord(labelOverrides)) {
    for (const [k, v] of Object.entries(labelOverrides)) {
      if (typeof v === "string" && v.trim() !== "") {
        o[k] = v.trim().slice(0, 80);
      }
    }
  }
  return o;
}

/** Rotas fixas; só o texto do menu pode ser ajustado na base. */
export function mergeHeaderNavItems(labelOverrides: unknown): HeaderNavItem[] {
  const o = parseHeaderNavLabelOverrides(labelOverrides);
  return DEFAULT_HEADER_NAV.map((item) => ({
    href: item.href,
    label: o[item.href] ?? item.label,
  }));
}

export const HEADER_NAV_INBOX_HREF = "/app/email" as const;
export const HEADER_NAV_INBOX_DEFAULT_LABEL = "Email";

/** Insere o atalho da caixa de e-mail após «Contato», se o utilizador tiver acesso. */
export function withContactInboxNavItem(
  items: HeaderNavItem[],
  include: boolean,
  labelOverrides: unknown,
): HeaderNavItem[] {
  if (!include) return items;
  const o = parseHeaderNavLabelOverrides(labelOverrides);
  const inboxItem: HeaderNavItem = {
    href: HEADER_NAV_INBOX_HREF,
    label: o[HEADER_NAV_INBOX_HREF] ?? HEADER_NAV_INBOX_DEFAULT_LABEL,
  };
  const i = items.findIndex((x) => x.href === "/contato");
  const at = i >= 0 ? i + 1 : items.length;
  const out = [...items];
  out.splice(at, 0, inboxItem);
  return out;
}

export function mergeProjetosContent(patch: Prisma.JsonValue | null | undefined): ProjetosContentV1 {
  const base = DEFAULT_PROJETOS_V1;
  if (patch === null || patch === undefined || !isRecord(patch)) {
    return structuredClone(base);
  }
  const hero = isRecord(patch.hero) ? patch.hero : {};
  const em = isRecord(patch.emAndamento) ? patch.emAndamento : {};
  const imp = isRecord(patch.impacto) ? patch.impacto : {};
  const part = isRecord(patch.participar) ? patch.participar : {};
  return {
    meta: mergePageMeta(base.meta ?? {}, patch.meta),
    hero: {
      title: typeof hero.title === "string" ? hero.title : base.hero?.title,
      subtitle: typeof hero.subtitle === "string" ? hero.subtitle : base.hero?.subtitle,
    },
    emAndamento: {
      title: typeof em.title === "string" ? em.title : base.emAndamento?.title,
      subtitle: typeof em.subtitle === "string" ? em.subtitle : base.emAndamento?.subtitle,
    },
    impacto: {
      sectionTitle:
        typeof imp.sectionTitle === "string" ? imp.sectionTitle : base.impacto?.sectionTitle,
      numbersTitle:
        typeof imp.numbersTitle === "string" ? imp.numbersTitle : base.impacto?.numbersTitle,
      imageUrl: typeof imp.imageUrl === "string" ? imp.imageUrl : base.impacto?.imageUrl,
      items: mergeImpactItems(
        (base.impacto?.items ?? DEFAULT_PROJETOS_V1.impacto?.items) as NonNullable<
          NonNullable<ProjetosContentV1["impacto"]>["items"]
        >,
        imp.items,
      ),
    },
    participar: {
      title: typeof part.title === "string" ? part.title : base.participar?.title,
      subtitle: typeof part.subtitle === "string" ? part.subtitle : base.participar?.subtitle,
      ctaLabel: typeof part.ctaLabel === "string" ? part.ctaLabel : base.participar?.ctaLabel,
      items: mergeParticiparItems(
        (base.participar?.items ?? DEFAULT_PROJETOS_V1.participar?.items) as NonNullable<
          NonNullable<ProjetosContentV1["participar"]>["items"]
        >,
        part.items,
      ),
    },
  };
}

type RowScalars = {
  orgName: string | null;
  headerTagline: string | null;
  footerTagline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  mapEmbedUrl: string | null;
  copyrightLine: string | null;
  logoUrl: string | null;
};

export function mergeScalars(row: RowScalars | null | undefined): ScalarFields {
  const d = DEFAULT_SCALARS;
  if (!row) return { ...d, copyrightLine: d.copyrightLine };
  return {
    orgName: row.orgName?.trim() || d.orgName,
    headerTagline: row.headerTagline?.trim() || d.headerTagline,
    footerTagline: row.footerTagline?.trim() || d.footerTagline,
    contactEmail: row.contactEmail?.trim() || d.contactEmail,
    contactPhone: row.contactPhone?.trim() || d.contactPhone,
    address: row.address?.trim() || d.address,
    facebookUrl: row.facebookUrl?.trim() || "",
    instagramUrl: row.instagramUrl?.trim() || "",
    whatsappUrl: row.whatsappUrl?.trim() || "",
    mapEmbedUrl: row.mapEmbedUrl?.trim() || d.mapEmbedUrl,
    copyrightLine: row.copyrightLine?.trim() || null,
    logoUrl: row.logoUrl?.trim() || d.logoUrl,
  };
}

export function copyrightDisplayLine(sc: ScalarFields, year: number): string {
  if (sc.copyrightLine) return sc.copyrightLine;
  return `© ${year} ${sc.orgName}. Todos os direitos reservados.`;
}
