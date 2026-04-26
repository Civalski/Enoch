-- Campos opcionais de contacto / identificação no perfil de utilizador
ALTER TABLE "UserProfile" ADD COLUMN "contactEmail" VARCHAR(320);
ALTER TABLE "UserProfile" ADD COLUMN "phone" VARCHAR(32);
ALTER TABLE "UserProfile" ADD COLUMN "address" TEXT;
ALTER TABLE "UserProfile" ADD COLUMN "cpf" VARCHAR(11);
ALTER TABLE "UserProfile" ADD COLUMN "rg" VARCHAR(32);
ALTER TABLE "UserProfile" ADD COLUMN "description" TEXT;
