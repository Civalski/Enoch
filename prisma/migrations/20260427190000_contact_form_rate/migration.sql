-- CreateTable
CREATE TABLE "ContactFormRate" (
    "id" UUID NOT NULL,
    "ipKey" VARCHAR(64) NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactFormRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactFormRate_windowStart_idx" ON "ContactFormRate"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "ContactFormRate_ipKey_windowStart_key" ON "ContactFormRate"("ipKey", "windowStart");
