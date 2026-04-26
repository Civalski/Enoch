-- CreateTable
CREATE TABLE "AboutTeamMember" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "roleTitle" VARCHAR(200) NOT NULL,
    "imageUrl" VARCHAR(2000) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AboutTeamMember_tenantId_displayOrder_idx" ON "AboutTeamMember"("tenantId", "displayOrder");

-- AddForeignKey
ALTER TABLE "AboutTeamMember" ADD CONSTRAINT "AboutTeamMember_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
