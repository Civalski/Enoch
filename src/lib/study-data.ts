import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { getPrisma } from "@/lib/prisma";
import { emptyStudyItemGroups } from "@/lib/study-kinds-constants";
import {
  type GroupedStudyResources,
  type PublicStudyItem,
  STUDY_PAGE_SIZE,
  type StudyResourceKind,
  type StudyResourcesPageResult,
} from "@/lib/study-list-public";

export {
  STUDY_PAGE_SIZE,
  type GroupedStudyResources,
  type PublicStudyItem,
  type StudyResourcesPageResult,
  parseEstudosPageQuery,
  parseEstudosKindQuery,
  buildEstudosListUrl,
  STUDY_KIND_ORDER,
  STUDY_SECTION_LABEL,
} from "@/lib/study-list-public";
export type { StudyResourceKind } from "@/lib/study-list-public";

function emptyGroups(): GroupedStudyResources {
  return emptyStudyItemGroups<PublicStudyItem>();
}

export async function getPublicEstudosManageCapability() {
  const c = await getSiteCapabilities();
  return { canManage: c.institutional };
}

/**
 * Recursos do tenant público institucional, agrupados por categoria.
 */
export async function getStudyResourcesGrouped(): Promise<GroupedStudyResources> {
  const t = await resolvePublicBlogTenant();
  if (!t?.id) {
    return emptyGroups();
  }
  const rows = await getPrisma().studyResource.findMany({
    where: { tenantId: t.id },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    select: {
      id: true,
      kind: true,
      title: true,
      description: true,
      linkUrl: true,
      displayOrder: true,
    },
  });
  const g = emptyGroups();
  for (const r of rows) {
    g[r.kind].push({
      id: r.id,
      kind: r.kind,
      title: r.title,
      description: r.description,
      linkUrl: r.linkUrl,
      displayOrder: r.displayOrder,
    });
  }
  return g;
}

/**
 * Lista paginada do tenant público (filtro opcional por `kind`).
 */
export async function getStudyResourcesPage(options: {
  kind?: StudyResourceKind;
  page: number;
}): Promise<StudyResourcesPageResult> {
  const pageSize = STUDY_PAGE_SIZE;
  const t = await resolvePublicBlogTenant();
  if (!t?.id) {
    return { items: [], totalCount: 0, totalInTenant: 0, page: 1, pageSize };
  }
  const where = {
    tenantId: t.id,
    ...(options.kind ? { kind: options.kind } : {}),
  };
  const totalCount = await getPrisma().studyResource.count({ where });
  const totalInTenant = options.kind
    ? await getPrisma().studyResource.count({ where: { tenantId: t.id } })
    : totalCount;
  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);
  const page = Math.min(Math.max(1, options.page), totalPages);
  const skip = (page - 1) * pageSize;
  const rows = await getPrisma().studyResource.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    skip,
    take: pageSize,
    select: {
      id: true,
      kind: true,
      title: true,
      description: true,
      linkUrl: true,
      displayOrder: true,
    },
  });
  return {
    items: rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      title: r.title,
      description: r.description,
      linkUrl: r.linkUrl,
      displayOrder: r.displayOrder,
    })),
    totalCount,
    totalInTenant,
    page,
    pageSize,
  };
}

export async function getStudyForEdit(tenantId: string, id: string) {
  return getPrisma().studyResource.findFirst({
    where: { id, tenantId },
    select: {
      id: true,
      kind: true,
      title: true,
      description: true,
      linkUrl: true,
      displayOrder: true,
    },
  });
}
