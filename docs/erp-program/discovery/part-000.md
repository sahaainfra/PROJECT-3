# Part 000 — Provisional discovery

**Status: PROVISIONAL / BLOCKED — not a Part 00 pass**  
**Assessment date:** 2026-10-08  
**Scope:** checked-in Buildwise scaffold in `PROJECT-3`; source-only assessment. This workspace was previously identified as a new-project scaffold, not as the authoritative live Construction ERP. No production database, data, report, or deployment was accessed.

## Evidence boundary

The source tree and available program documentation were inspected. The Prisma schema and checked-in migration are declarations only: without an identified database connection, they do not establish which objects exist in a deployed database. There is no Git repository metadata, configured `.env`, process `DATABASE_URL`, or `erp:regression` script in this workspace. No database access, backup, restore, or production comparison was attempted.

## REUSE / EXTEND / NEW inventory

| Requirement / candidate | Existing evidence | Decision | Finding / risk |
|---|---|---|---|
| Application stack and scripts | `package.json`; `src/app/`; `src/lib/` | REUSE | Next.js App Router, React, TypeScript, Prisma, Auth.js, npm scripts. No second framework is proposed. |
| Database adapter and schema | `src/lib/db.ts`; `prisma/schema.prisma`; `prisma/migrations/0001_foundation/` | REUSE | PostgreSQL/Prisma declarations exist. Applied schema, data, extensions, triggers, and deployed migration state are unknown. |
| Git branch and baseline tag | No `.git` directory; `git rev-parse --is-inside-work-tree` reports not a repository | BLOCKED | Cannot identify a production commit or safely create the required branch/tag against one. |
| CI and regression command | `package.json`; no `.github` workflow located; `npm run erp:regression` reports missing script | NEW, deferred | No CI baseline or required regression harness exists. Build/test commands alone do not prove a production baseline. |
| Existing unit tests | `tests/access-policy.test.ts`; `npm test` | REUSE | Four access-policy tests pass. Coverage is narrow; no database-backed or browser regression suite exists. |
| User, company, project, membership, login throttle, authentication audit entities | Seven declared Prisma models; details in `DB_ENTITY_MAP.csv` | REUSE as source declarations | Deployed schema and row counts are unverified. No schema/data checksums can be asserted. |
| Authentication and session | `src/lib/auth.ts`; `src/app/api/auth/[...nextauth]/route.ts`; `src/components/sign-in-form.tsx` | REUSE | Credentials/Auth.js flow is present; full credential verification requires a configured database and was not performed here. |
| Company/project authorization | `src/lib/authorization.ts`; `src/lib/access-policy.ts`; `tests/access-policy.test.ts` | REUSE, limited | Existing membership checks are not the central RBAC/ABAC/SoD engine described by the program. |
| Existing routes and APIs | `API_INVENTORY.md`; source routes under `src/app/` | REUSE | Sign-in, dashboard, project detail, root redirect, and Auth.js handler are inventoried. No ERP business API or OpenAPI contract was found. |
| Existing screens and shell | `UI_INVENTORY.md`; `src/components/workspace-shell.tsx`; `src/app/globals.css` | EXTEND, not started | Sign-in, portfolio dashboard, project page, and a basic shell exist. Part 00 shell/theme work could affect every screen; no visual rollout was attempted. |
| Design tokens, theme provider, shell, page templates | `00_READ_FIRST/design/design-tokens.json` exists in the prompt pack; app has existing CSS tokens/styles but no Part 00 generated token package or theme provider | NEW, blocked | No token build, theme/density preferences, registries, baseline templates, or adoption evidence. Implement only after a safe target/baseline plan is approved. |
| Navigation/icon registries | No registry located in the app; source prompt-pack JSON registries are intended inputs | NEW, blocked | Existing navigation entries and icons have not been imported into canonical registries. |
| Widget and KPI contracts | `CALCULATION_REGISTRY.md` records only project-count summaries | NEW, deferred | No certified KPI catalogue or dashboard widget registry. Do not fabricate live KPI or sample-data tiles. |
| Feature flags | No flag helper/configuration/table found in `src/`, Prisma schema, or package scripts | NEW, blocked | `ff.pgm` and `ff.tech_console` are not implemented or registered. |
| Technical Console / baseline route | No `/_tech` route or technical-role permission framework found | NEW, blocked | No gated console, step-up MFA, or audited technical-access path. Do not expose technical status in business UI. |
| Existing calculations | `CALCULATION_REGISTRY.md` | REUSE as provisional inventory | Only authorized project/status counts are recorded; no financial, quantity, tax, payroll, or progress formula was found. |
| Existing reports and exports | `API_INVENTORY.md`, `EXISTING_SYSTEM_MAP.md` | REUSE as provisional inventory | No report/export implementation or golden output set was located. |
| Existing jobs, events, sockets, integrations, file storage | `EXISTING_SYSTEM_MAP.md`, `DEPENDENCY_MAP.md` | REUSE as provisional inventory | None located in source; production-side services and infrastructure remain outside this evidence boundary. |
| Backup and rollback | `.env.example`; `docker-compose.yml`; no configured database or file-storage target | BLOCKED | No verified database/file backup or restore rehearsal. A rollback to an unidentified production commit cannot be claimed. |
| Program documentation | `docs/erp-program/` contains provisional Part 001 inventory and risk/dependency records | EXTEND | Added this Part 00 provisional discovery, impact, baseline, evidence, and traceability record. Missing catalogue documents remain deferred. |
| Application behavior or database objects | Existing application and declared schema | REUSE unchanged | This assessment is documentation-only. No application, schema, migration, or database data was modified. |

## Conflicts and blockers

1. The Part 00 prompt assumes an existing live ERP and a production commit; current workspace evidence identifies a new-project scaffold with no Git metadata. See `CONFLICTS.md`, P000-C01.
2. The required schema/data baseline, backup, restore, and report comparisons cannot be established without an authorized, identified database and storage target. See P000-C02.
3. `erp:regression`, CI, design gates, feature flags, and the shared authorization/audit/protocol engines are absent. See P000-C03.
4. Part 01 remains dependent on Part 00 approval. This provisional assessment is not that approval.

## Disposition

Proceed only with further source documentation until the authoritative system and safe database target are confirmed. Do not create a production tag, claim a database baseline, enable a feature flag, change the application shell, or start Part 01 while Part 00 remains blocked.
