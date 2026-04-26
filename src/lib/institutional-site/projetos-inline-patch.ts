import { DEFAULT_PROJETOS_V1 } from "./defaults";
import type { ProjetosContentV1, ProjetosLineTriple, ProjetosParticiparCard } from "./types";

type I3 = [ProjetosLineTriple, ProjetosLineTriple, ProjetosLineTriple];
type P3 = [ProjetosParticiparCard, ProjetosParticiparCard, ProjetosParticiparCard];

export function impactRowsMerged(p: ProjetosContentV1): I3 {
  const d = DEFAULT_PROJETOS_V1.impacto!.items!;
  return [0, 1, 2].map((i) => ({ ...d[i], ...(p.impacto?.items?.[i] ?? {}) })) as I3;
}

export function participarRowsMerged(p: ProjetosContentV1): P3 {
  const d = DEFAULT_PROJETOS_V1.participar!.items!;
  return [0, 1, 2].map((i) => ({ ...d[i], ...(p.participar?.items?.[i] ?? {}) })) as P3;
}

export function patchImpactItem(
  x: ProjetosContentV1,
  idx: 0 | 1 | 2,
  patch: Partial<ProjetosLineTriple>,
): ProjetosContentV1 {
  const d = DEFAULT_PROJETOS_V1.impacto!.items!;
  const it = [0, 1, 2].map((i) => ({ ...d[i], ...(x.impacto?.items?.[i] ?? {}) })) as I3;
  it[idx] = { ...it[idx], ...patch };
  return { ...x, impacto: { ...x.impacto, items: it } };
}

export function patchParticiparItem(
  x: ProjetosContentV1,
  idx: 0 | 1 | 2,
  patch: Partial<ProjetosParticiparCard>,
): ProjetosContentV1 {
  const d = DEFAULT_PROJETOS_V1.participar!.items!;
  const it = [0, 1, 2].map((i) => ({ ...d[i], ...(x.participar?.items?.[i] ?? {}) })) as P3;
  it[idx] = { ...it[idx], ...patch };
  return { ...x, participar: { ...x.participar, items: it } };
}
