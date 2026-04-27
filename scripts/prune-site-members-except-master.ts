/**
 * Apaga, no tenant do site público, todos os membros exceto o principal (SIMPLE_AUTH_USER_ID).
 * Remove o perfil Prisma e a conta no Supabase Auth se o utilizador deixar de ter memberships.
 * Uso: npx tsx scripts/prune-site-members-except-master.ts
 */
import "dotenv/config";
import { createPrismaClient } from "../src/lib/prisma-factory";
import { getSimpleAuthUserId } from "../src/lib/auth/simple-session";
import { resolvePublicBlogTenant } from "../src/lib/blog-data";
import { createSupabaseAdminClient } from "../src/utils/supabase/admin";

async function main() {
  const prisma = createPrismaClient();
  try {
  const masterId = getSimpleAuthUserId();
  const publicT = await resolvePublicBlogTenant();
  if (!publicT) {
    console.error(
      "Não foi possível resolver o tenant do site público. Defina BLOG_TENANT_SLUG ou use uma base com um único tenant.",
    );
    await prisma.$disconnect();
    process.exit(1);
  }
  const members = await prisma.tenantMember.findMany({
    where: { tenantId: publicT.id, NOT: { userId: masterId } },
    select: { id: true, userId: true, role: true },
  });
  if (members.length === 0) {
    console.log("Nada a remover: no site público só existe o membro principal (master).");
    return;
  }
  console.log(
    "A remover",
    members.length,
    "membro(s) — ids:",
    members.map((m) => `${m.userId} (${m.role})`).join(", "),
  );
  for (const m of members) {
    await prisma.tenantMember.delete({ where: { id: m.id } });
    const remaining = await prisma.tenantMember.count({ where: { userId: m.userId } });
    if (remaining === 0) {
      await prisma.userProfile.deleteMany({ where: { id: m.userId } });
      try {
        const admin = createSupabaseAdminClient();
        const { error } = await admin.auth.admin.deleteUser(m.userId);
        if (error) {
          console.warn("  Supabase auth:", m.userId, error.message);
        } else {
          console.log("  Removido Supabase Auth:", m.userId);
        }
      } catch (e) {
        console.warn("  Supabase (ignorar se sem chave de serviço):", m.userId, e);
      }
    }
  }
  console.log("Concluído.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
