# Spec: Permissões por área e página Utilizadores

- **Status:** implementada
- **Autor / data:** agente / 2026-04-26

## Objetivo

Controlar, por membro e por área do site, o que cada utilizador pode editar; página `/app/usuarios` para **proprietário (OWNER) ou administrador (ADMIN)** do tenant público: listar membros, criar contas (Supabase Admin) e atribuir permissões a **ADMIN** e **MEMBER**.

## Usuários e contexto

- **OWNER** e **ADMIN**: acedem a `/app/usuarios` (menu do painel e ações) no site público.
- **MEMBER**: acesso a edição só conforme o array `permissions` no `TenantMember`; **não** gere contas.
- **Estudos** (`/estudos` e backoffice): coberto por `INSTITUTIONAL` (mesma permissão de dados de entidade, início, menu).

## Permissões (`SitePermission`)

| Valor | Uso |
|-------|-----|
| `BLOG` | Blog público, categorias, `/app/.../blog` |
| `TRANSPARENCY` | Transparência, doações, despesas |
| `CONTACT_INBOX` | Mensagens de contacto |
| `ABOUT` | Página Sobre, equipa |
| `PROJECTS` | Página e CRUD de projetos |
| `INSTITUTIONAL` | Dados entidade, início, menu, estudos (`/app/institucional`, header, `/`, estudos) |

## Fluxos

### Feliz (OWNER cria colaborador)

1. Acede a `/app/usuarios`.
2. Indica e-mail, palavra-passe, papel (`MEMBER` com checkboxes de permissão ou `ADMIN` com acesso pleno) — `OWNER` no sistema continua a ter sempre todas as flags em código.
3. Sistema cria `auth` user, `UserProfile` e `TenantMember` no tenant público com permissões selecionadas.

### Acesso a área sem permissão

- **UI**: controlos de edição ocultos; experiência alinhada ao visitante.
- **Ações server**: rejeitam com erro de autorização; não confiar só na UI.

## Dados

- `TenantMember.permissions`: `SitePermission[]` (default `[]`).
- Migração: membros com `role = ADMIN` passam a ter **todas** as permissões no array; `MEMBER` mantém `[]` até edição.
- `OWNER`: interpretação de código — tratar como todas as flags ativas, independentemente do array.

## Não-objetivos

- Convites por e-mail.
- RLS no Postgres.
- Papel de OWNER atribuível via UI a novos membros (apenas criação com MEMBER/ADMIN e permissões).

## Critérios de aceite (testáveis)

- [ ] `POST`/actions com utilizador autenticado sem permissão para o recurso falham no servidor.
- [ ] Só `OWNER` ou `ADMIN` no tenant público conseguem abrir `/app/usuarios` e executar ações de gestão; `MEMBER` não.
- [ ] Páginas públicas mostram `canManage*` alinhado às permissões (e header/painel consistentes com “alguma permissão” quando relevante).
- [ ] Novos e antigos `ADMIN` têm acesso pleno a todas as áreas após migração.

## Referências

- `prisma/schema.prisma`, `src/lib/permissions/site-permissions.ts`, rotas `src/app/app/(backoffice)/`.
