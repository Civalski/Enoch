const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

/** Últimos `n` meses de calendário, do mais antigo ao mais recente (índice de mês 0–11). */
export function lastNCalendarMonths(n: number, ref = new Date()): { year: number; month: number }[] {
  const out: { year: number; month: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    out.push({ year: x.getFullYear(), month: x.getMonth() });
  }
  return out;
}

export function calendarMonthKey(year: number, monthIndex0: number): string {
  return `${year}-${String(monthIndex0 + 1).padStart(2, "0")}`;
}

export function formatMonthLabelPt(year: number, monthIndex0: number): string {
  return `${MONTHS_PT[monthIndex0]}/${year}`;
}
