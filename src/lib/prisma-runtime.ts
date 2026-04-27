import { createRequire } from "node:module";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const require = createRequire(import.meta.url);

export type PrismaClientModule = typeof import("@prisma/client");

let prismaModuleCache: PrismaClientModule | null = null;

/**
 * - **Node** (`next dev`, `next build`, SSG): `@prisma/client` + `runtime/client.js` + adapter (sem engine binary).
 * - **workerd** (pedido real no Worker): `@prisma/client/wasm` evita `fs` de `runtime/client.js`.
 *
 * `getCloudflareContext()` falha fora do runtime OpenNext/Worker; nesse caso usamos o entry Node.
 */
export function getPrismaClientModule(): PrismaClientModule {
  if (prismaModuleCache) return prismaModuleCache;
  try {
    getCloudflareContext();
    prismaModuleCache = require("@prisma/client/wasm") as PrismaClientModule;
  } catch {
    prismaModuleCache = require("@prisma/client") as PrismaClientModule;
  }
  return prismaModuleCache;
}
