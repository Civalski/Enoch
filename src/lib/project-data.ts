import { getPrisma } from "@/lib/prisma";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { getHiddenStaticProjectTitleSet } from "@/lib/institutional-site/hidden-seed-content";
import { STATIC_PROJETOS, type StaticProject } from "@/lib/projects-static";

export type MergedProject = {
  title: string;
  description: string;
  image: string;
  /** Presente se o conteúdo vem da base de dados. */
  dbId: string | null;
};

function rowToMerged(row: {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}): MergedProject {
  return {
    dbId: row.id,
    title: row.title,
    description: row.description,
    image: row.imageUrl,
  };
}

function staticToMerged(s: StaticProject): MergedProject {
  return { dbId: null, title: s.title, description: s.description, image: s.image };
}

export async function getPublicProjetosManageCapability() {
  const c = await getSiteCapabilities();
  return { canManage: c.projects };
}

async function getPublicTenantId(): Promise<string | null> {
  const t = await resolvePublicBlogTenant();
  return t?.id ?? null;
}

/**
 * Projetos estáticos (texto de exemplo) e registos na base, por título (o da base prevalece).
 */
export async function getMergedProjetos(): Promise<MergedProject[]> {
  const tenantId = await getPublicTenantId();
  if (!tenantId) {
    return STATIC_PROJETOS.map(staticToMerged);
  }

  const rows = await getPrisma().project.findMany({
    where: { tenantId },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    select: { id: true, title: true, description: true, imageUrl: true, displayOrder: true },
  });

  const dbByTitle = new Map(rows.map((r) => [r.title, r] as const));
  const usedStaticTitles = new Set(STATIC_PROJETOS.map((s) => s.title));
  const out: MergedProject[] = [];
  const hiddenStaticTitles = await getHiddenStaticProjectTitleSet(tenantId);

  for (const s of STATIC_PROJETOS) {
    const r = dbByTitle.get(s.title);
    if (!r && hiddenStaticTitles.has(s.title)) {
      continue;
    }
    out.push(r ? rowToMerged(r) : staticToMerged(s));
  }
  for (const r of rows) {
    if (!usedStaticTitles.has(r.title)) {
      out.push(rowToMerged(r));
    }
  }
  return out;
}

export async function getProjectForEdit(tenantId: string, id: string) {
  return getPrisma().project.findFirst({
    where: { id, tenantId },
    select: { id: true, title: true, description: true, imageUrl: true, displayOrder: true },
  });
}
