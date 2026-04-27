import { getPrisma } from "@/lib/prisma";

export async function listTenantsForUser(userId: string) {
  return getPrisma().tenantMember.findMany({
    where: { userId },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
}

export type TenantMembershipRow = Awaited<
  ReturnType<typeof listTenantsForUser>
>[number];

/** Lista memberships; tenant ativo = primeiro (criado primeiro) para o utilizador autenticado. */
export async function getTenantContext(userId: string) {
  const memberships = await listTenantsForUser(userId);
  if (memberships.length === 0) {
    return { memberships: [] as TenantMembershipRow[], active: null as null };
  }

  const active = memberships[0]!;
  return { memberships, active };
}
