# Spec-driven development

A especificação é a **fonte da verdade** antes de código substancial. Isso melhora trabalho com IA: o agente (e humanos) alinha expectativas sem adivinhar.

## Onde vivem as specs

- Diretório: `docs/specs/`
- Nome sugerido: `docs/specs/<feature-slug>.md` ou `docs/specs/<feature-slug>/README.md` se a feature tiver vários artefatos.

## Quando escrever a spec

- **Antes** de criar endpoints, modelos de dados complexos ou fluxos multi-tela.
- **Ao mudar** comportamento visível ou contrato (API, formulário, permissões).

## Conteúdo mínimo

Use o template [templates/feature-spec.md](templates/feature-spec.md). Em resumo:

1. **Objetivo** — Uma frase clara.
2. **Personas / usuários** — Quem usa e com qual papel.
3. **Fluxos** — Passo a passo do uso feliz e variantes.
4. **Dados** — Entidades, campos, validações.
5. **Não-objetivos** — O que esta entrega **não** faz.
6. **Critérios de aceite** — Lista testável; cada item deve poder virar teste ou verificação manual guiada.

## Ligação com TDD

Cada critério de aceite deve mapear para:

- um teste automatizado, ou
- um caso no [templates/test-plan.md](templates/test-plan.md) com passos de verificação explícitos.

## Revisão

- Specs curtas vencem specs longas: prefira links para código ou diagramas só quando necessário.
- Se a implementação divergir da spec, **atualize a spec** ou reverta o código — não deixe os dois divergirem sem registro.

## Organização futura (quando o repo crescer)

- Agrupar por capability: `docs/specs/auth/`, `docs/specs/blog/`, etc.
- Manter uma linha no topo da spec: `Status: rascunho | revisada | implementada`.
