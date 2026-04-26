const DEFAULT = "/blog";

/** Only same-site relative paths; blocks open redirects. */
export function safeNextPath(raw: string | null): string {
  if (raw == null || raw === "") return DEFAULT;
  if (!raw.startsWith("/") || raw.startsWith("//")) return DEFAULT;
  if (raw.includes("\\") || raw.includes("://")) return DEFAULT;
  return raw;
}
