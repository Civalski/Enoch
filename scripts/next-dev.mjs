import { spawn, execSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextCli = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");

const SWEEP_MIN = 3000;
const SWEEP_MAX = 3010;

function parseDevPort(argv) {
  const envPort = process.env.PORT;
  if (envPort && /^\d+$/.test(envPort)) {
    return parseInt(envPort, 10);
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-p" || a === "--port") {
      const v = argv[i + 1];
      if (v && /^\d+$/.test(v)) {
        return parseInt(v, 10);
      }
    }
    const m = /^--port=(\d+)$/.exec(a);
    if (m) {
      return parseInt(m[1], 10);
    }
  }
  return 3000;
}

function portsToSweep(primaryPort) {
  const set = new Set();
  for (let p = SWEEP_MIN; p <= SWEEP_MAX; p++) {
    set.add(p);
  }
  if (Number.isInteger(primaryPort) && primaryPort > 0 && primaryPort <= 65535) {
    set.add(primaryPort);
  }
  return [...set].sort((a, b) => a - b);
}

function killNodeListenersWindows(ports) {
  const myPid = process.pid;
  const portCsv = ports.join(",");
  const script = `
$myPid = ${myPid}
foreach ($port in @(${portCsv})) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Where-Object { $_.State -eq 'Listen' -and $_.OwningProcess -ne $myPid } |
    ForEach-Object {
      $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
      if ($null -ne $proc -and $proc.ProcessName -eq 'node') {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
      }
    }
}
`.trim();

  try {
    execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script], {
      stdio: "ignore",
      windowsHide: true,
    });
  } catch {
    // Get-NetTCPConnection / Stop-Process may exit non-zero; ignore
  }
}

function killListenersUnix(ports) {
  const myPid = process.pid;
  for (const port of ports) {
    try {
      const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
      if (!out) {
        continue;
      }
      for (const line of out.split(/\n/)) {
        const pid = parseInt(line.trim(), 10);
        if (Number.isInteger(pid) && pid !== myPid) {
          try {
            process.kill(pid, "SIGTERM");
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      /* no listener or lsof missing */
    }
  }
}

function freeDevPorts() {
  if (process.env.NEXT_DEV_NO_KILL_PORTS === "1") {
    return;
  }
  const argv = process.argv.slice(2);
  const primary = parseDevPort(argv);
  const ports = portsToSweep(primary);
  if (process.platform === "win32") {
    killNodeListenersWindows(ports);
  } else {
    killListenersUnix(ports);
  }
}

// Miniflare/workerd often crashes on Windows (0xc0000005) when starting the local
// Workers runtime. Skip the Wrangler platform proxy unless explicitly disabled.
if (
  process.platform === "win32" &&
  process.env.OPENNEXT_SKIP_MINIFLARE === undefined
) {
  process.env.OPENNEXT_SKIP_MINIFLARE = "1";
}

freeDevPorts();

const child = spawn(process.execPath, [nextCli, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  cwd: repoRoot,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
