import type { Metadata } from "next";
import { ProjetosPageView } from "@/components/site/ProjetosPageView";
import { getPublicSiteView } from "@/lib/institutional-site/public";
import { getMergedProjetos, getPublicProjetosManageCapability } from "@/lib/project-data";

/** Lista depende de Prisma; evita RSC/Full Route cache servir a mistura “estática” após criação. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const m = site.projetos.meta;
  return {
    title: m?.title ?? "Projetos",
    description: m?.description ?? "Conheça os projetos e iniciativas da A.R.L.S Enoch",
  };
}

export default async function ProjetosPage() {
  const [projetos, site, { canManage }] = await Promise.all([
    getMergedProjetos(),
    getPublicSiteView(),
    getPublicProjetosManageCapability(),
  ]);

  return <ProjetosPageView site={site} projetos={projetos} canManage={canManage} />;
}
