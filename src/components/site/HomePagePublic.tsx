import { HomePageView } from "@/components/site/HomePageView";
import type { PublicSiteView } from "@/lib/institutional-site/types";

type Props = { site: PublicSiteView; canManage?: boolean };

export function HomePagePublic({ site, canManage = false }: Props) {
  return <HomePageView site={site} canManage={canManage} />;
}
