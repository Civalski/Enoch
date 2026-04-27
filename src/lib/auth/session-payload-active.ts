import { getAdminLoginNormalized } from "@/lib/auth/admin-master";
import { normalizeLogin } from "@/lib/auth/login-identity";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { getPrisma } from "@/lib/prisma";

/**
 * Sessão HMAC ainda presente, mas o painel deixa de a aceitar (ex.: membro removido,
 * ou ADMIN_LOGIN alterado com sessão antiga de conta principal).
 */
export async function isSessionPayloadActive(v: { login: string; userId?: string }): Promise<boolean> {
  if (!v.userId) {
    return normalizeLogin(v.login) === getAdminLoginNormalized();
  }
  const tenant = await resolvePublicBlogTenant();
  if (!tenant) {
    return false;
  }
  const m = await getPrisma().tenantMember.findFirst({
    where: { userId: v.userId, tenantId: tenant.id },
    select: { id: true },
  });
  return m != null;
}
