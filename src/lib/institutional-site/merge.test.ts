import { describe, expect, it } from "vitest";
import {
  DEFAULT_ABOUT_V1,
  DEFAULT_ESTUDOS_V1,
  DEFAULT_HEADER_NAV,
  DEFAULT_HOME_V1,
  DEFAULT_SCALARS,
} from "./defaults";
import {
  copyrightDisplayLine,
  HEADER_NAV_INBOX_DEFAULT_LABEL,
  HEADER_NAV_INBOX_HREF,
  mergeAboutContent,
  mergeBlogContent,
  mergeEstudosContent,
  mergeHeaderNavItems,
  mergeHomeContent,
  mergeScalars,
  withContactInboxNavItem,
} from "./merge";

describe("mergeScalars", () => {
  it("uses code defaults when row is null", () => {
    const s = mergeScalars(null);
    expect(s.orgName).toBe(DEFAULT_SCALARS.orgName);
    expect(s.contactEmail).toBe(DEFAULT_SCALARS.contactEmail);
  });

  it("overrides from row", () => {
    const s = mergeScalars({
      orgName: "X",
      headerTagline: null,
      footerTagline: null,
      contactEmail: "a@b.co",
      contactPhone: null,
      address: null,
      facebookUrl: null,
      instagramUrl: null,
      whatsappUrl: null,
      mapEmbedUrl: null,
      copyrightLine: null,
      logoUrl: null,
    });
    expect(s.orgName).toBe("X");
    expect(s.contactEmail).toBe("a@b.co");
  });
});

describe("mergeAboutContent", () => {
  it("falls back to default hero title when patch is blank", () => {
    const a = mergeAboutContent({ hero: { title: "   " } });
    expect(a.hero?.title).toBe(DEFAULT_ABOUT_V1.hero?.title);
  });

  it("merges historia image url", () => {
    const a = mergeAboutContent({
      historia: { imageUrl: "https://exemplo.com/foto.jpg" },
    });
    expect(a.historia?.imageUrl).toBe("https://exemplo.com/foto.jpg");
  });
});

describe("mergeHomeContent", () => {
  it("returns defaults for null patch", () => {
    const h = mergeHomeContent(null);
    expect(h.hero?.title).toBe(DEFAULT_HOME_V1.hero?.title);
  });

  it("merges partial hero", () => {
    const h = mergeHomeContent({ hero: { title: "T" } });
    expect(h.hero?.title).toBe("T");
    expect(h.hero?.subtitle).toBe(DEFAULT_HOME_V1.hero?.subtitle);
  });

  it("merges mission image url in quemSomos", () => {
    const h = mergeHomeContent({
      quemSomos: { missionImageUrl: "https://x/y.jpg" },
    });
    expect(h.quemSomos?.missionImageUrl).toBe("https://x/y.jpg");
  });
});

describe("mergeHeaderNavItems", () => {
  it("uses defaults when patch is null", () => {
    const n = mergeHeaderNavItems(null);
    expect(n.map((x) => x.label)).toEqual(DEFAULT_HEADER_NAV.map((x) => x.label));
  });

  it("applies label override by href", () => {
    const n = mergeHeaderNavItems({ "/blog": "Notícias" });
    const blog = n.find((x) => x.href === "/blog");
    expect(blog?.label).toBe("Notícias");
  });
});

describe("withContactInboxNavItem", () => {
  it("leaves list unchanged when include is false", () => {
    const base = mergeHeaderNavItems(null);
    expect(withContactInboxNavItem(base, false, null)).toBe(base);
  });

  it("inserts inbox link after Contato", () => {
    const base = mergeHeaderNavItems(null);
    const n = withContactInboxNavItem(base, true, null);
    const iContato = n.findIndex((x) => x.href === "/contato");
    expect(n[iContato + 1]?.href).toBe(HEADER_NAV_INBOX_HREF);
    expect(n[iContato + 1]?.label).toBe(HEADER_NAV_INBOX_DEFAULT_LABEL);
  });

  it("applies inbox label override from JSON", () => {
    const base = mergeHeaderNavItems(null);
    const n = withContactInboxNavItem(base, true, { [HEADER_NAV_INBOX_HREF]: "Correio" });
    expect(n.find((x) => x.href === HEADER_NAV_INBOX_HREF)?.label).toBe("Correio");
  });
});

describe("mergeBlogContent", () => {
  it("merges hero title", () => {
    const b = mergeBlogContent({ hero: { title: "Notícias" } });
    expect(b.hero?.title).toBe("Notícias");
  });
});

describe("mergeEstudosContent", () => {
  it("uses defaults when patch is null", () => {
    const e = mergeEstudosContent(null);
    expect(e.pageHeader?.title).toBe(DEFAULT_ESTUDOS_V1.pageHeader?.title);
  });

  it("merges page header", () => {
    const e = mergeEstudosContent({ pageHeader: { title: "Materiais", subtitle: "Desc" } });
    expect(e.pageHeader?.title).toBe("Materiais");
    expect(e.pageHeader?.subtitle).toBe("Desc");
  });
});

describe("copyrightDisplayLine", () => {
  it("uses custom line when set", () => {
    const s = mergeScalars(null);
    const line = copyrightDisplayLine({ ...s, copyrightLine: "Custom" }, 2026);
    expect(line).toBe("Custom");
  });

  it("generates when copyright null", () => {
    const s = mergeScalars(null);
    const line = copyrightDisplayLine(s, 2026);
    expect(line).toContain("2026");
    expect(line).toContain(s.orgName);
  });
});
