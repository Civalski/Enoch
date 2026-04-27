import { getServerUser, requireServerUser } from "@/lib/auth/server";
import { isMasterUser } from "@/lib/auth/admin-master";
import { isPublicVisitorPreviewSession } from "@/lib/permissions/visitor-preview";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { listTenantsForUser, type TenantMembershipRow } from "@/lib/tenant/active-tenant";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import type { SitePermission, TenantRole } from "@prisma/client";
import {
  toSiteCapabilities,
  memberHasSitePermission,
  type SiteCapabilities,
} from "./site-permission-logic";
export type { SiteCapabilities } from "./site-permission-logic";
export { ALL_SITE_PERMISSIONS, memberHasSitePermission, toSiteCapabilities } from "./site-permission-logic";

/**
 * Membro do tenant público do site (blog/institucional), se existir.
 */
export async function getPublicSiteMembership(
  userId: string,
): Promise<TenantMembershipRow | null> {
  const [memberships, publicT] = await Promise.all([
    listTenantsForUser(userId),
    resolvePublicBlogTenant(),
  ]);
  if (!publicT || memberships.length === 0) {
    return null;
  }
  return memberships.find((m) => m.tenantId === publicT.id) ?? null;
}

export async function getSiteCapabilities(): Promise<SiteCapabilities> {
  if (await isPublicVisitorPreviewSession()) {
    return emptyCapabilities();
  }
  const user = await getServerUser();
  if (!user) {
    return emptyCapabilities();
  }
  const email = user.email?.trim();
  if (!email) {
    return emptyCapabilities();
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    return emptyCapabilities();
  }
  return toSiteCapabilities(m.role, m.permissions);
}

function emptyCapabilities(): SiteCapabilities {
  return {
    blog: false,
    transparency: false,
    contactInbox: false,
    about: false,
    projects: false,
    institutional: false,
    canAccessAppBackoffice: false,
  };
}

export async function getPublicBlogManageCapability(): Promise<{ canManage: boolean }> {
  if (await isPublicVisitorPreviewSession()) {
    return { canManage: false };
  }
  const user = await getServerUser();
  if (!user) {
    return { canManage: false };
  }
  const email = user.email?.trim();
  if (!email) {
    return { canManage: false };
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    return { canManage: false };
  }
  return { canManage: memberHasSitePermission(m.role, m.permissions, "BLOG") };
}

/**
 * Sessão autenticada com membership no site público; usado em actions que exigem tenantId.
 */
export type PublicSiteWriterContext = {
  tenantId: string;
  userId: string;
  role: TenantRole;
  permissions: SitePermission[];
};

export async function requirePublicSiteContext(): Promise<PublicSiteWriterContext> {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    throw new Error("Sessão inválida.");
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    throw new Error("Organização não encontrada.");
  }
  return {
    tenantId: m.tenantId,
    userId: user.id,
    role: m.role,
    permissions: [...m.permissions],
  };
}

export async function requireSitePermission(permission: SitePermission): Promise<PublicSiteWriterContext> {
  const ctx = await requirePublicSiteContext();
  if (!memberHasSitePermission(ctx.role, ctx.permissions, permission)) {
    throw new Error("Não autorizado.");
  }
  return ctx;
}

/**
 * Necessário para uploads partilhados (blog, sobre, projetos) sem duplicar rotas.
 */
export async function requireAnySitePermission(
  oneOf: readonly SitePermission[],
): Promise<PublicSiteWriterContext> {
  const ctx = await requirePublicSiteContext();
  if (oneOf.some((p) => memberHasSitePermission(ctx.role, ctx.permissions, p))) {
    return ctx;
  }
  throw new Error("Não autorizado.");
}

/**
 * Pode gerir contas e permissões (UI + páginas /app/usuarios).
 * Apenas o administrador principal do painel (login simples: `ADMIN_LOGIN` / `SIMPLE_AUTH_USER_ID`).
 */
export async function getCanManagePublicSiteMembers(): Promise<boolean> {
  const user = await getServerUser();
  if (!user || !isMasterUser(user)) {
    return false;
  }
  const email = user.email?.trim();
  if (!email) {
    return false;
  }
  try {
    await ensureUserProvisioning(user.id, email);
  } catch {
    return false;
  }
  const m = await getPublicSiteMembership(user.id);
  return m != null;
}

/**
 * Convites e alterações em /app/usuarios: só o administrador principal (conta de painel), não outros OWNER/ADMIN.
 */
export async function requirePublicSiteMembersManager(): Promise<{
  tenantId: string;
  userId: string;
  publicBlogTenantId: string;
}> {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    throw new Error("Sessão inválida.");
  }
  await ensureUserProvisioning(user.id, email);
  if (!isMasterUser(user)) {
    throw new Error("Apenas o administrador principal (conta de painel) pode aceder a esta função.");
  }
  const publicT = await resolvePublicBlogTenant();
  if (!publicT) {
    throw new Error("Site público não configurado.");
  }
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    throw new Error("Sem associação ao site público.");
  }
  return { tenantId: publicT.id, userId: user.id, publicBlogTenantId: publicT.id };
}
