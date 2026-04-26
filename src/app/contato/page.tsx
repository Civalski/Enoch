import type { Metadata } from "next";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getPublicSiteView } from "@/lib/institutional-site/public";
import { ContatoPublicSections } from "@/components/site/ContatoPublicSections";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const m = site.contato.meta;
  return {
    title: m?.title ?? "Contato",
    description:
      m?.description ?? "Entre em contato com a A.R.L.S Enoch e saiba como ajudar",
  };
}

export default async function ContatoPage() {
  const { institutional: canEditContatoCopy } = await getSiteCapabilities();
  return <ContatoPublicSections canEditContatoCopy={canEditContatoCopy} />;
}
