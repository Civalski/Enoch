/** Gera slug único legível a partir do e-mail (não criptográfico). */
export function makeTenantSlug(email: string) {
  const local =
    email
      .split("@")[0]
      ?.replace(/[^a-z0-9-]/gi, "-")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32) || "org";
  return `${local}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
