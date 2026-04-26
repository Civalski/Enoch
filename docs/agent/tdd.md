# TDD (Test-Driven Development)

Política do repositório: **testes antes da implementação** para lógica nova, sempre que houver runner disponível.

## Ciclo red → green → refactor

1. **Red** — Escrever um teste que descreve o comportamento desejado; deve **falhar**.
2. **Green** — Implementar o mínimo para o teste passar.
3. **Refactor** — Melhorar código mantendo os testes verdes.

## Pirâmide de testes

- **Unitários** — Funções puras, helpers, validações; rápidos, sem rede.
- **Integração** — Módulos reais juntos (ex.: handler + validação); podem usar banco ou mocks conscientes.
- **E2E** — Poucos, fluxos críticos; mais lentos e frágeis — usar com parcimônia.

Priorize **muitos unitários**, **alguns de integração**, **poucos E2E**.

## Nomenclatura

- Nome do teste descreve comportamento: `deve rejeitar email inválido`, não `test1`.
- Agrupe por módulo ou feature espelhando `src/` ou `docs/specs/`.

## Astro / front

- Lógica em **TypeScript** (`.ts`) deve ser testável sem browser quando possível.
- Componentes visuais: priorizar testes de lógica extraída; testes de UI completos quando o projeto adotar ferramenta (ex.: Testing Library) — registrar na spec se ainda não existir infraestrutura.

## Exceções ao TDD estrito (documentar)

- **Spike** descartável: código pode ser sem testes se a spec marcar `Spike — será descartado ou reescrito com TDD`.
- **Ausência temporária de runner**: usar [templates/test-plan.md](templates/test-plan.md) como evidência manual até haver `npm test`; a spec deve citar essa dívida.

## Stack futura sugerida

Quando o projeto adicionar testes automatizados, **Vitest** costuma integrar bem com Astro/TS. Passos típicos (não obrigatórios até decisão da equipe):

- `npm add -D vitest`
- Script `test` no `package.json`
- Arquivos `*.test.ts` junto ao código ou em `__tests__/`

Até lá, mantenha **planos de teste** em Markdown alinhados ao spec.

## Definição de pronto

- Critérios de aceite da spec têm cobertura automatizada **ou** plano manual rastreado com data/responsável na spec.
