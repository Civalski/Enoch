-- Categorias de blog por tenant (substitui o enum fixo)

CREATE TABLE "BlogPostCategory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostCategory_pkey" PRIMARY KEY ("id")
);

-- Três categorias padrão por tenant (equivalente ao antigo enum)
INSERT INTO "BlogPostCategory" ("id", "tenantId", "slug", "label", "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    t."id",
    v.slug,
    v.label,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Tenant" t
CROSS JOIN (VALUES
    ('acao_caridade', 'Ação de caridade'),
    ('evento', 'Evento'),
    ('geral', 'Geral')
) AS v("slug", "label");

CREATE UNIQUE INDEX "BlogPostCategory_tenantId_slug_key" ON "BlogPostCategory"("tenantId", "slug");

CREATE INDEX "BlogPostCategory_tenantId_idx" ON "BlogPostCategory"("tenantId");

ALTER TABLE "BlogPostCategory" ADD CONSTRAINT "BlogPostCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Liga artigos existentes às linhas de categoria (slug = valor textual do enum)
ALTER TABLE "BlogPost" ADD COLUMN "categoryId" UUID;

UPDATE "BlogPost" bp
SET "categoryId" = c."id"
FROM "BlogPostCategory" c
WHERE c."tenantId" = bp."tenantId" AND c."slug" = bp."category"::text;

ALTER TABLE "BlogPost" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "BlogPost" DROP COLUMN "category";

ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogPostCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "BlogPost_categoryId_idx" ON "BlogPost"("categoryId");

DROP TYPE "BlogCategory";
