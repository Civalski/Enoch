-- Textos da página /blog e rótulos do menu (overrides por href).
ALTER TABLE "InstitutionalSiteContent" ADD COLUMN "blogContent" JSONB;
ALTER TABLE "InstitutionalSiteContent" ADD COLUMN "headerNavLabels" JSONB;
