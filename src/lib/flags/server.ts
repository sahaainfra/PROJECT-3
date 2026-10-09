// Part 00 — server-side feature-flag service (section 5.7).
// Reuses the DB settings mechanism when available (sys_feature_flags, Part 00 migration);
// falls back to ERP_FLAGS_FORCE_ON env + built-in defaults when the database is not provisioned.
import { getPool } from "@/lib/db/pool";
import { evaluateFlags, type FlagRow, type FlagContext, isEnabledFromRows } from "@/lib/flags/evaluate";

export const KNOWN_FLAGS = [
  { key: "ff.pgm", description: "Part 00 — program baseline: shell, design system, navigation (master flag)" },
  { key: "ff.pgm.theme", description: "Part 00 — theme bridge for existing screens (compatibility stylesheet)" },
  { key: "ff.pgm.launchpad", description: "Part 00 — Home launchpad frame" },
  { key: "ff.tech_console", description: "Part 00 — Technical Console (/_tech), disabled in production by default" }
] as const;

type Cache = { rows: FlagRow[]; loadedAt: number };
declare global {
  // eslint-disable-next-line no-var
  var __erpFlagCache: Cache | undefined;
}

const CACHE_MS = 30_000;

async function loadFlagRows(): Promise<FlagRow[]> {
  if (global.__erpFlagCache && Date.now() - global.__erpFlagCache.loadedAt < CACHE_MS) {
    return global.__erpFlagCache.rows;
  }
  const pool = getPool();
  let rows: FlagRow[] = [];
  if (pool) {
    try {
      const res = await pool.query<FlagRow>(
        "SELECT key, scope_type, scope_id, enabled, rollout_percent FROM sys_feature_flags WHERE enabled = true"
      );
      rows = res.rows;
    } catch {
      rows = [];
    }
  }
  // Env override (CI / local dev): flags forced ON regardless of DB state
  const forced = (process.env.ERP_FLAGS_FORCE_ON || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const key of forced) {
    if (!rows.some((r) => r.key === key && r.scope_type === "global")) {
      rows.push({ key, scope_type: "global", scope_id: null, enabled: true, rollout_percent: 100 });
    }
  }
  global.__erpFlagCache = { rows, loadedAt: Date.now() };
  return rows;
}

export async function isEnabled(flagKey: string, context: FlagContext = {}): Promise<boolean> {
  // ff.pgm sub-flags require the master flag
  if (flagKey.startsWith("ff.pgm.") && flagKey !== "ff.pgm") {
    const master = await isEnabled("ff.pgm", context);
    if (!master) return false;
  }
  const rows = await loadFlagRows();
  return isEnabledFromRows(rows, flagKey, context);
}

export async function getEnabledFlags(context: FlagContext = {}): Promise<Record<string, { enabled: boolean; matched_scope: string | null }>> {
  const rows = await loadFlagRows();
  const evaluated = evaluateFlags(rows, context);
  const out: Record<string, { enabled: boolean; matched_scope: string | null }> = {};
  for (const f of KNOWN_FLAGS) {
    const e = evaluated[f.key];
    const masterOff = f.key.startsWith("ff.pgm.") && f.key !== "ff.pgm" && !evaluated["ff.pgm"]?.enabled;
    out[f.key] = {
      enabled: !!e?.enabled && !masterOff,
      matched_scope: e?.matched_scope ?? null
    };
  }
  return out;
}
