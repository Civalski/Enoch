/**
 * Deploy direto com Wrangler (evita Miniflare no `opennextjs-cloudflare deploy`, que
 * costuma falhar no Windows com workerd 0xc0000005). OPEN_NEXT_DEPLOY evita que o
 * Wrangler reencaminhe de volta para o comando OpenNext.
 */
import { spawnSync } from "node:child_process";

process.env.OPEN_NEXT_DEPLOY = "true";
const passthrough = process.argv.slice(2);
const args = ["wrangler", "deploy", "--minify", ...passthrough];
const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});
process.exit(result.status ?? 1);
