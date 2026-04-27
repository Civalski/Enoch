import { getPrisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { calendarMonthKey, lastNCalendarMonths } from "@/lib/donations-months";
import type { DonationMonthBucket } from "@/lib/donations-data";
import {
  TRANSPARENCY_CATEGORY_PRESENTATION,
  TRANSPARENCY_EXPENSE_CATEGORY_ORDER,
  type TransparencyCategoryPresentation,
  type TransparencyExpenseCategoryId,
} from "@/lib/transparency-categories";
import { buildExtratoMonths, type ExtratoExpenseLine, type ExtratoMonthPublic } from "@/lib/transparency-extrato";

export type DestinacaoBlockPublic = TransparencyCategoryPresentation & {
  id: TransparencyExpenseCategoryId;
  amount: number;
  percent: number;
};

export type TransparencyExpenseViews = {
  extratoRows: ExtratoMonthPublic[];
  destinacaoBlocks: DestinacaoBlockPublic[];
  totalDespesasPeriod: number;
};

function emptyViews(monthSpecs: { year: number; month: number }[], receitasByKey: Map<string, number>) {
  const blankLines = new Map<string, never[]>();
  const extratoRows = buildExtratoMonths(monthSpecs, receitasByKey, blankLines);
  const destinacaoBlocks = TRANSPARENCY_EXPENSE_CATEGORY_ORDER.map((id) => ({
    id,
    ...TRANSPARENCY_CATEGORY_PRESENTATION[id],
    amount: 0,
    percent: 0,
  })) as DestinacaoBlockPublic[];
  return { extratoRows, destinacaoBlocks, totalDespesasPeriod: 0 };
}

export async function getTransparencyExpenseViews(
  donationMonths: DonationMonthBucket[],
): Promise<TransparencyExpenseViews> {
  const monthSpecs = lastNCalendarMonths(6);
  const receitasByKey = new Map(donationMonths.map((m) => [m.key, m.total]));
  const tenant = await resolvePublicBlogTenant();
  if (!tenant) {
    return emptyViews(monthSpecs, receitasByKey);
  }

  const first = monthSpecs[0]!;
  const last = monthSpecs[monthSpecs.length - 1]!;
  const rangeStart = new Date(first.year, first.month, 1);
  const rangeEnd = new Date(last.year, last.month + 1, 0, 23, 59, 59, 999);

  const rows = await getPrisma().transparencyExpense.findMany({
    where: { tenantId: tenant.id, spentAt: { gte: rangeStart, lte: rangeEnd } },
    orderBy: { spentAt: "desc" },
    select: { id: true, category: true, amount: true, spentAt: true, description: true },
  });

  const expenseLinesByKey = new Map<string, ExtratoExpenseLine[]>();
  const totalsByCategory = new Map<TransparencyExpenseCategoryId, number>();
  for (const c of TRANSPARENCY_EXPENSE_CATEGORY_ORDER) {
    totalsByCategory.set(c, 0);
  }

  for (const r of rows) {
    const d = r.spentAt;
    const key = calendarMonthKey(d.getFullYear(), d.getMonth());
    const amount = Number(r.amount.toString());
    const cat = r.category as TransparencyExpenseCategoryId;
    const label = TRANSPARENCY_CATEGORY_PRESENTATION[cat].title;
    const list = expenseLinesByKey.get(key) ?? [];
    list.push({
      id: r.id,
      category: r.category,
      categoryLabel: label,
      amount,
      description: r.description,
      spentAtMs: r.spentAt.getTime(),
    });
    expenseLinesByKey.set(key, list);
    totalsByCategory.set(cat, (totalsByCategory.get(cat) ?? 0) + amount);
  }

  const extratoRows = buildExtratoMonths(monthSpecs, receitasByKey, expenseLinesByKey);
  const totalDespesasPeriod = rows.reduce((s, r) => s + Number(r.amount.toString()), 0);

  const destinacaoBlocks = TRANSPARENCY_EXPENSE_CATEGORY_ORDER.map((id) => {
    const amount = totalsByCategory.get(id) ?? 0;
    const percent =
      totalDespesasPeriod > 0 ? Math.round((amount / totalDespesasPeriod) * 1000) / 10 : 0;
    return {
      id,
      ...TRANSPARENCY_CATEGORY_PRESENTATION[id],
      amount,
      percent,
    };
  }) as DestinacaoBlockPublic[];

  return { extratoRows, destinacaoBlocks, totalDespesasPeriod };
}
