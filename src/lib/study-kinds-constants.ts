/**
 * Valores alinhados ao enum `StudyResourceKind` (Prisma).
 * Usar isto em componentes `use client` em vez de `@/generated/prisma/client` para não embutir o runtime do Prisma.
 */
export const STUDY_RESOURCE_KINDS = [
  "artigo",
  "livro",
  "video",
  "material_educacional",
] as const;

export type StudyResourceKind = (typeof STUDY_RESOURCE_KINDS)[number];

const KIND_SET = new Set<string>(STUDY_RESOURCE_KINDS);

export function isStudyResourceKind(s: string): s is StudyResourceKind {
  return KIND_SET.has(s);
}

export const STUDY_KIND_ORDER: readonly StudyResourceKind[] = STUDY_RESOURCE_KINDS;

export const STUDY_FORM_KIND_OPTIONS: { value: StudyResourceKind; label: string }[] = [
  { value: "artigo", label: "Artigo" },
  { value: "livro", label: "Livro" },
  { value: "video", label: "Vídeo" },
  { value: "material_educacional", label: "Material educacional" },
];

export const STUDY_SECTION_LABEL: Record<StudyResourceKind, string> = {
  artigo: "Artigos",
  livro: "Livros",
  video: "Vídeos",
  material_educacional: "Material educacional",
};

export function emptyStudyItemGroups<T>(): Record<StudyResourceKind, T[]> {
  return { artigo: [], livro: [], video: [], material_educacional: [] };
}
