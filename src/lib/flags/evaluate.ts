// Part 00 — feature-flag evaluation (section 5.7). Pure function; unit-tested in tests/flags.test.ts.
// Flags are evaluated per company/project/role/user; deny by default.

export type FlagScopeType = "global" | "company" | "project" | "role" | "user";

export interface FlagRow {
  key: string;
  scope_type: FlagScopeType;
  scope_id: string | null;
  enabled: boolean;
  rollout_percent: number;
}

export interface FlagContext {
  companyId?: string | null;
  projectId?: string | null;
  role?: string | null;
  userId?: string | null;
}

export interface FlagEvaluation {
  enabled: boolean;
  source: "row" | "default";
  matched_scope: FlagScopeType | null;
}

export function hashPercent(key: string, context: FlagContext): number {
  const seed = `${key}:${context.userId ?? ""}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

// Most specific matching scope wins (user > role > project > company > global); deny by default.
export function evaluateFlags(rows: FlagRow[], context: FlagContext): Record<string, FlagEvaluation> {
  const byKey = new Map<string, FlagEvaluation>();
  const specificity: Record<FlagScopeType, number> = { global: 0, company: 1, project: 2, role: 2, user: 3 };

  for (const row of rows) {
    if (!row.enabled) continue;
    const matches =
      (row.scope_type === "global") ||
      (row.scope_type === "company" && row.scope_id != null && row.scope_id === context.companyId) ||
      (row.scope_type === "project" && row.scope_id != null && row.scope_id === context.projectId) ||
      (row.scope_type === "role" && row.scope_id != null && row.scope_id === context.role) ||
      (row.scope_type === "user" && row.scope_id != null && row.scope_id === context.userId);
    if (!matches) continue;

    if (row.rollout_percent < 100) {
      const bucket = hashPercent(row.key, context);
      if (bucket >= row.rollout_percent) continue;
    }

    const current = byKey.get(row.key);
    if (!current || specificity[row.scope_type] >= specificity[current.matched_scope!]) {
      byKey.set(row.key, { enabled: true, source: "row", matched_scope: row.scope_type });
    }
  }
  return Object.fromEntries(byKey) as Record<string, FlagEvaluation>;
}

export function isEnabledFromRows(rows: FlagRow[], flagKey: string, context: FlagContext): boolean {
  return evaluateFlags(rows, context)[flagKey]?.enabled ?? false;
}
