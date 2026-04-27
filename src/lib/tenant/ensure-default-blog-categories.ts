import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

const DEFAULT: { slug: string; label: string }[] = [
  { slug: "acao_caridade", label: "Ação de caridade" },
  { slug: "evento", label: "Evento" },
  { slug: "geral", label: "Geral" },
];

/**
 * Garante as três categorias iniciais do blog (paridade com o antigo enum), para o tenant indicado.
 */
export async function ensureDefaultBlogCategories(
  tenantId: string,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? getPrisma();
  for (const { slug, label } of DEFAULT) {
    const exists = await db.blogPostCategory.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    if (!exists) {
      await db.blogPostCategory.create({ data: { tenantId, slug, label } });
    }
  }
}
