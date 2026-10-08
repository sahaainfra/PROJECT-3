# Part 001 — Existing system audit and architecture discovery

**Audit status: PROVISIONAL / BLOCKED FOR SIGN-OFF**
**Scope inspected:** `PROJECT-3` Buildwise foundation at the time of the audit.
**Audit date:** 2026-10-08
**Mode:** read-only inspection; no application source, schema, migration, or database data was changed for this audit.

## Readiness and evidence boundary

This workspace was selected as a new project rather than the pre-existing ERP named in the Part 000 directive. It has no `.git` directory/history and is not a populated legacy ERP. The required Part 00 pass evidence, baseline tag, regression harness, and sign-off are absent. There is also no configured `.env`, database URL, PostgreSQL CLI, or Docker executable in this environment. Accordingly:

- Findings below inventory the checked-in application definition, not a running production system or a migrated database.
- Prisma models and migration objects are **declared**, not verified as present in a database. No row counts, data quality results, deployed schema, live integrations, performance figures, or production behaviours are claimed.
- Part 001's mandatory predecessor/regression gate and second-engineer/technical-lead sign-off are not satisfied. These notes are a useful provisional inventory only; they are not a Part 001 PASS.
- No Part 001 feature flag, migration, permission, protocol hook, UI, or business code was introduced. This prompt is explicitly read-only for application code and data.

The host does have a local process listening on TCP port 5432, but the project has no database URL/credentials identifying that process as the intended ERP database. No connection or data query was attempted; database findings remain unverified.

## REUSE / EXTEND / NEW inventory

| Surface | Evidence found | Part 001 disposition |
|---|---|---|
| Web stack and build | Next.js App Router, React, TypeScript; `package.json` | REUSE for later slices, subject to Part 00 approval |
| Database access | Prisma client and one PostgreSQL datasource; `src/lib/db.ts`, `prisma/schema.prisma` | REUSE the declared adapter; EXTEND only through reviewed migrations |
| Users, companies, memberships, projects | `User`, `Company`, `CompanyMembership`, `Project`, `ProjectMembership` Prisma models | REUSE as the present foundation's declared entities; database deployment/data remain unverified |
| Login throttle and login audit | `LoginThrottle`, `AuditEvent` declared models; Auth.js credentials handler | REUSE login-specific mechanism; EXTEND before representing it as the enterprise audit/telemetry engine |
| Authentication endpoint | `/api/auth/[...nextauth]` delegates to Auth.js | REUSE existing route; no parallel login API |
| Sign-in, portfolio, project overview | `/sign-in`, `/dashboard`, `/projects/[projectId]` App Router pages | REUSE existing screens; no Part 001 screen is required |
| Company/project scope | `src/lib/authorization.ts`; server session is used for page authorization | REUSE as the narrow current membership guard; EXTEND for RBAC/ABAC, site/department scopes, policy registry, API/service/job coverage |
| Jobs, queues, socket events | No application implementation located | NEW only when later approved module requirements call for them |
| Business calculations / finance / inventory | No calculation service, ledger, financial, BOQ, stock, or payroll model located | NEW after master/engine dependencies and formula ownership are decided |
| Reports, exports, printing | No report/export/print implementation located | NEW when specified; do not claim existing report baselines |
| Email/SMS/push/document storage/integrations | No provider/client/service configuration located | NEW behind approved shared interfaces; no credentials or external integration assumed |
| Feature flags and protocol engine | No feature-flag store/helper or protocol API located | NEW only in the owning later Part; Part 001 remains read-only |
| Testing/build baseline | npm scripts provide lint/typecheck/unit test/build; one access-policy test file | REUSE the commands; EXTEND with database-backed, browser, integration, and regression gates |

## Extracted inventory

- **Entities:** seven Prisma models: `User`, `Company`, `CompanyMembership`, `Project`, `ProjectMembership`, `LoginThrottle`, and `AuditEvent`. Five enums are declared. See [DB_ENTITY_MAP.csv](../DB_ENTITY_MAP.csv).
- **Routes/API:** one explicitly authored route handler (`/api/auth/[...nextauth]`); it exposes Auth.js endpoints, not ERP business APIs. Three rendered pages plus `/` redirect and framework not-found page. See [API_INVENTORY.md](../API_INVENTORY.md).
- **UI:** responsive sign-in, portfolio dashboard, and project detail pages. The dashboard and project page require a session and database access. See [UI_INVENTORY.md](../UI_INVENTORY.md).
- **Jobs, schedules, queue workers, Socket.IO:** none found.
- **Business calculations:** none found. Dashboard figures count returned accessible-project records; they are not financial/KPI formulas. See [CALCULATION_REGISTRY.md](../CALCULATION_REGISTRY.md).
- **Item-like construction masters:** no materials, services, labour categories, equipment types, BOQ libraries, WBS, or units-of-measure entities found. See [ITEM_LIKE_MASTERS.md](../ITEM_LIKE_MASTERS.md).
- **External integrations:** PostgreSQL is the sole configured application datastore. No inbound/outbound business integration is configured.
- **Feature flags:** no `ff.audit` or other runtime feature-flag implementation located.
- **Existing shared ERP engines/catalogues:** no application-level permission registry, workflow/rules engine, event bus, notification/document/report service, telemetry/error taxonomy, or protocol engine located.

## Part-specific control points

See [CONTROL_INVENTORY.md](../CONTROL_INVENTORY.md). CP-AUD-01 cannot pass without a deployed database/schema inspection and verified completeness of this inventory. CP-AUD-02 is a report-only risk-register item; it does not authorize implementation of a control engine here.

The Part 3–130 matrix is necessarily a **triage skeleton**, not a prompt-level fit-gap assessment: those individual Part specifications were not included in the supplied Part 001 file. “0% located” means no corresponding capability was located in this foundation source scan; it is not a verified quantitative coverage score. Risk is marked unassessed for all future Parts until their specifications and relevant domain evidence are available.

## Follow-up and sign-off

The detailed component/module map is [EXISTING_SYSTEM_MAP.md](../EXISTING_SYSTEM_MAP.md). Scope and module dependencies are in [DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md); risks and limitations are in [RISK_REGISTER.md](../RISK_REGISTER.md); per-part guidance is in [gap-matrix-parts-003-130.csv](../gap-matrix-parts-003-130.csv). The source Part 001 acceptance criteria are not complete. Resolve the predecessor/readiness decision in [DECISIONS.md](../DECISIONS.md), rerun inspection with a database-backed environment, and obtain independent peer and technical-lead review before treating this inventory as authoritative.
