"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requirePublicInstitutionalWriter } from "@/lib/institutional-site/writer-auth";
import {
  aboutContentEqualToDefault,
  blogContentEqualToDefault,
  contatoContentEqualToDefault,
  estudosContentEqualToDefault,
  headerNavLabelsEqualToDefault,
  homeContentEqualToDefault,
  projetosContentEqualToDefault,
  readAboutFromFormData,
  readHomeFromFormData,
} from "./build-content-from-form";
import { DEFAULT_HEADER_NAV } from "@/lib/institutional-site/defaults";
import {
  HEADER_NAV_INBOX_DEFAULT_LABEL,
  HEADER_NAV_INBOX_HREF,
} from "@/lib/institutional-site/merge";
import { optionalHttpUrl } from "./form-parse";
import type { InstitutionalFormState } from "./form-state";
import type {
  AboutContentV1,
  BlogContentV1,
  ContatoContentV1,
  EstudosContentV1,
  HomeContentV1,
  ProjetosContentV1,
} from "@/lib/institutional-site/types";

/** Valores runtime (`JsonNull`); tipos usam `import type { Prisma }`. */
const PrismaJson = Prisma;

const MAX = {
  orgName: 200,
  footerTagline: 8000,
  email: 320,
  phone: 120,
  address: 8000,
  url: 2000,
  mapEmbed: 4000,
  copyright: 500,
  logo: 2000,
  headerTagline: 500,
} as const;

