# Spec: Migração Astro → Next.js + OpenNext (Cloudflare)

- **Status:** implementada
- **Autor / data:** agente / 2026-04-23

## Objetivo

Substituir Astro por Next.js (App Router), empacotar com `@opennextjs/cloudflare` e Wrangler, mantendo paridade de rotas e conteúdo público.

## Usuários e contexto

- Visitantes do site institucional (páginas públicas).

## Rotas e SEO (paridade)

| Rota | Título (suffix site) | Uso |
|------|----------------------|-----|
| `/` | Início | Hero + seções; preloader na primeira carga |
| `/sobre` | Sobre Nós | Conteúdo institucional |
| `/projetos` | Projetos | Cards de projetos |
| `/contato` | Contato | Formulário (UX mock), doação, mapa |
| `/transparencia` | Transparência | Tabelas e resumos |

Meta `description` e `lang="pt-BR"` equivalentes ao layout Astro anterior.

## Fluxos

### Fluxo principal (build local)

1. `npm install`
2. `npm run dev` — Next dev com `initOpenNextCloudflareForDev`
3. `npm run build` — `next build` (invocado pela CLI OpenNext no preview/deploy)
4. `npm run preview` — build OpenNext + preview Workers (quando credenciais CF disponíveis)

### Preloader

- Exibir na home até `load` + 800ms ou timeout 4s, como no Astro.

## Não-objetivos

- Painel admin completo, CMS, i18n, backend de formulário de contato real, D1/usuários persistidos nesta entrega.
- Otimização de imagens Cloudflare (`IMAGES` binding) — usar `remotePatterns` / `<img>` conforme necessário.
- R2 incremental cache — opcional futuro.

## Critérios de aceite (testáveis)

- [x] `npm run build` conclui sem erro.
- [x] Rotas públicas acima respondem 200 em `next dev`.
- [x] [`public/_headers`](../../public/_headers) define cache imutável para `/_next/static/*`.
- [x] `.open-next` no `.gitignore`.

## Referências

- Código: `src/app/`, `src/components/site/`, `wrangler.json`, `next.config.ts`
- Docs: [OpenNext Cloudflare — Get Started](https://opennext.js.org/cloudflare/get-started)
