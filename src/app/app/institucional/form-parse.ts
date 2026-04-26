/**
 * Partilhado entre testes e actions — validação de URL e JSON de formulário.
 */
export function optionalHttpUrl(
  raw: string,
  maxUrl: number,
): { ok: true; value: string | null } | { ok: false; message: string } {
  const t = raw.trim();
  if (!t) return { ok: true, value: null };
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, message: "Use um URL que comece por http:// ou https://" };
    }
    return { ok: true, value: t.slice(0, maxUrl) };
  } catch {
    return { ok: false, message: "URL inválido." };
  }
}

export function parseJsonObject(
  text: string,
  label: string,
): { ok: true; value: Record<string, unknown> } | { ok: false; message: string } {
  const t = text.trim();
  if (!t) {
    return { ok: true, value: {} };
  }
  try {
    const v: unknown = JSON.parse(t);
    if (v === null || typeof v !== "object" || Array.isArray(v)) {
      return { ok: false, message: `${label} tem de ser um objecto JSON (não uma lista).` };
    }
    return { ok: true, value: v as Record<string, unknown> };
  } catch {
    return { ok: false, message: `${label}: JSON inválido.` };
  }
}