function trim(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export async function saveInstitutionalContentAction(
  _prev: InstitutionalFormState,
  formData: FormData,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();

    const footerTagline = trim(String(formData.get("footerTagline") ?? ""), MAX.footerTagline);
    const contactEmail = trim(String(formData.get("contactEmail") ?? ""), MAX.email);
    const contactPhone = trim(String(formData.get("contactPhone") ?? ""), MAX.phone);
    const address = trim(String(formData.get("address") ?? ""), MAX.address);
    const mapEmbedUrl = trim(String(formData.get("mapEmbedUrl") ?? ""), MAX.mapEmbed);
    const copyrightLine = String(formData.get("copyrightLine") ?? "").trim()
      ? trim(String(formData.get("copyrightLine") ?? ""), MAX.copyright)
      : null;

    const fb = optionalHttpUrl(String(formData.get("facebookUrl") ?? ""), MAX.url);
    if (!fb.ok) return { ok: false, message: `Facebook: ${fb.message}` };
    const ig = optionalHttpUrl(String(formData.get("instagramUrl") ?? ""), MAX.url);
    if (!ig.ok) return { ok: false, message: `Instagram: ${ig.message}` };
    const wa = optionalHttpUrl(String(formData.get("whatsappUrl") ?? ""), MAX.url);
    if (!wa.ok) return { ok: false, message: `WhatsApp: ${wa.message}` };

    if (mapEmbedUrl && mapEmbedUrl.length > MAX.mapEmbed) {
      return { ok: false, message: "URL do mapa é demasiado longo." };
    }

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        footerTagline: footerTagline || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        address: address || null,
        facebookUrl: fb.value,
        instagramUrl: ig.value,
        whatsappUrl: wa.value,
        mapEmbedUrl: mapEmbedUrl || null,
        copyrightLine,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
        blogContent: PrismaJson.JsonNull,
        estudosContent: PrismaJson.JsonNull,
        headerNavLabels: PrismaJson.JsonNull,
      },
      update: {
        footerTagline: footerTagline || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        address: address || null,
        facebookUrl: fb.value,
        instagramUrl: ig.value,
        whatsappUrl: wa.value,
        mapEmbedUrl: mapEmbedUrl || null,
        copyrightLine,
        // homeContent, aboutContent, projetosContent are NOT touched here —
        // they are managed by their own dedicated actions.
      },
    });

    revalidatePath("/");
    revalidatePath("/contato");
    return { ok: true, message: "Dados gerais guardados. O site público foi actualizado." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Nome, linha e URL do logótipo — edição no cabeçalho do site. */
export async function saveHeaderBrandingObjectAction(data: {
  orgName: string;
  headerTagline: string;
  logoUrl: string;
}): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const orgName = trim(data.orgName, MAX.orgName);
    const headerTagline = trim(data.headerTagline, MAX.headerTagline);
    const u = optionalHttpUrl(String(data.logoUrl ?? ""), MAX.logo);
    if (!u.ok) {
      return { ok: false, message: u.message };
    }
    const logoSt = u.value;
    const logoOut = logoSt && logoSt.length > 0 ? trim(logoSt, MAX.logo) : null;

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: orgName || null,
        headerTagline: headerTagline || null,
        logoUrl: logoOut,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
        blogContent: PrismaJson.JsonNull,
        estudosContent: PrismaJson.JsonNull,
        headerNavLabels: PrismaJson.JsonNull,
      },
      update: {
        orgName: orgName || null,
        headerTagline: headerTagline || null,
        logoUrl: logoOut,
      },
    });

    revalidatePath("/");
    revalidatePath("/sobre");
    return { ok: true, message: "Cabeçalho actualizado." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Conteúdo JSON da página pública /contato (hero, doações, PIX, banco, etc.). */
export async function saveContatoContentObjectAction(
  contatoData: ContatoContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const contatoJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = contatoContentEqualToDefault(
      contatoData,
    )
      ? PrismaJson.JsonNull
      : (contatoData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: contatoJson,
        projetosContent: PrismaJson.JsonNull,
        blogContent: PrismaJson.JsonNull,
        estudosContent: PrismaJson.JsonNull,
        headerNavLabels: PrismaJson.JsonNull,
      },
      update: { contatoContent: contatoJson },
    });

    revalidatePath("/contato");
    return { ok: true, message: "Página de contato actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function saveEstudosContentObjectAction(
  estudosData: EstudosContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const estudosJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = estudosContentEqualToDefault(
      estudosData,
    )
      ? PrismaJson.JsonNull
      : (estudosData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
        blogContent: PrismaJson.JsonNull,
        estudosContent: estudosJson,
        headerNavLabels: PrismaJson.JsonNull,
      },
      update: { estudosContent: estudosJson },
    });

    revalidatePath("/estudos");
    return { ok: true, message: "Página de estudos actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Rótulos do menu — editados no cabeçalho do site, não no formulário da engrenagem. */
export async function saveHeaderNavLabelsObjectAction(
  labelsByHref: Record<string, string>,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const overrides: Record<string, string> = {};
    for (const item of DEFAULT_HEADER_NAV) {
      const raw = labelsByHref[item.href];
      const v = typeof raw === "string" ? raw.trim() : "";
      if (v && v !== item.label) {
        overrides[item.href] = v.slice(0, 80);
      }
    }
    const inboxRaw = labelsByHref[HEADER_NAV_INBOX_HREF];
    const inboxV = typeof inboxRaw === "string" ? inboxRaw.trim() : "";
    if (inboxV && inboxV !== HEADER_NAV_INBOX_DEFAULT_LABEL) {
      overrides[HEADER_NAV_INBOX_HREF] = inboxV.slice(0, 80);
    }
    const headerNavJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = headerNavLabelsEqualToDefault(
      overrides,
    )
      ? PrismaJson.JsonNull
      : (overrides as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
        blogContent: PrismaJson.JsonNull,
        headerNavLabels: headerNavJson,
      },
      update: { headerNavLabels: headerNavJson },
    });

    revalidatePath("/");
    revalidatePath("/estudos");
    return { ok: true, message: "Nomes do menu actualizados." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function saveHomePageContentAction(
  _prev: InstitutionalFormState,
  formData: FormData,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const homeData = readHomeFromFormData(formData);
    const homeJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = homeContentEqualToDefault(
      homeData,
    )
      ? PrismaJson.JsonNull
      : (homeData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: homeJson,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
      },
      update: { homeContent: homeJson },
    });

    revalidatePath("/");
    return { ok: true, message: "Página inicial actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Usado por edição inline (objecto) na página pública. */
export async function saveHomeContentObjectAction(
  homeData: HomeContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const homeJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = homeContentEqualToDefault(
      homeData,
    )
      ? PrismaJson.JsonNull
      : (homeData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: homeJson,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
      },
      update: { homeContent: homeJson },
    });

    revalidatePath("/");
    return { ok: true, message: "Página inicial actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Edição inline na página pública /blog. */
export async function saveBlogContentObjectAction(
  blogData: BlogContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const blogJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = blogContentEqualToDefault(
      blogData,
    )
      ? PrismaJson.JsonNull
      : (blogData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
        blogContent: blogJson,
        headerNavLabels: PrismaJson.JsonNull,
      },
      update: { blogContent: blogJson },
    });

    revalidatePath("/blog");
    return { ok: true, message: "Página do blog actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function saveAboutPageContentAction(
  _prev: InstitutionalFormState,
  formData: FormData,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const aboutData = readAboutFromFormData(formData);
    const aboutJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = aboutContentEqualToDefault(
      aboutData,
    )
      ? PrismaJson.JsonNull
      : (aboutData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: aboutJson,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
      },
      update: { aboutContent: aboutJson },
    });

    revalidatePath("/sobre");
    return { ok: true, message: "Página Sobre actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Usado por edição inline (objecto) na página pública. */
export async function saveAboutContentObjectAction(
  aboutData: AboutContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const aboutJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = aboutContentEqualToDefault(
      aboutData,
    )
      ? PrismaJson.JsonNull
      : (aboutData as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: aboutJson,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: PrismaJson.JsonNull,
      },
      update: { aboutContent: aboutJson },
    });

    revalidatePath("/sobre");
    return { ok: true, message: "Página Sobre actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

/** Usado por edição inline (objecto) na página pública /projetos. */
export async function saveProjetosContentObjectAction(
  data: ProjetosContentV1,
): Promise<InstitutionalFormState> {
  try {
    const { tenantId } = await requirePublicInstitutionalWriter();
    const projetosJson: Prisma.InputJsonValue | typeof PrismaJson.JsonNull = projetosContentEqualToDefault(
      data,
    )
      ? PrismaJson.JsonNull
      : (data as unknown as Prisma.InputJsonValue);

    await getPrisma().institutionalSiteContent.upsert({
      where: { tenantId },
      create: {
        tenantId,
        orgName: null,
        footerTagline: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappUrl: null,
        mapEmbedUrl: null,
        copyrightLine: null,
        logoUrl: null,
        homeContent: PrismaJson.JsonNull,
        aboutContent: PrismaJson.JsonNull,
        contatoContent: PrismaJson.JsonNull,
        projetosContent: projetosJson,
      },
      update: { projetosContent: projetosJson },
    });

    revalidatePath("/projetos");
    return { ok: true, message: "Página Projetos actualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}
