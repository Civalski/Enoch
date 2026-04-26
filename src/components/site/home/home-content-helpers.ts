import type { HelpColumn, HomeContentV1, TeaserCard } from "@/lib/institutional-site/types";

export function ensureStats(h: HomeContentV1) {
  const items = h.stats?.items?.length
    ? [...h.stats.items]
    : Array.from({ length: 4 }, () => ({} as { n?: string; label?: string }));
  while (items.length < 4) items.push({});
  return items.slice(0, 4) as { n?: string; label?: string }[];
}

export function ensureCards(h: HomeContentV1): [TeaserCard, TeaserCard, TeaserCard] {
  const c = h.projetosTeaser?.cards;
  if (c && c.length === 3) return c as [TeaserCard, TeaserCard, TeaserCard];
  return [{}, {}, {}];
}

export function ensureCols(h: HomeContentV1): [HelpColumn, HelpColumn, HelpColumn] {
  const cols = h.comoAjudar?.cols;
  if (cols && cols.length === 3) return cols as [HelpColumn, HelpColumn, HelpColumn];
  return [{}, {}, {}];
}
