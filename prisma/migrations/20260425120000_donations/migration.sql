-- CreateTable
CREATE TABLE "Donation" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "donorName" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "donatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Donation_tenantId_donatedAt_idx" ON "Donation"("tenantId", "donatedAt" DESC);

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
