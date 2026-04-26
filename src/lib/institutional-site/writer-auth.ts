import { requireSitePermission } from "@/lib/permissions/site-permissions";

/**
 * Editar conteúdo institucional (JSON) no tenant público (ex.: hidden slugs que dependem de `InstitutionalSiteContent`).
 * Para recursos gerais do site, preferir a permissão adequada; aqui: INSTITUTIONAL.
 */
export async function requirePublicInstitutionalWriter(): Promise<{ tenantId: string }> {
  const ctx = await requireSitePermission("INSTITUTIONAL");
  return { tenantId: ctx.tenantId };
}
