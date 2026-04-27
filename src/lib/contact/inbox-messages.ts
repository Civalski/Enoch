import { getPrisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";

export type InboxMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export async function getInstitutionalContactInboxMessages(): Promise<InboxMessageRow[]> {
  const tenant = await resolvePublicBlogTenant();
  if (!tenant) {
    return [];
  }

  const raw = await getPrisma().contactMessage.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      body: true,
      readAt: true,
      createdAt: true,
    },
  });

  return raw.map((m) => ({
    ...m,
    readAt: m.readAt ? m.readAt.toISOString() : null,
    createdAt: m.createdAt.toISOString(),
  }));
}
