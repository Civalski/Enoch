-- Header tagline (below org name) and /estudos page copy
ALTER TABLE "InstitutionalSiteContent" ADD COLUMN "headerTagline" VARCHAR(500);
ALTER TABLE "InstitutionalSiteContent" ADD COLUMN "estudosContent" JSONB;
