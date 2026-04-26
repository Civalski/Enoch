import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { prisma } from "@/lib/prisma";
import {
  mergeAboutContent,
  mergeBlogContent,
  mergeContatoContent,
  mergeEstudosContent,
  mergeHeaderNavItems,
  mergeHomeContent,
  mergeProjetosContent,
  mergeScalars,
} from "./merge";
import type { PublicSiteView } from "./types";

function buildViewFromRow(
  row: {
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
    homeContent: unknown;
    aboutContent: unknown;
    contatoContent: unknown;
    projetosContent: unknown;
    blogContent: unknown;
    estudosContent: unknown;
    headerNavLabels: unknown;
  } | null,
): PublicSiteView {
  return {
    scalars: mergeScalars(row),
    home: mergeHomeContent(row?.homeContent ?? null),
    about: mergeAboutContent(row?.aboutContent ?? null),
    contato: mergeContatoContent(row?.contatoContent ?? null),
    projetos: mergeProjetosContent(row?.projetosContent ?? null),
    blog: mergeBlogContent(row?.blogContent ?? null),
    estudos: mergeEstudosContent(row?.estudosContent ?? null),
    headerNav: mergeHeaderNavItems(row?.headerNavLabels ?? null),
    headerNavLabelsRaw: row?.headerNavLabels ?? null,
  };
}

/** Conteúdo institucional do site público (merge com defaults se não houver registo). */
export async function getPublicSiteView(): Promise<PublicSiteView> {
  const tenant = await resolvePublicBlogTenant();
  if (!tenant) {
    return buildViewFromRow(null);
  }
  const row = await prisma.institutionalSiteContent.findUnique({
    where: { tenantId: tenant.id },
  });
  return buildViewFromRow(row);
}

export const getPublicInstitutionalContent = getPublicSiteView;

/** Linha em bruto para o editor (parcial) + escalares em merge para formulário. */
export async function getInstitutionalContentForEditor(): Promise<{
  view: PublicSiteView;
  rawHome: unknown;
  rawAbout: unknown;
  rawContato: unknown;
  rawProjetos: unknown;
  rawBlog: unknown;
  rawHeaderNavLabels: unknown;
} | null> {
  const tenant = await resolvePublicBlogTenant();
  if (!tenant) return null;
  const row = await prisma.institutionalSiteContent.findUnique({
    where: { tenantId: tenant.id },
  });
  return {
    view: buildViewFromRow(row),
    rawHome: row?.homeContent ?? null,
    rawAbout: row?.aboutContent ?? null,
    rawContato: row?.contatoContent ?? null,
    rawProjetos: row?.projetosContent ?? null,
    rawBlog: row?.blogContent ?? null,
    rawHeaderNavLabels: row?.headerNavLabels ?? null,
  };
}
