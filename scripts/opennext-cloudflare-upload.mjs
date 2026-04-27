import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
if (r.status !== 0) process.exit(r.status ?? 1);

r = spawnSync("npx", ["opennextjs-cloudflare", "upload"], { cwd: root, stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
