-- CreateEnum
CREATE TYPE "SitePermission" AS ENUM ('BLOG', 'TRANSPARENCY', 'CONTACT_INBOX', 'ABOUT', 'PROJECTS', 'INSTITUTIONAL');

-- AlterTable
ALTER TABLE "TenantMember" ADD COLUMN     "permissions" "SitePermission"[] DEFAULT ARRAY[]::"SitePermission"[];

-- Membros ADMIN existentes mantêm acesso total (equivalente ao comportamento anterior).
UPDATE "TenantMember"
SET "permissions" = ARRAY['BLOG', 'TRANSPARENCY', 'CONTACT_INBOX', 'ABOUT', 'PROJECTS', 'INSTITUTIONAL']::"SitePermission"[]
WHERE "role" = 'ADMIN';
