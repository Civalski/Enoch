import {
  DEFAULT_ABOUT_V1,
  DEFAULT_BLOG_V1,
  DEFAULT_CONTATO_V1,
  DEFAULT_ESTUDOS_V1,
  DEFAULT_HEADER_NAV,
  DEFAULT_HOME_V1,
  DEFAULT_PROJETOS_V1,
} from "@/lib/institutional-site/defaults";
import type {
  AboutContentV1,
  BlogContentV1,
  ContatoContentV1,
  EstudosContentV1,
  HomeContentV1,
  ProjetosContentV1,
} from "@/lib/institutional-site/types";

const M = {
  title: 500,
  metaTitle: 200,
  metaDesc: 500,
  body: 12000,
  line: 500,
  url: 2000,
} as const;

function t(s: string, max: number): string {
  return s.trim().slice(0, max);
}

function get(fd: FormData, key: string, max: number): string {
  return t(String(fd.get(key) ?? ""), max);
}

function linesFromBlock(raw: string, maxLines: number, maxLineLen: number): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => t(line, maxLineLen))
    .filter((line) => line.length > 0)
    .slice(0, maxLines);
}

export function homeContentEqualToDefault(a: HomeContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_HOME_V1);
}

export function aboutContentEqualToDefault(a: AboutContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_ABOUT_V1);
}

export function contatoContentEqualToDefault(a: ContatoContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_CONTATO_V1);
}

export function projetosContentEqualToDefault(a: ProjetosContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_PROJETOS_V1);
}

export function blogContentEqualToDefault(a: BlogContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_BLOG_V1);
}

export function estudosContentEqualToDefault(a: EstudosContentV1): boolean {
  return contentDeepEqual(a, DEFAULT_ESTUDOS_V1);
}

/** Só grava diferenças; objeto vazio = igual ao default em código. */
export function headerNavLabelsEqualToDefault(overrides: Record<string, string>): boolean {
  return Object.keys(overrides).length === 0;
}

function contentDeepEqual(x: unknown, y: unknown): boolean {
  if (Object.is(x, y)) return true;
  if (typeof x !== "object" || x === null || typeof y !== "object" || y === null) {
    return x === y;
  }
  if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) return false;
    return x.every((v, i) => contentDeepEqual(v, y[i]));
  }
  if (Array.isArray(x) || Array.isArray(y)) return false;
  const xk = Object.keys(x as object).sort();
  const yk = Object.keys(y as object).sort();
  if (xk.length !== yk.length) return false;
  for (let i = 0; i < xk.length; i++) {
    if (xk[i] !== yk[i]) return false;
    if (
      !contentDeepEqual(
        (x as Record<string, unknown>)[xk[i]!]!,
        (y as Record<string, unknown>)[xk[i]!]!,
      )
    ) {
      return false;
    }
  }
  return true;
}

export function readHomeFromFormData(fd: FormData): HomeContentV1 {
  const cards = [0, 1, 2].map((i) => ({
    title: get(fd, `home_proj_card${i}_title`, M.title),
    description: get(fd, `home_proj_card${i}_description`, M.body),
    image: get(fd, `home_proj_card${i}_image`, M.url),
    link: get(fd, `home_proj_card${i}_link`, M.url),
  })) as [
    { title: string; description: string; image: string; link: string },
    { title: string; description: string; image: string; link: string },
    { title: string; description: string; image: string; link: string },
  ];

  const items = [0, 1, 2, 3].map((i) => ({
    n: get(fd, `home_stat${i}_n`, 40),
    label: get(fd, `home_stat${i}_label`, M.title),
  }));

  const cols = [0, 1, 2].map((i) => ({
    title: get(fd, `home_ajuda_col${i}_title`, M.title),
    body: get(fd, `home_ajuda_col${i}_body`, M.body),
  })) as [
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
  ];

  return {
    meta: {
      title: get(fd, "home_meta_title", M.metaTitle),
      description: get(fd, "home_meta_description", M.metaDesc),
    },
    hero: {
      title: get(fd, "home_hero_title", M.title),
      subtitle: get(fd, "home_hero_subtitle", M.body),
    },
    quemSomos: {
      sectionTitle: get(fd, "home_quem_sectionTitle", M.title),
      sectionSubtitle: get(fd, "home_quem_sectionSubtitle", M.body),
      missionHeading: get(fd, "home_quem_missionHeading", M.title),
      missionImageUrl: get(fd, "home_quem_missionImageUrl", M.url),
      p1: get(fd, "home_quem_p1", M.body),
      p2: get(fd, "home_quem_p2", M.body),
      ctaLabel: get(fd, "home_quem_ctaLabel", M.line),
    },
    projetosTeaser: {
      title: get(fd, "home_proj_title", M.title),
      subtitle: get(fd, "home_proj_subtitle", M.body),
      ctaLabel: get(fd, "home_proj_ctaLabel", M.line),
      cards,
    },
    stats: { items },
    comoAjudar: {
      title: get(fd, "home_ajuda_title", M.title),
      subtitle: get(fd, "home_ajuda_subtitle", M.body),
      ctaLabel: get(fd, "home_ajuda_ctaLabel", M.line),
      cols,
    },
    localizacao: {
      title: get(fd, "home_loc_title", M.title),
      subtitle: get(fd, "home_loc_subtitle", M.body),
    },
  };
}

