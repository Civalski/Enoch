# Harness — ciclo de trabalho do agente

O harness é o **processo fixo** que reduz erros, escopo creep e código sem spec. Todo trabalho não trivial deve seguir este fluxo.

## Ciclo completo

### 1. Entender

- Ler [AGENTS.md](../../AGENTS.md).
- Localizar ou criar spec em `docs/specs/` para a feature.
- Identificar arquivos tocados **antes** de editar (leitura dirigida, não o repo inteiro).

### 2. Especificar

- Completar ou atualizar a spec: comportamento feliz, erros, limites, dados.
- Critérios de aceite **mensuráveis** (dados de entrada/saída, status HTTP, mensagens).
- Registrar **não-objetivos** explicitamente.

### 3. Testar primeiro (TDD)

- Escrever testes que falham e cubram os critérios de aceite.
- Ordem: red → green → refactor.
- Exceções: ver [tdd.md](tdd.md).

### 4. Implementar

- Mudanças **mínimas** para satisfazer o spec e os testes.
- Respeitar **≤ 300 linhas** por arquivo de código-fonte; extrair antes de estourar.
- Não misturar features não relacionadas no mesmo PR/commit lógico.

### 5. Verificar

- Rodar testes e lint (quando existirem no projeto).
- Passar pelo checklist resumido em [security.md](security.md) (segredos, inputs, dependências).

### 6. Parar

- Não adicionar “melhorias” não pedidas.
- Não refatorar arquivos só por estética fora do escopo.

## Checklist rápido antes de concluir uma tarefa

- [ ] Spec atualizada e rastreável (`docs/specs/...`).
- [ ] Testes cobrem critérios de aceite (ou exceção documentada em `tdd.md`).
- [ ] Nenhum segredo no diff.
- [ ] Arquivos novos respeitam limite de linhas ou foram fatiados.
- [ ] Escopo não cresceu além do pedido.

## Quando pular etapas

Só com **motivo explícito** na spec ou no chat (ex.: spike descartável, ausência temporária de runner de testes). O padrão é **não pular**.
