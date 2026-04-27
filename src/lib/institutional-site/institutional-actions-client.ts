"use client";

/**
 * Server actions em `institucional/actions` importam o namespace runtime `Prisma` de
 * `@prisma/client`. Um import estático desse módulo em client components que fazem SSR
 * (ex.: `SiteHeader` no layout) força o Worker a avaliar esse grafo em cada pedido e
 * quebra em produção no Cloudflare com Prisma `engineType = "client"` + adapter.
 * Carregar só quando o utilizador grava (import dinâmico) evita avaliar esse módulo no SSR.
 */
type InstitutionalActionsModule = typeof import("@/app/app/institucional/actions");

let loadPromise: Promise<InstitutionalActionsModule> | null = null;

export function loadInstitutionalActions(): Promise<InstitutionalActionsModule> {
  loadPromise ??= import("@/app/app/institucional/actions");
  return loadPromise;
}
