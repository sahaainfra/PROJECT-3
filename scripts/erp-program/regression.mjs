// Part 00 — regression harness (section 5.8, SA-19, CP-PGM-01/02/03).
// Runs: unit/design tests + DB integrity check + golden snapshot verification,
// and writes evidence to docs/erp-program/test-evidence/part-000/.
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";
const evidenceDir = join(root, "docs", "erp-program", "test-evidence", "part-000");
mkdirSync(evidenceDir, { recursive: true });

const results = [];
function step(name, cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: false, env: process.env });
  const output = `${r.stdout || ""}\n${r.stderr || ""}`.trim();
  results.push({
    name,
    command: `${cmd} ${args.join(" ")}`,
    status: r.status === 0 ? "PASS" : "FAIL",
    exit_code: r.status,
    output: output.slice(0, 8000),
    at: new Date().toISOString()
  });
  console.log(`  ${r.status === 0 ? "PASS" : "FAIL"}  ${name}`);
  if (output) console.log(output.split("\n").map((l) => `        ${l}`).join("\n"));
  return r.status === 0;
}

console.log("=== erp:regression — Part 00 program baseline ===");

// 1. Unit + design tests (flags evaluation, contrast, navigation lint, golden snapshots)
step("unit+design tests (vitest)", npmCmd, ["run", "test", "--", "--reporter=basic"]);
// 2. Design quality gates (DS-33)
step("design lint (DS-33)", "node", ["scripts/erp-program/lint-design.mjs"]);
// 3. DB integrity check (SA-19.3, CP-PGM-02)
step("db integrity check (CP-PGM-02)", "node", ["scripts/erp-program/db_integrity_check.mjs"]);
// 4. TypeScript compile check
step("typecheck", npmCmd, ["run", "typecheck"]);

const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.filter((r) => r.status === "FAIL").length;
const summary = {
  part: "000",
  at: new Date().toISOString(),
  git_commit: process.env.GIT_COMMIT || null,
  total: results.length,
  passed,
  failed,
  results
};
writeFileSync(join(evidenceDir, "regression-summary.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(`\nerp:regression: ${passed}/${results.length} PASS, ${failed} FAIL — evidence: docs/erp-program/test-evidence/part-000/regression-summary.json`);
process.exit(failed ? 1 : 0);
