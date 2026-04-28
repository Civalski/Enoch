import { requireSitePermissionFast } from "@/lib/permissions/site-permissions";

/**
 * Editar conteúdo institucional (JSON) no tenant público (ex.: hidden slugs que dependem de `InstitutionalSiteContent`).
 * Para recursos gerais do site, preferir a permissão adequada; aqui: INSTITUTIONAL.
 *
 * Usa `requireSitePermissionFast` (sem ensureUserProvisioning) — 2 queries em vez de 6.
 */
export async function requirePublicInstitutionalWriter(): Promise<{ tenantId: string }> {
  const ctx = await requireSitePermissionFast("INSTITUTIONAL");
  return { tenantId: ctx.tenantId };
}
