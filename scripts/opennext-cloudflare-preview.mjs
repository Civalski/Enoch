import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], { cwd: root, stdio: "inherit", shell: true });
if (r.status !== 0) process.exit(r.status ?? 1);

const child = spawn("npx", ["opennextjs-cloudflare", "preview"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

function shutdown() {
  child.kill("SIGINT");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

child.on("exit", (c) => process.exit(c ?? 0));
