import { prisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";

export type PublicAboutTeamMember = {
  id: string;
  name: string;
  roleTitle: string;
  imageUrl: string;
};

export async function getPublicAboutTeamMembers(): Promise<PublicAboutTeamMember[]> {
  const t = await resolvePublicBlogTenant();
  if (!t) {
    return [];
  }
  const rows = await prisma.aboutTeamMember.findMany({
    where: { tenantId: t.id },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
    select: { id: true, name: true, roleTitle: true, imageUrl: true },
  });
  return rows;
}
