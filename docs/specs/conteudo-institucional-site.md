# Spec: Conteúdo institucional do site (auto-gerido)

- **Status:** implementada (entrega: modelo Prisma, merge + defaults, `/app/institucional`, footer e páginas públicas)
- **Autor / data:** agente / 2026-04-25

## Objetivo

Permitir que **OWNER/ADMIN** do **tenant público** do site (mesmo usado no blog) editem textos, contactos, redes sociais, mapa e blocos de início/sobre/contato **sem alterar código**; visitantes veem o conteúdo na hora (após `revalidatePath` / páginas dinâmicas).

## Usuários e contexto

- **Quem edita:** utilizador com sessão, papel `OWNER` ou `ADMIN` no tenant cujo `slug` coincide com o tenant resolvido por `BLOG_TENANT_SLUG` (ou único tenant).
- **Quem lê:** qualquer visitante; fallback para o texto e dados que estavam no código quando não há registo na base.

## Dados (Prisma)

- `InstitutionalSiteContent` — 1:1 com `Tenant` (`tenantId` único).
- Campos escalares: identidade/rodapé, contacto, URLs de redes, mapa, copyright, `logoUrl`.
- JSON versionado em memória (`homeContent`, `aboutContent`, `contatoContent`) com merge sobre defaults (ver tipos em `src/lib/institutional-site/types.ts`).

## Validações

- Tamanhos máximos alinhados ao schema; URLs opcionais (vazio ou `http(s)://`); JSON validado e saneado (apenas chaves conhecidas, profundidade limitada).

## Não-objetivos

- i18n, editor WYSIWYG, gestão de toda a secção de doações/PIX em `/contato` (pode ser entrega futura).
- RLS adicional fora do Prisma; upload de ficheiros novo (há upload de blog à parte).

## Critérios de aceite (testáveis)

- [x] Com registo vazio, o site mantém a aparência e textos de antes (defaults no código).
- [x] Após gravação, rodapé, início, sobre e o hero + meta do contato podem mostrar os valores editados.
- [x] Utilizador sem papel ou de outro tenant **não** consegue gravar (`requirePublicInstitutionalWriter` na action).

## Referências

- Código: `src/lib/institutional-site/` (defaults, merge, `public.ts`, `writer-auth.ts`), `src/app/app/institucional/` (página, `actions.ts`, `form-parse.ts`), `src/components/site/SiteFooter.tsx`, `HomePagePublic.tsx`, `SobrePagePublic.tsx`, `prisma/schema.prisma`, migração `prisma/migrations/*institutional_site_content*`
- Resolução do tenant: `src/lib/blog-data.ts` — `resolvePublicBlogTenant()`
- Testes: `src/lib/institutional-site/merge.test.ts`, `src/app/app/institucional/form-parse.test.ts`
