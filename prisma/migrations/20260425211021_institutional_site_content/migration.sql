-- CreateTable
CREATE TABLE "InstitutionalSiteContent" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "orgName" VARCHAR(200),
    "footerTagline" TEXT,
    "contactEmail" VARCHAR(320),
    "contactPhone" VARCHAR(120),
    "address" TEXT,
    "facebookUrl" VARCHAR(2000),
    "instagramUrl" VARCHAR(2000),
    "whatsappUrl" VARCHAR(2000),
    "mapEmbedUrl" VARCHAR(4000),
    "copyrightLine" VARCHAR(500),
    "logoUrl" VARCHAR(2000),
    "homeContent" JSONB,
    "aboutContent" JSONB,
    "contatoContent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionalSiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionalSiteContent_tenantId_key" ON "InstitutionalSiteContent"("tenantId");

-- AddForeignKey
ALTER TABLE "InstitutionalSiteContent" ADD CONSTRAINT "InstitutionalSiteContent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
