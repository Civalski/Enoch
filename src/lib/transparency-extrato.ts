import { calendarMonthKey, formatMonthLabelPt } from "@/lib/donations-months";
import type { TransparencyExpenseCategory } from "@/generated/prisma/client";

export type ExtratoExpenseLine = {
  id: string;
  category: TransparencyExpenseCategory;
  categoryLabel: string;
  amount: number;
  description: string | null;
  spentAtMs: number;
};

export type ExtratoMonthPublic = {
  key: string;
  label: string;
  receitas: number;
  despesas: number;
  saldo: number;
  expenseLines: ExtratoExpenseLine[];
};

export function buildExtratoMonths(
  monthSpecs: { year: number; month: number }[],
  receitasByKey: Map<string, number>,
  expenseLinesByKey: Map<string, ExtratoExpenseLine[]>,
): ExtratoMonthPublic[] {
  return monthSpecs.map(({ year, month }) => {
    const key = calendarMonthKey(year, month);
    const receitas = receitasByKey.get(key) ?? 0;
    const expenseLines = [...(expenseLinesByKey.get(key) ?? [])].sort((a, b) => b.amount - a.amount);
    const despesas = expenseLines.reduce((s, x) => s + x.amount, 0);
    return {
      key,
      label: formatMonthLabelPt(year, month),
      receitas,
      despesas,
      saldo: receitas - despesas,
      expenseLines,
    };
  });
}
