-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('acao_caridade', 'evento', 'geral');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "bodyMarkdown" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "category" "BlogCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_tenantId_slug_key" ON "BlogPost"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "BlogPost_tenantId_publishedAt_idx" ON "BlogPost"("tenantId", "publishedAt" DESC);

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
