# Segurança no desenvolvimento com IA

IA acelera código, mas **amplifica** riscos se não houver disciplina. Este documento fixa linhas vermelhas e checagens.

## Segredos e configuração

- **Nunca** commitar: API keys, tokens OAuth, senhas, chaves privadas, connection strings com credencial.
- Usar variáveis de ambiente; arquivos `.env` no `.gitignore` (configuração só na máquina/CI, sem arquivo de exemplo versionado).
- Rotacionar credenciais se houver vazamento acidental.

## Dependências (supply chain)

- Preferir pacotes **mantidos** e amplamente usados.
- Ao adicionar dependência sugerida por IA: verificar última versão, licença e issues de segurança óbvias.
- Evitar instalar pacotes por nome ambíguo ou typo-squatting.

## Entrada e APIs

- Validar e sanitizar **toda** entrada em limites HTTP, actions e filas.
- Assumir dados hostis: rate limit, tamanho máximo de payload, tipos corretos.
- Erros para o cliente: mensagens úteis **sem** vazar stack interno ou dados de outros usuários.

## Autenticação e autorização (quando existirem)

- Checar **sessão** e **papel** em toda rota ou action sensível.
- Princípio do menor privilégio para tokens de CI/CD e bots.

## O que não fazer

- Desabilitar ESLint, CSP, checagens de tipo ou auditoria **só** para verde no CI — só com decisão registrada na spec e revisão humana.
- Copiar snippets que executam `eval`, injeção SQL dinâmica sem binding, ou `dangerouslySetInnerHTML` sem sanitização consciente.

## Checklist antes de merge (tarefa sensível)

- [ ] Nenhum segredo no diff nem em histórico recente desta branch.
- [ ] Inputs validados nos novos pontos de entrada.
- [ ] Dependências novas justificadas e minimizadas.
- [ ] Erros não expõem dados internos.
- [ ] Permissões revisadas se houve mudança de rota/API.

## Incidentes

- Se segredo vazar: revogar imediatamente, remover do git (e considerar `git filter-repo` / suporte do host); trocar credenciais.
