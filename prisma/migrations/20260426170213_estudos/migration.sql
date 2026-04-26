-- CreateEnum
CREATE TYPE "StudyResourceKind" AS ENUM ('artigo', 'livro', 'video', 'material_educacional');

-- CreateTable
CREATE TABLE "StudyResource" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "kind" "StudyResourceKind" NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "linkUrl" VARCHAR(2000),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyResource_tenantId_kind_displayOrder_idx" ON "StudyResource"("tenantId", "kind", "displayOrder");

-- AddForeignKey
ALTER TABLE "StudyResource" ADD CONSTRAINT "StudyResource_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
