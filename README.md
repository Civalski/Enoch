# Site Institucional — A.R.L.S Enoch

Site institucional com Next.js (App Router), Tailwind CSS e deploy via [OpenNext](https://opennext.js.org) para Cloudflare Workers.

## Início rápido

```bash
npm install
# Opcional: `.env` na raiz com NEXTJS_ENV=development
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Produção (Cloudflare Workers)

URL pública usada no [`wrangler.json`](wrangler.json) (`vars.NEXT_PUBLIC_SITE_URL`): **https://site-enoch.arkersoft.workers.dev** (aloje o domínio custom/redirect no painel e mantenha a mesma URL no Supabase e no worker).

### Variáveis e segredos

Copie [`.env.example`](.env.example) para `.env` em desenvolvimento. No **Cloudflare** → Workers → o seu worker → **Settings** → **Variables and Secrets**, configure no mínimo:

| Nome | Tipo | Notas |
|------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | Plain / build | URL pública exata (inclui `https://`); tem de bater com o que o cliente abre. Pode repetir o valor de `wrangler.json` → `vars`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | Projeto Supabase → API. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Plain | Chave `anon` / publishable. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Nunca expor ao cliente; só servidor. |
| `DATABASE_URL` | **Secret** | URL Postgres (ver Hyperdrive abaixo). |

Opcionais: `BLOG_TENANT_SLUG`, `NEXT_PUBLIC_AUTH_EMAIL_DOMAIN`.

### Postgres e Hyperdrive

O código usa [`getDatabaseUrl`](src/lib/database-url.ts): no Worker, se existir o binding **`HYPERDRIVE`**, usa `env.HYPERDRIVE.connectionString`; caso contrário usa `DATABASE_URL`. Em produção na Cloudflare é recomendável [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) para pooling e conexões estáveis. Depois de criar o Hyperdrive no painel, acrescente ao `wrangler.json` (substitua `ID_DO_HYPERDRIVE`):

```json
"hyperdrive": [
  { "binding": "HYPERDRIVE", "id": "ID_DO_HYPERDRIVE" }
]
```

Enquanto não houver binding, defina `DATABASE_URL` como secret com a connection string do Postgres (ex. Supabase). Com o binding ativo, deixe `DATABASE_URL` para Prisma CLI/migrações locais e o runtime no Worker usa o Hyperdrive.

### Supabase Auth (obrigatório para login)

No **Supabase** → **Authentication** → **URL configuration**:

- **Site URL**: a URL pública (a mesma que em `wrangler.json`, ex. `https://site-enoch.arkersoft.workers.dev` ou o domínio custom).
- **Redirect URLs**: inclua a callback exata, por exemplo `https://site-enoch.arkersoft.workers.dev/auth/callback` (e o equivalente no domínio de produção). Sem isto, o fluxo após o email/link de autenticação falha.

### Erro 500 / digest no site (Workers)

1. **Postgres no Worker**: o secret `DATABASE_URL` (ou o binding [Hyperdrive](#postgres-e-hyperdrive) em `wrangler.json` + novo deploy) tem de existir. Sem isso, o layout público (Prisma) falha. O digest mostrado no browser **não** contém a mensagem; a exceção real está nos **logs do worker**.

2. **Ver o erro real (correlação com digest)**: com [Wrangler autenticado](https://developers.cloudflare.com/workers/wrangler/commands/#login), no diretório do projecto: `npx wrangler tail site-enoch` (o nome bate com `name` em [`wrangler.json`](wrangler.json)). Reproduza o erro; no stream aparecem `Exceptions` e `console` com stack (Prisma, `P1001`, `pgbouncer`, etc.). No painel: **Workers → site-enoch → Observability** (ou *Logs* / *Real-time*). O digest do Next.js é id da instância de erro no servidor; basta o mesmo minuto/URL do pedido para associar.

3. **Checklist de produção (Worker)** além de `NEXT_PUBLIC_*` e Supabase:

| Variável | Obrigatório | Nota |
|----------|------------|------|
| `DATABASE_URL` ou Hyperdrive + binding | Sim (runtime) | String do pooler de transacções; ver [`getDatabaseUrl`](src/lib/database-url.ts) e notas de SSL/pgbouncer no código. |
| `SIMPLE_AUTH_SECRET` | Sim | Mínimo 16 caracteres; sem isto a sessão do painel não assina. |
| `ADMIN_PASSWORD` | Sim para login de mestre | Conta de painel (`ADMIN_LOGIN` opcional). |
| `BLOG_TENANT_SLUG` | Se vários `Tenant` | Evita conteúdo público ambíguo. |
| `AUTH_SESSION_COOKIE_DOMAIN` | Se apex + www (ou dois hosts ao mesmo domínio) | Ex.: `.enochbrasil.com.br` — permite que `enoch_painel` seja enviado em todos os hosts; sem isto, login num hostname e navegação noutro parece “sem sessão”. |

4. **Degradação em falha de base**: o layout público degrada capabilities quando o Provisioning/Prisma falha (veja [`getSiteCapabilities`](src/lib/permissions/site-permissions.ts)) para evitar tela em branco; *ações* no backoffice ainda exigem base disponível. Corrija a ligação à base, não conte com degradação permanente.

5. **Build de produção** para o Worker: use **`npm run deploy`** (OpenNext + `wrangler deploy --keep-vars`). O projeto usa **Prisma** com `engineType = "client"` + `@prisma/adapter-pg`, evitando o engine Rust no `workerd`.
6. **Windows**: o aviso do OpenNext aplica-se; se o `opennextjs-cloudflare build` falhar, use [WSL](https://learn.microsoft.com/windows/wsl/) ou um agente Linux/CI.
7. **`[unenv] fs.*` no Worker**: algum código (dependência ou padrão antigo) tentou `fs` no `workerd`. Para Prisma em Workers, mantenha `engineType = "client"` no [`prisma/schema.prisma`](prisma/schema.prisma), use **`getPrisma()`** por pedido (React `cache` + `max: 1` no pool) em [`src/lib/prisma.ts`](src/lib/prisma.ts) / [`src/lib/prisma-factory.ts`](src/lib/prisma-factory.ts), e evite `next/font` no layout (o projecto usa link à Google Fonts + CSS). Scripts CLI importam de `prisma-factory` (não de `prisma.ts`, que traz `server-only`).

## Scripts

| Comando | Descrição |
|--------|------------|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção Next.js |
| `npm run analyze` | `next build` com `@next/bundle-analyzer` (variável `ANALYZE=true`) |
| `npm run test` | Vitest |
| `npm run preview` | Build OpenNext + preview no runtime Workers (requer Wrangler/Cloudflare) |
| `npm run deploy` | Build + deploy para Cloudflare (conta autenticada) |

Limites do **plano gratuito** do Worker (tamanho do script), medição com Wrangler e decisões de dados: [docs/specs/cloudflare-bundle-baseline.md](docs/specs/cloudflare-bundle-baseline.md), [docs/specs/cloudflare-phase3-data-layer.md](docs/specs/cloudflare-phase3-data-layer.md), [docs/specs/supabase-cloudflare-quotas.md](docs/specs/supabase-cloudflare-quotas.md).

Não versionar pastas de build (`.next/`, `.open-next/`); estão no [`.gitignore`](.gitignore).

Para desenvolvimento local alinhado ao Cloudflare, crie `.dev.vars` com pelo menos `NEXTJS_ENV=development` (veja [documentação Wrangler](https://developers.cloudflare.com/workers/testing/local-development/)).

## Estrutura (resumo)

```
├── public/                 # Estáticos (favicon, vídeos, _headers)
├── src/
│   ├── app/              # App Router (páginas, layout)
│   └── components/site/  # UI compartilhada
├── docs/specs/           # Especificações
├── wrangler.json         # Worker Cloudflare (OpenNext)
├── open-next.config.ts
└── next.config.ts
```

## Tecnologias

- [Next.js](https://nextjs.org/)
- [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)
- [Tailwind CSS](https://tailwindcss.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
