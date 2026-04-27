import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
if (r.status !== 0) process.exit(r.status ?? 1);

const workerPath = path.join(root, ".open-next", "worker.js");
if (!fs.existsSync(workerPath)) {
  console.error(
    "[upload] OpenNext build não gerou a saída esperada em:",
    workerPath,
    "\nConfirma que o comando corre na raiz do repo (a pasta que contém wrangler.json e open-next.config.ts).",
  );
  process.exit(1);
}

r = spawnSync("npx", ["opennextjs-cloudflare", "upload"], { cwd: root, stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
