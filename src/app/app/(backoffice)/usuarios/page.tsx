import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getCanManagePublicSiteMembers, requirePublicSiteMembersManager } from "@/lib/permissions/site-permissions";
import { prisma } from "@/lib/prisma";
import { isMasterPanelTenantUserId } from "@/lib/auth/admin-master";
import { UsuariosManager } from "@/components/app/usuarios/UsuariosManager";

export const metadata: Metadata = {
  title: "Usuários",
  robots: { index: false, follow: false },
};

const ROLE_ORDER: Record<string, number> = { OWNER: 0, ADMIN: 1, MEMBER: 2 };

export default async function UsuariosPage() {
  const allowed = await getCanManagePublicSiteMembers();
  if (!allowed) {
    redirect("/app");
  }

  const user = await getServerUser();
  if (!user) {
    redirect("/admpainel");
  }
  const email = user.email?.trim();
  if (!email) {
    redirect("/admpainel");
  }
  await ensureUserProvisioning(user.id, email);

  const { tenantId } = await requirePublicSiteMembersManager();

  const raw = await prisma.tenantMember.findMany({
    where: { tenantId },
    include: {
      user: {
        select: {
          email: true,
          fullName: true,
          contactEmail: true,
          phone: true,
          address: true,
          cpf: true,
          rg: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const members = [...raw].sort((a, b) => {
    const d = ROLE_ORDER[a.role]! - ROLE_ORDER[b.role]!;
    return d !== 0 ? d : a.createdAt.getTime() - b.createdAt.getTime();
  });

  const rows = members
    .filter((m) => !isMasterPanelTenantUserId(m.userId))
    .map((m) => ({
      id: m.id,
      userId: m.userId,
      email: m.user.email,
      fullName: m.user.fullName,
      contactEmail: m.user.contactEmail,
      phone: m.user.phone,
      address: m.user.address,
      cpf: m.user.cpf,
      rg: m.user.rg,
      description: m.user.description,
      role: m.role,
      permissions: [...m.permissions],
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Usuários e permissões</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Quem pode aceder ao painel e editar o site público. Esta página só está disponível para o administrador
          principal (login de painel).
        </p>
      </div>
      <UsuariosManager members={rows} actorUserId={user.id} />
    </div>
  );
}
