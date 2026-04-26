import {
  isStudyResourceKind,
  type StudyResourceKind,
  STUDY_KIND_ORDER,
  STUDY_SECTION_LABEL,
} from "@/lib/study-kinds-constants";

export { STUDY_KIND_ORDER, STUDY_SECTION_LABEL };
export type { StudyResourceKind } from "@/lib/study-kinds-constants";

export type PublicStudyItem = {
  id: string;
  kind: StudyResourceKind;
  title: string;
  description: string | null;
  linkUrl: string | null;
  displayOrder: number;
};

export type GroupedStudyResources = Record<StudyResourceKind, PublicStudyItem[]>;

export const STUDY_PAGE_SIZE = 10;

export type StudyResourcesPageResult = {
  items: PublicStudyItem[];
  /** Total de itens com o filtro actual (categoria se aplicável). */
  totalCount: number;
  /** Total de itens do tenant (ignora filtro de categoria); usado em mensagens vazias. */
  totalInTenant: number;
  page: number;
  pageSize: number;
};

export function parseEstudosPageQuery(raw: string | string[] | undefined): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(String(s ?? "1"), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function parseEstudosKindQuery(raw: string | string[] | undefined): StudyResourceKind | undefined {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s || typeof s !== "string") return undefined;
  const t = s.trim();
  return isStudyResourceKind(t) ? t : undefined;
}

/** Query string canónica para /estudos (omite `page=1` quando possível). */
export function buildEstudosListUrl(opts: { kind?: StudyResourceKind; page?: number }): string {
  const p = Math.max(1, opts.page ?? 1);
  const params = new URLSearchParams();
  if (opts.kind) params.set("kind", opts.kind);
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return qs ? `/estudos?${qs}` : "/estudos";
}
