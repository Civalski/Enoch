import { describe, expect, it } from "vitest";
import { buildExtratoMonths, type ExtratoExpenseLine } from "./transparency-extrato";

describe("buildExtratoMonths", () => {
  it("calcula despesas, receitas e saldo mensal", () => {
    const specs = [{ year: 2024, month: 0 }];
    const receitas = new Map([["2024-01", 100]]);
    const lines = new Map([
      [
        "2024-01",
        [
          {
            id: "00000000-0000-4000-8000-000000000001",
            category: "assistencia_social",
            categoryLabel: "Assistência Social",
            amount: 30,
            description: "cestas",
            spentAtMs: Date.UTC(2024, 0, 15, 12, 0, 0),
          } satisfies ExtratoExpenseLine,
        ],
      ],
    ]);
    const rows = buildExtratoMonths(specs, receitas, lines);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.receitas).toBe(100);
    expect(rows[0]!.despesas).toBe(30);
    expect(rows[0]!.saldo).toBe(70);
    expect(rows[0]!.expenseLines[0]!.categoryLabel).toBe("Assistência Social");
  });

  it("ordena linhas de despesa por valor decrescente", () => {
    const specs = [{ year: 2024, month: 1 }];
    const lines = new Map([
      [
        "2024-02",
        [
          {
            id: "00000000-0000-4000-8000-000000000002",
            category: "projetos_educacionais",
            categoryLabel: "A",
            amount: 10,
            description: null,
            spentAtMs: Date.UTC(2024, 1, 1, 12, 0, 0),
          } satisfies ExtratoExpenseLine,
          {
            id: "00000000-0000-4000-8000-000000000003",
            category: "infraestrutura",
            categoryLabel: "B",
            amount: 50,
            description: null,
            spentAtMs: Date.UTC(2024, 1, 2, 12, 0, 0),
          } satisfies ExtratoExpenseLine,
        ],
      ],
    ]);
    const rows = buildExtratoMonths(specs, new Map(), lines);
    expect(rows[0]!.expenseLines.map((x) => x.categoryLabel)).toEqual(["B", "A"]);
  });
});
