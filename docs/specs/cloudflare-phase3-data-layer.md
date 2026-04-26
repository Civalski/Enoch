# Fase 3 (decisão): camada de dados e tamanho do Worker

## Estado atual

Após Fase 1 (markdown leve + `optimizePackageImports` + `wrangler --minify`), o **gzip do script** ficou **abaixo** do teto ~3072 KiB do plano gratuito (ver [cloudflare-bundle-baseline.md](./cloudflare-bundle-baseline.md)).

**Não é obrigatório** iniciar esta fase enquanto as medições `wrangler deploy --dry-run` se mantiverem estáveis.

## Se o bundle voltar a ultrapassar o limite

Escolher **uma** linha principal (ou combinar B + migração parcial A):

### Opção 3A — Supabase no runtime, Prisma só tooling

- Manter [`prisma/schema.prisma`](../../prisma/schema.prisma) e migrações para evolução do schema.
- Nas rotas e libs servidor, substituir chamadas `prisma` por **PostgREST / RPC** via `supabase-js` (anon + RLS ou service role só onde necessário).
- **Efeito:** remove `@prisma/client`, `@prisma/adapter-pg` e `pg` do bundle do Worker (ganho grande).
- **Risco:** paridade com RLS, transações e validações; rever [docs/agent/security.md](../agent/security.md).

### Opção 3B — Dois deploys

- Site público: Worker “magro” (menos dependências).
- Backoffice: outro Worker ou hospedagem Node (Vercel, Railway, etc.).
- **Efeito:** isola o painel (Prisma) do Worker público.
- **Custo:** duas pipelines e possivelmente dois destinos de custo.

### Opção 3C — Workers Paid

- Limite de script maior (~10 MiB); adequado se o tempo de engenharia 3A/3B for superior ao custo mensal.

## Roadmap sugerido se 3A for escolhida

1. Inventariar módulos que importam [`src/lib/prisma.ts`](../../src/lib/prisma.ts).
2. Por domínio (blog, transparência, contacto, …), introduzir repositórios Supabase e testes de regressão.
3. Remover dependências Prisma/pg do `package.json` apenas quando **nenhum** import runtime restar (manter `prisma` em devDependencies para migrações).
