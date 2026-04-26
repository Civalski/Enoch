# Spec: mensagens de contacto (público → administrador)

- **Status:** implementada
- **Autor / data:** agente / 2026-04-25

## Objetivo

Guardar pedidos do formulário público de contacto na base e permitir que administradores do tenant institucional (mesma regra do blog) vejam e marquem como lidas numa caixa de mensagens em `/app/contato`.

## Usuários e contexto

- **Visitante sem login:** submete o formulário em `/contato`.
- **Administrador:** utilizador com papel OWNER ou ADMIN no tenant cujo `slug` coincide com o tenant público do blog (`BLOG_TENANT_SLUG` ou tenant único na base).

## Fluxos

### Fluxo principal

1. Visitante preenche e envia o formulário.
2. O servidor valida, resolve o `tenantId` institucional e grava `ContactMessage`.
3. Administrador abre `/app/contato`, vê a lista e o detalhe; pode marcar como lida.

### Erros

- Tenant público não resolvido: o envio falha com mensagem clara.
- Payload inválido: validação devolve erro sem gravar.
- Utilizador sem permissão acede a `/app/contato`: redireciona para `/contato`.

## Dados

- `ContactMessage`: `tenantId`, `name`, `email`, `phone?`, `subject`, `body`, `createdAt`, `readAt?`.
- Validação: limites de comprimento (nome, email, telefone, corpo); `subject` ∈ valores do formulário.

## Não-objetivos

- Envio de e-mail/SMTP ou notificações push.
- Respostas em thread dentro da aplicação.
- Rate limiting avançado (pode ser iteração futura).

## Critérios de aceite (testáveis)

- [x] Submissão válida cria registo associado ao tenant público.
- [x] Submissão sem tenant público disponível não grava.
- [x] Apenas gestor institucional vê a lista; outros são redirecionados.
- [x] Validação rejeita nome vazio, email inválido, assunto fora do conjunto, corpo fora do limite.

## Referências

- Código: `prisma/schema.prisma`, `src/lib/contact/`, `src/app/contato/actions.ts`, `src/app/app/contato/`, `src/components/app/ContactInbox*`, `src/components/site/ContactForm.tsx`, `src/lib/blog-data.ts` (capability).
