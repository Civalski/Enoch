import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EstudosPageView } from "@/components/site/EstudosPageView";
import {
  buildEstudosListUrl,
  getPublicEstudosManageCapability,
  getStudyResourcesPage,
  parseEstudosKindQuery,
  parseEstudosPageQuery,
} from "@/lib/study-data";
import { getPublicSiteView } from "@/lib/institutional-site/public";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const m = site.estudos.meta;
  const description = m?.description?.trim();
  return {
    title: m?.title ?? "Estudos",
    ...(description ? { description } : {}),
  };
}

type SearchParams = Promise<{ page?: string; kind?: string }>;

export default async function EstudosPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filterKind = parseEstudosKindQuery(sp.kind);
  const requestedPage = parseEstudosPageQuery(sp.page);
  const [result, { canManage }, site, caps] = await Promise.all([
    getStudyResourcesPage({ kind: filterKind, page: requestedPage }),
    getPublicEstudosManageCapability(),
    getPublicSiteView(),
    getSiteCapabilities(),
  ]);
  if (sp.page !== undefined && String(requestedPage) !== String(result.page)) {
    redirect(buildEstudosListUrl({ kind: filterKind, page: result.page }));
  }

  return (
    <EstudosPageView
      result={result}
      filterKind={filterKind}
      canManage={canManage}
      canEditPageCopy={caps.institutional}
      initialEstudos={site.estudos}
    />
  );
}
