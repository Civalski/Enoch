import type { SitePermission, TenantRole } from "@prisma/client";

export const ALL_SITE_PERMISSIONS: readonly SitePermission[] = [
  "BLOG",
  "TRANSPARENCY",
  "CONTACT_INBOX",
  "ABOUT",
  "PROJECTS",
  "INSTITUTIONAL",
] as const;

/**
 * OWNER e ADMIN ignoram a lista (acesso completo ao painel do site); MEMBER precisa da flag explícita.
 */
export function memberHasSitePermission(
  role: TenantRole,
  permissions: readonly SitePermission[] | null | undefined,
  required: SitePermission,
): boolean {
  if (role === "OWNER" || role === "ADMIN") {
    return true;
  }
  return (permissions ?? []).includes(required);
}

export type SiteCapabilities = {
  blog: boolean;
  transparency: boolean;
  contactInbox: boolean;
  about: boolean;
  projects: boolean;
  institutional: boolean;
  /** Alguma área de edição no site público. */
  canAccessAppBackoffice: boolean;
};

export function toSiteCapabilities(
  role: TenantRole,
  permissions: readonly SitePermission[] | null | undefined,
): SiteCapabilities {
  const p = (x: SitePermission) => memberHasSitePermission(role, permissions, x);
  const blog = p("BLOG");
  const transparency = p("TRANSPARENCY");
  const contactInbox = p("CONTACT_INBOX");
  const about = p("ABOUT");
  const projects = p("PROJECTS");
  const institutional = p("INSTITUTIONAL");
  const canAccessAppBackoffice =
    blog || transparency || contactInbox || about || projects || institutional;
  return {
    blog,
    transparency,
    contactInbox,
    about,
    projects,
    institutional,
    canAccessAppBackoffice,
  };
}
