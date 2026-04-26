export const PAGE_SIZE = 10;

export const SUBJECT_LABEL: Record<string, string> = {
  doacao: "Doação",
  voluntariado: "Voluntariado",
  projetos: "Projetos",
  parceria: "Parceria",
  outro: "Outro",
};

export const SUBJECT_ORDER = ["doacao", "voluntariado", "projetos", "parceria", "outro"] as const;

export type CategoryFilter = "all" | (typeof SUBJECT_ORDER)[number];

export function formatInboxDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function contactInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
