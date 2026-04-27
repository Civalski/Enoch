/**
 * `opennextjs-cloudflare build`, `wrangler deploy`, repõe artefactos.
 * (Com Prisma 6 + `prisma-client-js` já não é preciso alternar `runtime = "cloudflare"` no schema.)
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const passthrough = process.argv.slice(2);

let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
if (r.status !== 0) process.exit(r.status ?? 1);

process.env.OPEN_NEXT_DEPLOY = "true";
r = spawnSync("npx", ["wrangler", "deploy", ...passthrough], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(r.status ?? 1);
