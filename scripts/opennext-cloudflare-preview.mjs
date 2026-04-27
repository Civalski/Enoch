import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(root, "prisma", "schema.prisma");
const orig = fs.readFileSync(schemaPath, "utf8");
let patched = false;

function restore() {
  if (!patched) return;
  fs.writeFileSync(schemaPath, orig);
  spawnSync("npx", ["prisma", "generate"], { cwd: root, stdio: "inherit", shell: true });
}

try {
  if (!/^\s*runtime\s*=\s*"cloudflare"\s*$/m.test(orig)) {
    const next = orig.replace(/(provider\s*=\s*"prisma-client"\s*\n)/, `$1  runtime  = "cloudflare"\n`);
    if (next === orig) throw new Error("patch schema falhou");
    fs.writeFileSync(schemaPath, next);
    patched = true;
  }
  let r = spawnSync("npx", ["prisma", "generate"], { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) {
    restore();
    process.exit(r.status ?? 1);
  }
  r = spawnSync("npx", ["opennextjs-cloudflare", "build"], { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) {
    restore();
    process.exit(r.status ?? 1);
  }
} catch (e) {
  restore();
  console.error(e);
  process.exit(1);
}

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

child.on("exit", (c) => {
  restore();
  process.exit(c ?? 0);
});
