/**
 * Gera cliente Prisma WASM, `opennextjs-cloudflare build`, `wrangler deploy`, repõe cliente Node.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withCloudflarePrismaClient } from "./prisma-wasm-toggle.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const passthrough = process.argv.slice(2);

const code = withCloudflarePrismaClient(() => {
  let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) return r.status ?? 1;

  process.env.OPEN_NEXT_DEPLOY = "true";
  r = spawnSync("npx", ["wrangler", "deploy", "--minify", ...passthrough], {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  return r.status ?? 1;
});

process.exit(code);
