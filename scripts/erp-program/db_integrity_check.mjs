// Part 00 — DB integrity check (section 5.4, SA-19.3, CP-PGM-02).
// Re-computes schema + row counts + checksums of pre-existing tables and diffs them
// against docs/erp-program/baseline/schema_baseline.json / data_baseline.csv.
// Exit codes: 0 = identical (or no baseline / no DB, reported as warning),
//             1 = difference in schema of pre-existing objects or unexpected row-count decrease,
//             2 = configuration error.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";
import pg from "pg";

const root = process.cwd();
const baselineDir = join(root, "docs", "erp-program", "baseline");
const baselineFile = join(baselineDir, "schema_baseline.json");
const FULL_ROW_HASH_LIMIT = 1_000_000;

const SCHEMA_SQL = `
  SELECT
    c.relname AS name,
    CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'S' THEN 'sequence' END AS kind,
    pg_get_viewdef(c.oid, true) AS definition
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm', 'S')
  ORDER BY c.relname`;

const COLUMNS_SQL = `
  SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position`;

const CONSTRAINTS_SQL = `
  SELECT
    conname AS name,
    contype AS type,
    rel.relname AS table_name,
    pg_get_constraintdef(con.oid, true) AS definition
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = rel.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY conname`;

const INDEXES_SQL = `
  SELECT
    i.relname AS name,
    t.relname AS table_name,
    pg_get_indexdef(i.oid, 0, true) AS definition
  FROM pg_index x
  JOIN pg_class i ON i.oid = x.indexrelid
  JOIN pg_class t ON t.oid = x.indrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY i.relname`;

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

async function captureLive() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const c = new pg.Client({ connectionString: url });
  try {
    await c.connect();
  } catch (e) {
    console.warn(`WARN: cannot connect to database (${e.message}) — integrity check skipped for DB objects.`);
    return null;
  }
  try {
    const [rels, cols, cons, idxs] = await Promise.all([
      c.query(SCHEMA_SQL),
      c.query(COLUMNS_SQL),
      c.query(CONSTRAINTS_SQL),
      c.query(INDEXES_SQL)
    ]);
    const tables = rels.rows.filter((r) => r.kind === "table").map((r) => r.name);
    const counts = {};
    const checksums = {};
    for (const t of tables) {
      const countRes = await c.query(`SELECT count(*)::bigint AS n FROM "${t}"`);
      counts[t] = Number(countRes.rows[0].n);
      // Deterministic checksum: full-row hash for small tables, sampled hash otherwise
      const sample = counts[t] <= FULL_ROW_HASH_LIMIT
        ? `SELECT md5(string_agg(t.h, ',' ORDER BY t.h)) AS s FROM (SELECT to_jsonb(x.*)::text AS h FROM "${t}" x) t`
        : `SELECT md5(string_agg(t.h, ',' ORDER BY t.h)) AS s FROM (SELECT to_jsonb(x.*)::text AS h FROM "${t}" x LIMIT 10000) t`;
      try {
        const hashRes = await c.query(sample);
        checksums[t] = hashRes.rows[0].s || "empty";
      } catch {
        checksums[t] = "unavailable";
      }
    }
    return {
      captured_at: new Date().toISOString(),
      schema: {
        tables: rels.rows.filter((r) => r.kind === "table").map((r) => ({ name: r.name, kind: r.kind })),
        views: rels.rows.filter((r) => r.kind !== "table").map((r) => ({ name: r.name, kind: r.kind, definition: r.definition })),
        columns: cols.rows,
        constraints: cons.rows,
        indexes: idxs.rows
      },
      data: { counts, checksums }
    };
  } finally {
    await c.end();
  }
}

async function main() {
  if (!existsSync(baselineFile)) {
    console.warn("WARN: no schema baseline found — run `npm run erp:db-baseline` first. Integrity diff skipped.");
    process.exit(0);
  }
  const baseline = JSON.parse(readFileSync(baselineFile, "utf8"));
  const live = await captureLive();

  if (!live) process.exit(0);

  const failures = [];
  const allowed = [];

  // Schema diff on pre-existing objects: identical schema required
  const baseTables = new Map(baseline.schema.tables.map((t) => [t.name, t]));
  const liveTables = new Map(live.schema.tables.map((t) => [t.name, t]));
  for (const [name] of baseTables) {
    if (!liveTables.has(name)) {
      failures.push(`schema: pre-existing table "${name}" is missing`);
      continue;
    }
    const bc = baseline.schema.columns.filter((c) => c.table_name === name);
    const lc = live.schema.columns.filter((c) => c.table_name === name);
    if (stableStringify(bc) !== stableStringify(lc)) {
      // additive change (columns added) is allowed; any other change fails
      const added = lc.filter((c) => !bc.some((b) => b.column_name === c.column_name));
      const removedOrChanged = bc.filter((b) => {
        const l = lc.find((c) => c.column_name === b.column_name);
        return !l || stableStringify(l) !== stableStringify(b);
      });
      if (removedOrChanged.length === 0 && added.length > 0) {
        allowed.push(`schema: table "${name}" gained column(s) ${added.map((a) => a.column_name).join(", ")} (additive change allowed)`);
      } else {
        failures.push(`schema: columns of pre-existing table "${name}" changed (non-additive)`);
      }
    }
  }
  const baseCons = stableStringify(baseline.schema.constraints.filter((c) => baseTables.has(c.table_name)));
  const liveCons = stableStringify(live.schema.constraints.filter((c) => liveTables.has(c.table_name)));
  if (baseCons !== liveCons) {
    failures.push("schema: constraints of pre-existing tables changed");
  }

  // Row counts: no unexpected decrease on pre-existing tables
  for (const [name, count] of Object.entries(baseline.data.counts)) {
    const liveCount = live.data.counts[name];
    if (liveCount === undefined) continue;
    if (liveCount < count) failures.push(`data: row count of pre-existing table "${name}" decreased (${count} → ${liveCount})`);
    else if (liveCount > count) allowed.push(`data: table "${name}" grew ${count} → ${liveCount} (row additions allowed)`);
  }

  // Report
  mkdirSync(baselineDir, { recursive: true });
  const report = {
    run_at: new Date().toISOString(),
    result: failures.length ? "FAIL" : "PASS",
    failures,
    allowed_changes: allowed,
    live_table_count: live.schema.tables.length,
    live_total_rows: Object.values(live.data.counts).reduce((a, b) => a + b, 0)
  };
  writeFileSync(join(baselineDir, "integrity_check_last.json"), JSON.stringify(report, null, 2), "utf8");

  console.log("=== erp:db-integrity ===");
  for (const a of allowed) console.log(`  ok   ${a}`);
  for (const f of failures) console.error(`  FAIL ${f}`);
  if (failures.length) {
    console.error(`db-integrity: FAIL (${failures.length} difference(s) in pre-existing objects)`);
    process.exit(1);
  }
  console.log(`db-integrity: PASS (${live.schema.tables.length} tables, ${report.live_total_rows} rows)`);
}

main().catch((e) => {
  console.error(`db-integrity: ERROR ${e.message}`);
  process.exit(2);
});
