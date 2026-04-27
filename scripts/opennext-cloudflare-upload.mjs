import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withCloudflarePrismaClient } from "./prisma-wasm-toggle.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const code = withCloudflarePrismaClient(() => {
  let r = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) return r.status ?? 1;
  r = spawnSync("npx", ["opennextjs-cloudflare", "upload"], { cwd: root, stdio: "inherit", shell: true });
  return r.status ?? 1;
});

process.exit(code);
