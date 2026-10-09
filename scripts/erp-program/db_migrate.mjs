// Part 00 — additive, idempotent, reversible migration runner (SA-4, section 31).
// Usage: node scripts/erp-program/db_migrate.mjs up|down
// Each migration lives in db/migrations/<id>_<name>.up.sql with a matching .down.sql.
// The down-migration removes only objects this Part created.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const dir = join(process.cwd(), "db", "migrations");
const cmd = process.argv[2] || "up";

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set — cannot run migrations.");
    process.exit(2);
  }
  return new pg.Client({ connectionString: url });
}

async function main() {
  const c = client();
  await c.connect();
  try {
    await c.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
         id text PRIMARY KEY,
         applied_at timestamptz NOT NULL DEFAULT now()
       )`
    );
    const files = readdirSync(dir).filter((f) => f.endsWith(".up.sql")).sort();
    if (cmd === "up") {
      for (const f of files) {
        const id = f.replace(/\.up\.sql$/, "");
        const done = await c.query("SELECT 1 FROM schema_migrations WHERE id = $1", [id]);
        if (done.rowCount) {
          console.log(`  skip ${id} (already applied)`);
          continue;
        }
        const sql = readFileSync(join(dir, f), "utf8");
        await c.query("BEGIN");
        try {
          await c.query(sql);
          await c.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
          await c.query("COMMIT");
          console.log(`  up   ${id}`);
        } catch (e) {
          await c.query("ROLLBACK");
          throw e;
        }
      }
    } else if (cmd === "down") {
      const applied = await c.query("SELECT id FROM schema_migrations ORDER BY applied_at DESC");
      for (const row of applied.rows) {
        const downFile = join(dir, `${row.id}.down.sql`);
        let sql;
        try {
          sql = readFileSync(downFile, "utf8");
        } catch {
          console.log(`  skip ${row.id} (no down migration)`);
          continue;
        }
        await c.query("BEGIN");
        try {
          await c.query(sql);
          await c.query("DELETE FROM schema_migrations WHERE id = $1", [row.id]);
          await c.query("COMMIT");
          console.log(`  down ${row.id}`);
        } catch (e) {
          await c.query("ROLLBACK");
          throw e;
        }
      }
    } else {
      console.error("Unknown command — use 'up' or 'down'");
      process.exit(2);
    }
    console.log(`migrations ${cmd}: done`);
  } finally {
    await c.end();
  }
}

main().catch((e) => {
  console.error(`migrations ${cmd} FAILED: ${e.message}`);
  process.exit(1);
});
