import type { TransparencyExpenseCategory } from "@prisma/client";

export const TRANSPARENCY_EXPENSE_CATEGORY_ORDER = [
  "assistencia_social",
  "projetos_educacionais",
  "acoes_saude",
  "infraestrutura",
] as const satisfies readonly TransparencyExpenseCategory[];

export type TransparencyExpenseCategoryId = (typeof TRANSPARENCY_EXPENSE_CATEGORY_ORDER)[number];

type Gradient = "orange" | "green" | "red" | "purple";
type Icon = "book" | "heart" | "box";

export type TransparencyCategoryPresentation = {
  title: string;
  subtitle: string;
  gradient: Gradient;
  icon: Icon;
};

export const TRANSPARENCY_CATEGORY_PRESENTATION: Record<
  TransparencyExpenseCategoryId,
  TransparencyCategoryPresentation
> = {
  assistencia_social: {
    title: "Assistência Social",
    subtitle: "Auxílio a famílias em situação de vulnerabilidade",
    gradient: "orange",
    icon: "book",
  },
  projetos_educacionais: {
    title: "Projetos Educacionais",
    subtitle: "Programas de educação e capacitação",
    gradient: "green",
    icon: "book",
  },
  acoes_saude: {
    title: "Ações de Saúde",
    subtitle: "Campanhas e atendimentos de saúde",
    gradient: "red",
    icon: "heart",
  },
  infraestrutura: {
    title: "Infraestrutura",
    subtitle: "Manutenção e melhorias das instalações",
    gradient: "purple",
    icon: "box",
  },
};

export function isTransparencyExpenseCategory(raw: string): raw is TransparencyExpenseCategory {
  return (TRANSPARENCY_EXPENSE_CATEGORY_ORDER as readonly string[]).includes(raw);
}
