# Spec: estudos (materiais educacionais)

- **Status:** rascunho
- **Autor / data:** agente / 2026-04-26

## Objetivo

Página pública **Estudos** com materiais por categoria (artigos, livros, vídeos, material educacional), cada item com título, descrição opcional e ligação externa opcional; gestores institucionais gerem o conteúdo na base.

## Usuários e contexto

- **Visitante:** lê a lista em `/estudos` sem autenticação.
- **OWNER / ADMIN** do tenant institucional: cria, edita e remove itens em `/estudos/novo` e `/estudos/editar/[id]` (layout do site público, sem o painel `/app`), com as mesmas capacidades de gestão do restante site.

## Fluxos

### Fluxo principal (feliz)

1. Gestor cria um recurso com categoria, título, opcionalmente descrição e URL (ex. Google Drive).
2. A página pública agrupa e ordena os itens por categoria.
3. Visitante vê a secção; se houver `linkUrl`, abre a ligação num separador (noopener).

### Variantes e erros

- Tenant sem itens: secções vazias com mensagem discreta.
- `linkUrl` vazio: só texto, sem botão de ligação.
- Validação no servidor: URL inválida ou não `http`/`https` rejeitada.
- Acesso a editar de outro tenant: registo não encontrado / 403 lógica via `findFirst` com `tenantId`.

## Dados

- **Modelo** `StudyResource`: `id`, `tenantId`, `kind` (`artigo` | `livro` | `video` | `material_educacional`), `title` (obrigatório, limite 500), `description` (texto, opcional), `linkUrl` (opcional, max 2000, só http(s)), `displayOrder` (int).
- **Persistência:** PostgreSQL via Prisma; índice `(tenantId, kind, displayOrder)`.

## Não-objetivos

- Campo JSON `estudosContent` no primeiro milestone (títulos de hero e secções em código).
- Upload de ficheiros para armazenamento do site; apenas URLs externas.
- Submissão pública de materiais por visitantes.
- Sitemap ou SEO além de `metadata` básica na rota.

## Critérios de aceite (testáveis)

- [ ] O menu padrão inclui **Estudos** a apontar para `/estudos`.
- [ ] A página pública exibe quatro secções (rótulos em PT) e lista apenas recursos do tenant público.
- [ ] Cada item mostra título, descrição se existir, e ação de abrir ligação se `linkUrl` existir.
- [ ] OWNER/ADMIN cria, edita e apaga; MEMBER sem permissão de escrita é redirecionado.
- [ ] `linkUrl` com protocolo errado é rejeitada no servidor; string vazia é aceite.

## Notas TDD / dívida

- Runner: Vitest.
- Casos: função pura de validação/normalização de URL opcional.

## Referências

- Código: `prisma/schema.prisma`, `src/lib/study-data.ts`, `src/lib/study-url.ts`, `src/app/estudos/` (páginas + `app/app/estudos/actions.ts`), `src/lib/institutional-site/defaults.ts` (`DEFAULT_HEADER_NAV`).
