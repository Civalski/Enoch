import { SobrePageView } from "@/components/site/SobrePageView";
import type { PublicAboutTeamMember } from "@/lib/about-team-data";
import type { PublicSiteView } from "@/lib/institutional-site/types";

type Props = {
  site: PublicSiteView;
  members: PublicAboutTeamMember[];
  canManage: boolean;
};

export function SobrePagePublic({ site, members, canManage }: Props) {
  return <SobrePageView site={site} members={members} canManage={canManage} />;
}
