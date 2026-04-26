/** Tamanho máximo alinhado a `linkUrl` em `StudyResource` (VarChar 2000). */
export const STUDY_LINK_URL_MAX = 2000;

export function parseOptionalHttpUrl(
  raw: string,
):
  | { ok: true; value: string | null }
  | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") {
    return { ok: true, value: null };
  }
  if (t.length > STUDY_LINK_URL_MAX) {
    return {
      ok: false,
      error: `O endereço não pode exceder ${STUDY_LINK_URL_MAX} caracteres.`,
    };
  }
  let u: URL;
  try {
    u = new URL(t);
  } catch {
    return { ok: false, error: "Indique um endereço http ou https válido." };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "Apenas ligações http ou https são permitidas." };
  }
  return { ok: true, value: u.href };
}
