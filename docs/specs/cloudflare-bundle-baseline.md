# Baseline: bundle Workers (OpenNext)

## Versões registadas (npm)

Valores típicos após `npm install` — atualizar esta secção quando subir major de runtime.

| Pacote | Versão (referência) |
|--------|---------------------|
| `next` | ^15.1.0 (build report: 15.5.15) |
| `@opennextjs/cloudflare` | ^1.3.0 (CLI build: 1.19.4) |
| `wrangler` | ^4.0.0 (ex.: 4.84.1) |

## Limite free tier

- Cloudflare Workers (gratuito): script do Worker ~**3 MiB** (API usa limiar em torno de **3072 KiB** gzip no upload).
- Assets em `.open-next/assets` **não** entram nesse teto.

## Como medir o gzip do script

1. `npx opennextjs-cloudflare build`
2. `OPEN_NEXT_DEPLOY=true npx wrangler deploy --minify --dry-run` (PowerShell: `$env:OPEN_NEXT_DEPLOY="true"` antes do comando).

Na saída, usar a linha **gzip:** (ex. `gzip: 3047 KiB`).

O fluxo de produção do repo é `npm run deploy` ([`package.json`](../../package.json)), que usa [`scripts/cloudflare-deploy.mjs`](../../scripts/cloudflare-deploy.mjs) com `--minify`.

## Análise Next (rotas / client)

```bash
npm run analyze
```

Gera relatórios do `@next/bundle-analyzer` após `next build` (útil para dependências que inflacionam o grafo; o teto crítico continua a ser o bundle OpenNext + Wrangler).

## Última medição (pós-otimização Fase 1)

- **gzip:** ~3047 KiB (`wrangler deploy --minify --dry-run`, 2026-04-26).
- Alterações relevantes: remoção de `react-markdown` / `remark-gfm`; pipeline `marked` + `xss`; `experimental.optimizePackageImports` no [`next.config.ts`](../../next.config.ts).
