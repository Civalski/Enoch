/**
 * Selects the correct Prisma client module for the current runtime:
 *
 * - **workerd** (Cloudflare Worker): `@prisma/client/wasm` — avoids `fs.readdir`
 *   and native engine probes that don't exist in the Workers runtime.
 * - **Node** (`next dev`, `next build`, SSG): `@prisma/client` — uses the
 *   standard Node entry with driver-adapter support.
 *
 * The previous approach using `getCloudflareContext()` + `createRequire` did NOT
 * work with the OpenNext bundler because esbuild statically resolves both
 * `require()` branches and embeds the Node module (with `fs.readdir`) in the
 * Worker bundle.  Checking `navigator.userAgent` is the reliable way to detect
 * the workerd runtime at runtime without importing heavy modules.
 */

export type PrismaClientModule = typeof import("@prisma/client");

let prismaModuleCache: PrismaClientModule | null = null;

export function getPrismaClientModule(): PrismaClientModule {
  if (prismaModuleCache) return prismaModuleCache;

  // workerd (Cloudflare Workers runtime) sets navigator.userAgent to "Cloudflare-Workers".
  // This check is lightweight and doesn't depend on OpenNext internals.
  const isWorkerd =
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers";

  if (isWorkerd) {
    // Dynamic import path is opaque to esbuild, so only the wasm entry is loaded.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    prismaModuleCache = require("@prisma/client/wasm") as PrismaClientModule;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    prismaModuleCache = require("@prisma/client") as PrismaClientModule;
  }

  return prismaModuleCache;
}
