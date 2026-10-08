import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const repositoryRoot = process.cwd();
const evidenceDirectory = path.join(
  repositoryRoot,
  "docs",
  "erp-program",
  "test-evidence",
  "part-000",
  "runs",
);

const checks = [
  ["unit tests", ["run", "test"]],
  ["lint", ["run", "lint"]],
  ["typecheck", ["run", "typecheck"]],
  ["production build", ["run", "build"]],
] as const;

const startedAt = new Date();
const results = checks.map(([name, args]) => {
  const started = Date.now();
  const npmCli = process.env.npm_execpath;
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, ...args], {
        cwd: repositoryRoot,
        encoding: "utf8",
        shell: false,
      })
    : null;

  if (!result) {
    process.stderr.write(`${name} could not start: npm_execpath is unavailable.\n`);
  } else if (result.error) {
    process.stderr.write(`${name} could not start: ${result.error.message}\n`);
  } else {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  return {
    name,
    exitCode: result?.status ?? 1,
    durationMs: Date.now() - started,
    status: result?.status === 0 ? "PASS" : "FAIL",
  };
});

let commit: string | null = null;
let gitError: string | null = null;
try {
  commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch (error) {
  gitError = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Git commit could not be recorded: ${gitError}\n`);
}

let workingTreeStatus: string[] | null = null;
let gitStatusError: string | null = null;
try {
  const status = execFileSync(
    "git",
    ["status", "--porcelain", "--untracked-files=all"],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    },
  ).trim();
  workingTreeStatus = status ? status.split(/\r?\n/) : [];
} catch (error) {
  gitStatusError = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Git worktree status could not be recorded: ${gitStatusError}\n`);
}

const report = {
  part: "000",
  startedAt: startedAt.toISOString(),
  completedAt: new Date().toISOString(),
  commit,
  gitError,
  workingTreeClean: workingTreeStatus?.length === 0,
  workingTreeStatus,
  gitStatusError,
  scope: "Source checks only; this is not the complete Part 00 approval gate.",
  checks: results,
  notRun: [
    "Database schema/data checksum comparison",
    "Database backup and restore rehearsal",
    "Browser end-to-end and authorization tests",
    "Business report/export golden comparison",
    "Part 03 quality-gate revalidation",
    "Technical-lead and independent-review approval",
  ],
  status: results.every((result) => result.exitCode === 0) ? "PASS" : "FAIL",
};

mkdirSync(evidenceDirectory, { recursive: true });
const filename = `source-checks-${startedAt
  .toISOString()
  .replace(/[:.]/g, "-")}.json`;
writeFileSync(
  path.join(evidenceDirectory, filename),
  `${JSON.stringify(report, null, 2)}\n`,
  { encoding: "utf8", flag: "wx" },
);

console.info(
  `Part 00 source checks: ${report.status}. Evidence: ${path.relative(
    repositoryRoot,
    path.join(evidenceDirectory, filename),
  )}`,
);
if (report.status !== "PASS") process.exitCode = 1;
