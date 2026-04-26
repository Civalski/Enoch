import { describe, expect, it } from "vitest";
import {
  DEFAULT_ABOUT_V1,
  DEFAULT_ESTUDOS_V1,
  DEFAULT_HOME_V1,
  DEFAULT_PROJETOS_V1,
} from "@/lib/institutional-site/defaults";
import {
  aboutContentEqualToDefault,
  contatoContentEqualToDefault,
  estudosContentEqualToDefault,
  homeContentEqualToDefault,
  projetosContentEqualToDefault,
  readAboutFromFormData,
  readContatoFromFormData,
  readEstudosFromFormData,
  readHomeFromFormData,
} from "./build-content-from-form";

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    f.set(k, v);
  }
  return f;
}

describe("readHomeFromFormData", () => {
  it("rebuilds home from keys present in the editor form", () => {
    const form = readHomeFromFormData(
      fd({
        home_meta_title: "Início",
        home_meta_description: "Desc",
        home_hero_title: "H",
        home_hero_subtitle: "S",
        home_quem_sectionTitle: "QS",
        home_quem_sectionSubtitle: "QSS",
        home_quem_missionHeading: "M",
        home_quem_missionImageUrl: "https://exemplo.com/missao.png",
        home_quem_p1: "a",
        home_quem_p2: "b",
        home_quem_ctaLabel: "c",
        home_proj_title: "P",
        home_proj_subtitle: "PS",
        home_proj_ctaLabel: "pc",
        home_proj_card0_title: "c0t",
        home_proj_card0_description: "c0d",
        home_proj_card0_image: "https://x/img",
        home_proj_card0_link: "/projetos",
        home_proj_card1_title: "",
        home_proj_card1_description: "",
        home_proj_card1_image: "",
        home_proj_card1_link: "",
        home_proj_card2_title: "",
        home_proj_card2_description: "",
        home_proj_card2_image: "",
        home_proj_card2_link: "",
        home_stat0_n: "1",
        home_stat0_label: "A",
        home_stat1_n: "2",
        home_stat1_label: "B",
        home_stat2_n: "3",
        home_stat2_label: "C",
        home_stat3_n: "4",
        home_stat3_label: "D",
        home_ajuda_title: "A",
        home_ajuda_subtitle: "AS",
        home_ajuda_ctaLabel: "ac",
        home_ajuda_col0_title: "C0",
        home_ajuda_col0_body: "B0",
        home_ajuda_col1_title: "C1",
        home_ajuda_col1_body: "B1",
        home_ajuda_col2_title: "C2",
        home_ajuda_col2_body: "B2",
        home_loc_title: "L",
        home_loc_subtitle: "LS",
      }),
    );
    expect(form.meta?.title).toBe("Início");
    expect(form.hero?.title).toBe("H");
    expect(form.quemSomos?.missionImageUrl).toBe("https://exemplo.com/missao.png");
    expect(form.projetosTeaser?.cards?.[0]?.link).toBe("/projetos");
    expect(form.stats?.items).toHaveLength(4);
  });
});

describe("default equality (for JSON null storage)", () => {
  it("default home is equal to DEFAULT_HOME_V1", () => {
    expect(homeContentEqualToDefault(structuredClone(DEFAULT_HOME_V1))).toBe(true);
  });

  it("touched meta title is not default", () => {
    const h = structuredClone(DEFAULT_HOME_V1);
    h.meta = { ...h.meta, title: "X" };
    expect(homeContentEqualToDefault(h)).toBe(false);
  });

  it("default about is equal to DEFAULT_ABOUT_V1", () => {
    expect(aboutContentEqualToDefault(structuredClone(DEFAULT_ABOUT_V1))).toBe(true);
  });

  it("default projetos is equal to DEFAULT_PROJETOS_V1", () => {
    expect(projetosContentEqualToDefault(structuredClone(DEFAULT_PROJETOS_V1))).toBe(true);
  });

  it("default estudos is equal to DEFAULT_ESTUDOS_V1", () => {
    expect(estudosContentEqualToDefault(structuredClone(DEFAULT_ESTUDOS_V1))).toBe(true);
  });
});

describe("readAboutFromFormData / readContatoFromFormData", () => {
  it("splits valores lines on newlines", () => {
    const a = readAboutFromFormData(
      fd({
        about_meta_title: "Sobre",
        about_meta_description: "D",
        about_hero_title: "H",
        about_hero_subtitle: "HS",
        about_hist_p1: "1",
        about_hist_p2: "2",
        about_hist_imageUrl: "https://exemplo.com/hist.png",
        about_mvv_missao: "m",
        about_mvv_visao: "v",
        about_mvv_valoresTitle: "V",
        about_mvv_valoresLines: "A\nB\nC",
        about_cta_title: "C",
        about_cta_p: "P",
        about_cta_primaryLabel: "P1",
        about_cta_secondaryLabel: "P2",
      }),
    );
    expect(a.mvv?.valoresLines).toEqual(["A", "B", "C"]);
    expect(a.historia?.imageUrl).toBe("https://exemplo.com/hist.png");
  });

  it("reads contato fields", () => {
    const c = readContatoFromFormData(
      fd({
        cont_meta_title: "Contato",
        cont_meta_description: "C",
        cont_hero_title: "T",
        cont_hero_subtitle: "S",
      }),
    );
    expect(contatoContentEqualToDefault(c)).toBe(false);
  });

  it("reads estudos page fields", () => {
    const e = readEstudosFromFormData(
      fd({
        estu_meta_title: "Estudos",
        estu_meta_description: "Meta",
        estu_page_title: "Título",
        estu_page_subtitle: "Sub",
      }),
    );
    expect(e.pageHeader?.title).toBe("Título");
    expect(estudosContentEqualToDefault(e)).toBe(false);
  });
});
