-- RLS: o acesso de aplicação é via Prisma/connection string; a API pública do Supabase não deve ler/escrever esta tabela.
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
