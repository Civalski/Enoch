# agents.md

Instruções canônicas: **[AGENTS.md](AGENTS.md)**. Não duplique conteúdo entre estes dois ficheiros.

**Fase:** a aplicação web está **em produção** e estável. O agente deve **priorizar** integridade dos dados e dos utilizadores, **segurança**, performance **mensurável**, observabilidade e custos operacionais; preferir mudanças **pequenas e reversíveis** e evitar refactors amplos ou expansão de escopo não pedida.

Regras operacionais detalhadas (harness em duas trilhas, Prisma/migrações, spec/TDD condicional, MCP, segurança): **[`.cursor/rules/agent-core.mdc`](.cursor/rules/agent-core.mdc)**.
