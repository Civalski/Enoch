# Spec: Multi-tenancy + Supabase Auth (`/app`)

- **Status:** implementada
- **Autor / data:** agente / 2026-04-23

## Objetivo

Autenticar usuários com **Supabase Auth**, persistir **organizações (tenants)** e **membros** no Postgres via **Prisma**, e oferecer área logada `/app` com tenant ativo (cookie).

## Usuários

- Usuário final com e-mail/senha (Supabase).
- Cada novo usuário recebe um **tenant padrão** e papel **OWNER** na primeira entrada em `/app`.

## Dados (Prisma)

- `UserProfile`: `id` = `auth.users.id` (UUID), `email`, `fullName?`
- `Tenant`: `name`, `slug` único
- `TenantMember`: `tenantId`, `userId`, `role` (`OWNER` | `ADMIN` | `MEMBER`), único por par tenant+usuário

## Fluxos

1. Cadastro → Supabase `signUp` → confirmação de e-mail se configurado no projeto → callback `/auth/callback`
2. Login → `signInWithPassword` → `/app`
3. `/app` → garante profile + tenant padrão se necessário → resolve tenant ativo (cookie ou primeiro membership)
4. Troca de tenant → server action grava cookie `enoch-tenant-id` (validado contra membership)

## Não-objetivos

- RLS SQL no repositório (Prisma usa `DATABASE_URL` com privilégios de app; RLS pode ser adicionada depois no Supabase para acesso via API REST)
- Convites por e-mail, billing por tenant, papéis granulares além do enum

## Critérios de aceite

- [ ] Rotas sob `/app` exigem sessão Supabase; visitante vai para `/login?next=…`
- [ ] Novo usuário logado ganha pelo menos um tenant e membership OWNER
- [ ] Cookie de tenant só aceito se o usuário for membro do tenant

## Arquivos principais

- Produção (Workers): `https://enoch.arkersoft.workers.dev` — `NEXT_PUBLIC_SITE_URL`, Supabase redirect `…/auth/callback`
- `prisma/schema.prisma`, `src/middleware.ts`, `src/utils/supabase/middleware.ts`
- `src/lib/auth/server.ts`, `src/lib/tenant/*`, `src/app/login`, `src/app/cadastro`, `src/app/auth/callback`, `src/app/app/*`
