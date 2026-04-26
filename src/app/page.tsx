import type { Metadata } from "next";
import { HomePagePublic } from "@/components/site/HomePagePublic";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getPublicSiteView } from "@/lib/institutional-site/public";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const m = site.home.meta;
  return {
    title: m?.title ?? "Início",
    description:
      m?.description ??
      "A.R.L.S Enoch - Transformando vidas através da solidariedade e ações sociais",
  };
}

export default async function HomePage() {
  const [site, caps] = await Promise.all([getPublicSiteView(), getSiteCapabilities()]);
  return <HomePagePublic site={site} canManage={caps.institutional} />;
}
