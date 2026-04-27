/**
 * O motor Prisma WASM (`runtime = "cloudflare"`) funciona no Worker mas falha no Node
 * durante `npm run dev`. Este módulo altera temporariamente `prisma/schema.prisma`,
 * corre `prisma generate`, executa `main()` e repõe o cliente Node no `finally`.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(root, "prisma", "schema.prisma");

function readSchema() {
  return fs.readFileSync(schemaPath, "utf8");
}

function hasCloudflareRuntime(s) {
  return /^\s*runtime\s*=\s*"cloudflare"\s*$/m.test(s);
}

function insertCloudflareRuntime(s) {
  if (hasCloudflareRuntime(s)) return s;
  const next = s.replace(/(provider\s*=\s*"prisma-client"\s*\n)/, `$1  runtime  = "cloudflare"\n`);
  if (next === s) {
    throw new Error(
      "prisma-wasm-toggle: não foi possível inserir runtime cloudflare (esperado generator com provider prisma-client).",
    );
  }
  return next;
}

function runGenerate() {
  const r = spawnSync("npx", ["prisma", "generate"], { cwd: root, stdio: "inherit", shell: true });
  return r.status ?? 1;
}

/**
 * @param {() => number} main — deve devolver código de saída (0 = ok)
 * @returns {number}
 */
export function withCloudflarePrismaClient(main) {
  const orig = readSchema();
  let patched = false;
  try {
    const next = insertCloudflareRuntime(orig);
    if (next !== orig) {
      fs.writeFileSync(schemaPath, next);
      patched = true;
    }
    const g = runGenerate();
    if (g !== 0) return g;
    return main();
  } finally {
    if (patched) {
      fs.writeFileSync(schemaPath, orig);
      runGenerate();
    }
  }
}
