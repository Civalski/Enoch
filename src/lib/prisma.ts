import "server-only";

import { cache } from "react";
import { createPrismaClient } from "@/lib/prisma-factory";

/**
 * Prisma por pedido (React `cache`), como em
 * https://opennext.js.org/cloudflare/howtos/db#postgresql — evita reutilizar a mesma
 * ligação/pool entre pedidos no Cloudflare Workers.
 */
export const getPrisma = cache(createPrismaClient);

export { createPrismaClient } from "@/lib/prisma-factory";
