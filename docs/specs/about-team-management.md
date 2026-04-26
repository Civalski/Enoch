# Spec: gestão da equipa em /sobre

- **Status:** implementada
- **Autor / data:** agente, 2026-04-25

## Objetivo

Permitir que administradores (OWNER/ADMIN) do tenant público do site registem, editem e removam membros da secção "Nossa Equipe" na página pública Sobre, persistindo em PostgreSQL.

## Usuários e contexto

- **Administrador** com sessão ativa, papel OWNER ou ADMIN no mesmo tenant resolvido por `BLOG_TENANT_SLUG` (ou único tenant).
- Visitantes: apenas leitura da lista vinda da base (ou estado vazio com mensagem sucinta).

## Dados

- `AboutTeamMember`: `tenantId`, `name`, `roleTitle` (cargo), `imageUrl`, timestamps; ordem na listagem pública por data de criação.
- Validação: tamanhos alinhados (nome/cargo 200, URL 2000).

## Não-objetivos

- Upload de imagens (apenas URL).
- Página de gestão separada em /app; CRUD fica em /sobre para quem tem permissão.

## Critérios de aceite

- [ ] Visitante vê a lista pública (ou vazio) sem controlos.
- [ ] Admin vê ações de criar, editar e eliminar; alterações revalidam /sobre.
- [ ] Validação de campos rejeita entradas vazias ou fora do limite.

## Segurança

- Ações de escrita: `requireWriterTenant` (mesmo padrão que projetos) e `tenantId` do registo a coincidir com o ativo.
