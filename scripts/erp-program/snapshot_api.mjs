// Part 00 — API response snapshot tool (section 5.5, characterisation tests).
// Stores API response snapshots for existing endpoints on a frozen test dataset.
// Baseline snapshot: GET <base>/api/health and GET <base>/api/flags.
// Usage: node scripts/erp-program/snapshot_api.mjs [baseUrl]
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const base = process.argv[2] || "http://localhost:3000";
const snapshotDir = join(root, "docs", "erp-program", "test-evidence", "part-000", "api-snapshots");
mkdirSync(snapshotDir, { recursive: true });

const endpoints = ["/api/health", "/api/flags"];

async function main() {
  let reachable = true;
  try {
    await fetch(`${base}/api/health`);
  } catch {
    reachable = false;
  }
  if (!reachable) {
    console.warn(`WARN: application not reachable at ${base} — start it with \`npm run dev\` first.`);
    process.exit(0);
  }
  const summary = [];
  for (const ep of endpoints) {
    const res = await fetch(`${base}${ep}`);
    const body = await res.text();
    const hash = crypto.createHash("sha256").update(body, "utf8").digest("hex");
    const name = ep.replace(/\//g, "_") || "root";
    writeFileSync(join(snapshotDir, `${name}.json`), body, "utf8");
    summary.push({ endpoint: ep, status: res.status, sha256: hash });
    console.log(`  snapshotted ${ep} (status ${res.status}, sha256 ${hash.slice(0, 12)}…)`);
  }
  writeFileSync(join(snapshotDir, "snapshots.json"), JSON.stringify({ captured_at: new Date().toISOString(), base, endpoints: summary }, null, 2), "utf8");
  console.log("api snapshots written to docs/erp-program/test-evidence/part-000/api-snapshots/");
}

main();
