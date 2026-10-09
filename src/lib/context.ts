// Part 00 — organisation context adapter (DS-12, DS-29): Company › Project › Site.
// Adapter over existing organisation/project data until Part 05 (company) and Part 40 (site).
// No organisation tables exist yet, so this returns an empty context — no placeholder data.
import { getPool } from "@/lib/db/pool";

export interface ContextOption {
  id: string;
  label: string;
}

export interface ErpContext {
  companies: ContextOption[];
  projects: ContextOption[];
  sites: ContextOption[];
}

export async function loadContext(): Promise<ErpContext> {
  const pool = getPool();
  const empty: ErpContext = { companies: [], projects: [], sites: [] };
  if (!pool) return empty;
  try {
    // Look for organisation master tables when they exist (later Parts provision them)
    const exists = await pool.query(
      `SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name IN ('companies', 'org_companies', 'mst_companies')
       LIMIT 1`
    );
    if (!exists.rowCount) return empty;
    const res = await pool.query<ContextOption>(
      `SELECT id::text AS id, name AS label FROM companies ORDER BY name`
    );
    return { ...empty, companies: res.rows };
  } catch {
    return empty;
  }
}
