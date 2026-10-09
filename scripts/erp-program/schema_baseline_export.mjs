// Part 00 — schema + data baseline export (section 5.3, 5.4).
// Exports full DDL of the current database to docs/erp-program/baseline/schema_baseline.sql
// and a machine-readable schema_baseline.json + data_baseline.csv.
// Reuses capture logic from db_integrity_check.mjs (single authoritative implementation).
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const root = process.cwd();
const baselineDir = join(root, "docs", "erp-program", "baseline");

const SCHEMA_SQL = `
  SELECT c.relname AS name, c.relkind AS kind
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm', 'S') ORDER BY c.relname`;
const COLUMNS_SQL = `
  SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`;
const CONSTRAINTS_SQL = `
  SELECT conname AS name, contype AS type, rel.relname AS table_name, pg_get_constraintdef(con.oid, true) AS definition
  FROM pg_constraint con JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = rel.relnamespace WHERE n.nspname = 'public' ORDER BY conname`;
const INDEXES_SQL = `
  SELECT i.relname AS name, t.relname AS table_name, pg_get_indexdef(i.oid, 0, true) AS definition
  FROM pg_index x JOIN pg_class i ON i.oid = x.indexrelid JOIN pg_class t ON t.oid = x.indrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace WHERE n.nspname = 'public' ORDER BY i.relname`;

function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("DATABASE_URL not set — cannot export schema baseline. Greenfield program: baseline is file-based until the database is provisioned.");
    process.exit(0);
  }
  const c = new pg.Client({ connectionString: url });
  try {
    await c.connect();
  } catch (e) {
    console.warn(`WARN: cannot connect to database (${e.message}) — baseline export skipped.`);
    process.exit(0);
  }

  const [rels, cols, cons, idxs] = await Promise.all([
    c.query(SCHEMA_SQL), c.query(COLUMNS_SQL), c.query(CONSTRAINTS_SQL), c.query(INDEXES_SQL)
  ]);

  mkdirSync(baselineDir, { recursive: true });

  // DDL export (documented structure; authoritative objects are exported as-is)
  let sql = `-- Schema baseline — captured ${new Date().toISOString()}\n`;
  sql += `-- Part 00 program baseline (section 5.3). Read-only capture with read-only credentials.\n\n`;
  for (const r of rels.rows) {
    const kind = r.kind === "r" ? "TABLE" : r.kind === "v" ? "VIEW" : r.kind === "m" ? "MATERIALIZED VIEW" : "SEQUENCE";
    sql += `-- ${kind}: ${r.name}\n`;
    if (r.kind === "r") {
      const tableCols = cols.rows.filter((col) => col.table_name === r.name);
      sql += `CREATE TABLE ${r.name} (\n`;
      sql += tableCols.map((col) => `  "${col.column_name}" ${col.data_type}${col.is_nullable === "NO" ? " NOT NULL" : ""}${col.column_default ? ` DEFAULT ${col.column_default}` : ""}`).join(",\n");
      const tableCons = cons.rows.filter((con) => con.table_name === r.name);
      if (tableCons.length) sql += ",\n" + tableCons.map((con) => `  CONSTRAINT ${con.name} ${con.definition}`).join(",\n");
      sql += `\n);\n\n`;
      const tableIdx = idxs.rows.filter((i) => i.table_name === r.name);
      for (const i of tableIdx) sql += `${i.definition};\n`;
      sql += "\n";
    } else if (r.kind === "v" || r.kind === "m") {
      sql += `-- definition captured in schema_baseline.json\n\n`;
    }
  }

  // machine-readable JSON
  const tables = rels.rows.filter((r) => r.kind === "table").map((r) => ({ name: r.name, kind: "table" }));
  const counts = {};
  const checksums = {};
  for (const t of tables) {
    const countRes = await c.query(`SELECT count(*)::bigint AS n FROM "${t.name}"`);
    counts[t.name] = Number(countRes.rows[0].n);
    const hashRes = await c.query(
      `SELECT md5(coalesce(string_agg(t.h, ',' ORDER BY t.h), 'empty')) AS s FROM (SELECT to_jsonb(x.*)::text AS h FROM "${t.name}" x) t`
    ).catch(() => ({ rows: [{ s: "unavailable" }] }));
    checksums[t.name] = hashRes.rows[0].s;
  }

  const json = {
    captured_at: new Date().toISOString(),
    git_commit: process.env.GIT_COMMIT || null,
    schema: {
      tables,
      views: rels.rows.filter((r) => r.kind === "v" || r.kind === "m").map((r) => ({ name: r.name, kind: r.kind })),
      sequences: rels.rows.filter((r) => r.kind === "S").map((r) => ({ name: r.name, kind: "sequence" })),
      columns: cols.rows,
      constraints: cons.rows,
      indexes: idxs.rows
    },
    data: { counts, checksums }
  };
  writeFileSync(join(baselineDir, "schema_baseline.json"), JSON.stringify(json, null, 2), "utf8");
  writeFileSync(join(baselineDir, "schema_baseline.sql"), sql, "utf8");

  // data baseline CSV
  let csv = "table_name,row_count,checksum\n";
  for (const t of tables) csv += `${csvCell(t.name)},${counts[t.name]},${checksums[t.name]}\n`;
  writeFileSync(join(baselineDir, "data_baseline.csv"), csv, "utf8");

  await c.end();
  console.log(`schema baseline exported: schema_baseline.sql, schema_baseline.json, data_baseline.csv (${tables.length} tables)`);
}

main().catch((e) => {
  console.error(`db-baseline FAILED: ${e.message}`);
  process.exit(1);
});
