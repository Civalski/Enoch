# Uso de MCP (Model Context Protocol)

MCP complementa o código do repositório com **documentação oficial**, **bindings** e **observabilidade** — especialmente para **Cloudflare** neste workspace.

## Antes de chamar qualquer tool

1. Localizar o descriptor do tool em `mcps/<nome-do-servidor>/tools/<tool>.json` (ou estrutura equivalente no projeto Cursor).
2. Ler **parâmetros obrigatórios**, tipos e descrições.
3. Formular **uma** chamada com contexto suficiente (evita gastar tokens e rodadas com erros 400).

## Servidores úteis neste ambiente

Conforme configuração do projeto, costumam existir servidores como:

- Documentação Cloudflare
- Bindings Cloudflare
- Observabilidade / builds Cloudflare

Use-os quando a tarefa envolver **Workers**, **Wrangler**, **KV/R2/D1**, **deploy** ou **APIs** documentadas na plataforma.

## Quando usar MCP vs ler o repo

| Situação | Preferir |
|----------|----------|
| Comportamento deste app, paths, convenções | Código e [AGENTS.md](../../AGENTS.md) |
| Sintaxe atual de produto Cloudflare, limites de runtime | MCP docs / bindings |
| Depuração de erro em produção (logs, métricas) | MCP observability (se disponível e autenticado) |

## Equilíbrio tokens × precisão

- **Precisão:** inclua na query versão do produto, binding, trecho de erro e o que já foi tentado.
- **Tokens:** evite encadear muitas chamadas vagas; consolide perguntas.

## Segurança

- Não colar **segredos** em prompts ou argumentos de tool se o servidor puder logar.
- Autenticar MCP só quando necessário e em ambiente controlado.

## Falhas

- Se o tool falhar, registrar o erro **sem** supor comportamento da plataforma; corrigir parâmetros ou cair para documentação oficial verificada.
