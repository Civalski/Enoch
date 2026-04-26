-- Default UUID para inserções manuais de números de série
ALTER TABLE "RegistrationSerial" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
