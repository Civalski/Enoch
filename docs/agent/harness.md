# Harness — ciclo de trabalho do agente

O harness é o **processo fixo** que reduz erros e escopo creep. Com a app **em produção**, o fluxo base divide-se em **duas trilhas**. Detalhe canónico: [`.cursor/rules/agent-core.mdc`](../../.cursor/rules/agent-core.mdc).

## Contexto prod

Priorizar segurança, performance **mensurável**, confiabilidade e mudanças reversíveis. Detalhes: [AGENTS.md](../../AGENTS.md).

## Trilha A — Manutenção, hardening, otimização, incidentes

Para segurança, performance, dependências, pequenos bugfixes ou ajustes técnicos sem nova feature.

1. **Entender** — impacto e blast radius; leitura dirigida aos ficheiros relevantes (não o repositório inteiro).
2. **Definir sucesso** — critério mensurável **ou** [security.md](security.md) para trabalho só de segurança; opcional baseline no PR/chat.
3. **Implementar** — mudanças mínimas; perfilar/medir antes de otimizar se o problema não for óbvio.
4. **Verificar** — testes/lint quando existirem; [security.md](security.md) quando tocar inputs, auth, headers, rotas públicas ou dependências.
5. **Parar** — sem refactors nem melhorias não pedidas.

**Spec (`docs/specs/`):** opcional para trabalho puramente técnico com aceite no PR/chat; obrigatória para comportamento visível, contrato de API ou dados sensíveis.

**TDD:** obrigatório onde a lógica for crítica; opcional para tweaks pontuais — ver [tdd.md](tdd.md).

## Trilha B — Nova funcionalidade ou mudança comportamental relevante

1. **Entender** — [AGENTS.md](../../AGENTS.md) + localizar ou criar spec em `docs/specs/`.
2. **Especificar** — comportamento feliz, erros, limites; critérios mensuráveis; não-objetivos.
3. **TDD** — red → green → refactor ([tdd.md](tdd.md)).
4. **Implementar** — mudanças mínimas ao spec/testes; **≤ 300 linhas** por ficheiro de código onde aplicável no projeto.
5. **Verificar** — testes, lint; [security.md](security.md).
6. **Parar.**

Detalhes de spec e template: [spec-driven.md](spec-driven.md).

## Checklist rápido antes de concluir

**Trilha A**

- [ ] Critério de sucesso (métricas ou segurança) claro — spec ou PR/chat.
- [ ] [security.md](security.md) revisto quando aplicável (inputs, auth, dependências novas…).
- [ ] Nenhum segredo no diff.
- [ ] Escopo não cresceu além do pedido.

**Trilha B**

- [ ] Spec atualizada/rastreável em `docs/specs/...` quando exigido.
- [ ] Testes cobrem critérios de aceite (ou exceção documentada em [tdd.md](tdd.md)).
- [ ] Nenhum segredo no diff; ficheiros novos dentro do limite de linhas do projeto onde aplicável.
- [ ] Escopo não cresceu além do pedido.

## Quando simplificar etapas

Só com **motivo explícito** na spec ou no chat (spike descartável, runner indisponível, hotfix urgente registrado). O padrão na Trilha B é **não pular**.