export function readAboutFromFormData(fd: FormData): AboutContentV1 {
  const valoresLines = linesFromBlock(
    String(fd.get("about_mvv_valoresLines") ?? ""),
    30,
    300,
  );
  return {
    meta: {
      title: get(fd, "about_meta_title", M.metaTitle),
      description: get(fd, "about_meta_description", M.metaDesc),
    },
    hero: {
      title: get(fd, "about_hero_title", M.title),
      subtitle: get(fd, "about_hero_subtitle", M.body),
    },
    historia: {
      p1: get(fd, "about_hist_p1", M.body),
      p2: get(fd, "about_hist_p2", M.body),
      imageUrl: get(fd, "about_hist_imageUrl", M.url),
    },
    mvv: {
      missao: get(fd, "about_mvv_missao", M.body),
      visao: get(fd, "about_mvv_visao", M.body),
      valoresTitle: get(fd, "about_mvv_valoresTitle", M.title),
      valoresLines,
    },
    cta: {
      title: get(fd, "about_cta_title", M.title),
      p: get(fd, "about_cta_p", M.body),
      primaryLabel: get(fd, "about_cta_primaryLabel", M.line),
      secondaryLabel: get(fd, "about_cta_secondaryLabel", M.line),
    },
  };
}

export function readContatoFromFormData(fd: FormData): ContatoContentV1 {
  return {
    meta: {
      title: get(fd, "cont_meta_title", M.metaTitle),
      description: get(fd, "cont_meta_description", M.metaDesc),
    },
    hero: {
      title: get(fd, "cont_hero_title", M.title),
      subtitle: get(fd, "cont_hero_subtitle", M.body),
    },
  };
}

export function readBlogFromFormData(fd: FormData): BlogContentV1 {
  return {
    meta: {
      title: get(fd, "blog_meta_title", M.metaTitle),
      description: get(fd, "blog_meta_description", M.metaDesc),
    },
    hero: {
      title: get(fd, "blog_hero_title", M.title),
      subtitle: get(fd, "blog_hero_subtitle", M.body),
    },
    listSection: {
      title: get(fd, "blog_list_title", M.title),
      subtitle: get(fd, "blog_list_subtitle", M.body),
    },
  };
}

export function readEstudosFromFormData(fd: FormData): EstudosContentV1 {
  return {
    meta: {
      title: get(fd, "estu_meta_title", M.metaTitle),
      description: get(fd, "estu_meta_description", M.metaDesc),
    },
    pageHeader: {
      title: get(fd, "estu_page_title", M.title),
      subtitle: get(fd, "estu_page_subtitle", M.body),
    },
  };
}

export function readHeaderNavLabelsFromFormData(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  DEFAULT_HEADER_NAV.forEach((item, i) => {
    const v = get(fd, `header_nav_${i}_label`, 80);
    if (v && v !== item.label) {
      out[item.href] = v;
    }
  });
  return out;
}
