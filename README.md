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

URL atual: **https://enoch.arkersoft.workers.dev** (altere `vars.NEXT_PUBLIC_SITE_URL` em [`wrangler.json`](wrangler.json) e os segredos abaixo se usar outro domínio).

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

- **Site URL**: a URL pública (ex. `https://enoch.arkersoft.workers.dev` ou o domínio custom).
- **Redirect URLs**: inclua a callback exata, por exemplo `https://enoch.arkersoft.workers.dev/auth/callback` (e o equivalente no domínio de produção). Sem isto, o fluxo após o email/link de autenticação falha.

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
