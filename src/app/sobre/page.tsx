import type { Metadata } from "next";
import { SobrePagePublic } from "@/components/site/SobrePagePublic";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getPublicAboutTeamMembers } from "@/lib/about-team-data";
import { getPublicSiteView } from "@/lib/institutional-site/public";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const m = site.about.meta;
  return {
    title: m?.title ?? "Sobre Nós",
    description: m?.description ?? "Conheça a história e os valores da A.R.L.S Enoch",
  };
}

export default async function SobrePage() {
  const [site, members, caps] = await Promise.all([
    getPublicSiteView(),
    getPublicAboutTeamMembers(),
    getSiteCapabilities(),
  ]);

  return <SobrePagePublic site={site} members={members} canManage={caps.about} />;
}
