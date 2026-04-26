# Supabase + Cloudflare: quotas e boas práticas (free tier)

## Postgres e conexões

- Preferir string de conexão com **pooling** (modo transaction / PgBouncer) para aplicações serverless, conforme documentação do Supabase.
- No Worker, [`getDatabaseUrl`](../../src/lib/database-url.ts) suporta binding **Hyperdrive**: reduz picos de conexões e latência; configurar em [`wrangler.json`](../../wrangler.json) após criar o recurso no painel Cloudflare (ver [README.md](../../README.md)).

## Auth

- **Site URL** e **Redirect URLs** devem incluir a URL pública exata (ex. `https://…/auth/callback`).
- URLs incorretas geram falhas repetidas e tráfego desnecessário em Auth.

## Egress e API

- Evitar **N+1** em leituras (muitas idas ao PostgREST ou REST admin).
- Usar `SUPABASE_SERVICE_ROLE_KEY` **apenas** no servidor e só onde RLS não cobre o caso; nunca expor ao cliente.

## Monitorização

- Acompanhar uso no painel Supabase (Database, Auth, Storage, egress) contra [limites do plano gratuito](https://supabase.com/pricing).

## Segurança

- Alterações em políticas RLS e exposição de dados: alinhar com [docs/agent/security.md](../agent/security.md).
