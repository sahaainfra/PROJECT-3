// Part 00 — PostgreSQL connection pool (server-side only, never imported by client code).
import pg from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __erpPool: pg.Pool | undefined;
}

export function getPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!global.__erpPool) {
    global.__erpPool = new pg.Pool({ connectionString: url, max: 10 });
  }
  return global.__erpPool;
}
