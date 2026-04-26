-- CreateEnum
CREATE TYPE "TransparencyExpenseCategory" AS ENUM ('assistencia_social', 'projetos_educacionais', 'acoes_saude', 'infraestrutura');

-- CreateTable
CREATE TABLE "TransparencyExpense" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "category" "TransparencyExpenseCategory" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "spentAt" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransparencyExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransparencyExpense_tenantId_spentAt_idx" ON "TransparencyExpense"("tenantId", "spentAt" DESC);

-- AddForeignKey
ALTER TABLE "TransparencyExpense" ADD CONSTRAINT "TransparencyExpense_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
