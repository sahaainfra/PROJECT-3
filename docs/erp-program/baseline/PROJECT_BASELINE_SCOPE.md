# Part 00 — new-project baseline scope and provisional gate

**Assessment date:** 2026-10-08  
**Status:** **RE-SCOPED / PROVISIONAL — approval and implementation gates remain open**  
**Scope:** `sahaainfra/PROJECT-3`, a new Buildwise foundation; not an identified live ERP.

## Re-scope authority and limits

The requestor explicitly directed that Part 00 be re-scoped as a new-project foundation and that equivalent baseline/approval evidence replace assumptions about an existing production ERP. The requestor also approved a provisional Part 00 gate, with mandatory Part 03 revalidation before Part 02 can be approved.

This changes the evidence expected for the scaffold; it does **not** assert a production system, production data, business-user approval, or independent technical review. This file is a proposed and recorded evidence contract. Part 00 is not PASS until its implementation evidence and required human approvals are attached.

## Observed source and environment baseline

| Evidence | Observation | Use and limitation |
|---|---|---|
| Git source | Repository root is `PROJECT-3`; branch `main`; HEAD `55a9e82e30124324527be1e0509bb497cb8eec65`. | Development-source baseline only. It is not identified as a production commit. |
| Worktree | `scripts/provision-admin.ts` has an uncommitted change from the preceding workspace session. | Review and retain or separately resolve it before creating an approved baseline tag. Do not silently include an unknown dirty tree in baseline evidence. |
| Application | Next.js App Router, React, TypeScript, Prisma, PostgreSQL, and Auth.js credentials are declared in the repository. | Declared application foundation; not a production deployment inventory. |
| Database model | Seven Prisma models and migration `0001_foundation` are present in source. `npx prisma migrate status` reported the configured local database schema up to date. | Confirms a local development migration state only. No production catalogue, row counts, checksums, or business data were inspected. |
| Local data | A local development database has been used for smoke testing. | Treat its rows and credentials as disposable test data, not as a baseline fixture or production evidence. Never export its user records or secrets into this repository. |
| Current automated checks | The source regression harness passed 8 tests, lint, typecheck, and production build on 2026-10-08 after the server/client feature-flag helper and tests were added. | See [source-check evidence](../test-evidence/part-000/runs/source-checks-2026-10-08T07-36-38-026Z.json). This is source-only. The earlier migration-status observation predates the PostgreSQL incident in `CONFLICTS.md`. A separate refused local database connection during browser validation is recorded in the evidence README and `CONFLICTS.md`; no database is being accessed now. |
| Application routes | `/`, `/sign-in`, `/dashboard`, `/projects/[projectId]`, `/api/auth/[...nextauth]`. | Existing scaffold behavior to characterize; the current small test suite does not yet exercise all routes end-to-end. |
| Business APIs and reports | No construction transaction APIs, report/export implementation, or business calculation catalogue beyond project-scope summaries was located. | Record those baseline categories as not present, not as zero-valued functionality. Do not invent test data or outputs. |
| CI / regression | The repository previously had no CI workflow or `erp:regression` script. A source-check harness and GitHub Actions workflow are now added. | Local source checks pass; a GitHub Actions run is not available yet. Part 03 will strengthen and independently revalidate it; database, browser, report, backup, security, and visual gates remain open. |
| File storage / backup | No application file-storage service or authorized persistent production storage target is identified. | No production backup or restore claim is permitted. |

## Replacement evidence contract

The live-system baseline requirements are replaced only for this new-project scope as follows:

| Original evidence expectation | New-project equivalent | Required evidence | Status |
|---|---|---|---|
| Production commit, branch and baseline tag | Reviewed, clean development-source commit; baseline tag identifies only the approved scaffold state. | Full commit SHA, clean `git status`, reviewer approval, and tag target recorded. | Pending; current tree is dirty. |
| Production schema DDL and data checksums | Fresh isolated development database created from the checked-in Prisma migration; schema inventory/hash generated from that disposable database. No legacy business rows are assumed. | Database identity and isolation check, schema snapshot/hash, migration state, and repeatable fresh-database procedure. | Partial; local migration state is known, but no approved clean baseline snapshot exists. |
| Production row counts and checksums | Deterministic, synthetic test fixtures only, separated from local ad-hoc smoke data. | Fixture manifest, stable identifiers, expected counts/checksums, and proof that fixtures cannot be loaded in production. | Pending. |
| Golden tests for live business flows and API snapshots | Characterization tests for implemented foundation behavior only: anonymous sign-in routing, credential sign-in/out when an isolated test DB is available, company/project authorization, and protected project-page access. | Automated unit/integration/browser results; dynamic CSRF/session tokens are contract-checked, never frozen as secret-bearing snapshots. | Partial; four access-policy unit tests exist. |
| Existing report/export golden files | Inventory proves no business reports/exports exist in this scaffold. | Explicit `N/A — no report/export implementation` record and later-owner Part for each future report category. | Source-inventoried; no report output exists. |
| Production backup and restore | Recreate the disposable database from migrations and deterministic test fixtures; test any retained local backup only against another isolated database. | Restore rehearsal, schema comparison, and fixture reconciliation. No production backup is implied. | Pending. |
| Regression and CI gate | `erp:regression` runs applicable repository checks and safe isolated-database tests; CI invokes the same command. | Command output, nonzero-on-failure behavior, CI run, and per-Part evidence directory. | Pending. |
| Existing-system product/technical approvals | New-project scope owner accepts the scaffold boundary; a technical lead and a reviewer other than the implementer verify the evidence. | Named role, person, date, commit, findings, and approval in the Part 00 audit record. | Pending. Requestor re-scope is recorded, but is not a substitute for independent review. |

## Provisional Part 00 exit gate

Part 00 may be marked **provisionally approved for Part 01 source discovery only** when all of the following are recorded:

1. The re-scoped source/data boundary and this replacement evidence contract are accepted by the program owner.
2. The code baseline is clean, identified by commit SHA, and approved by the technical lead; no production tag is created.
3. A fresh isolated database can be built from the committed migration, its schema is captured and checked twice, and no production or personal data is used.
4. A deterministic synthetic test-fixture procedure is documented, and the local smoke-test data is excluded.
5. The regression harness passes the existing tests, lint, typecheck, production build, and the applicable isolated-database and route/authorization checks; failures return nonzero.
6. Existing foundation routes are characterized; absent business workflows, reports, storage, and external integrations are listed as absent and assigned to their owning future Parts.
7. The rollback/recreation procedure, audit/traceability records, feature-flag default behavior, and design foundation have evidence.
8. The implementing engineer, a technical lead, and an independent reviewer record approval. No reviewer is represented as independent if they authored the implementation.

This gate is intentionally narrower than the original production-baseline gate. It does not certify production readiness or permit production data use.

The source-only harness is implemented and its local source checks pass. Server-evaluated feature flags default off when omitted, can be scoped by company, project, role, and user, and are not an authorization mechanism. The client helper accepts only a server-provided enabled-flag list; no UI rollout, persisted administration, or application call site is implemented. The harness does not run the isolated-database, authenticated browser, report, backup, security, accessibility, visual, or Part 03 checks listed above, so this provisional gate is not yet satisfied.

## Part 03 revalidation and sequence

The Part 00 brief requires a Part 03 quality-gate report for completion, while the program order places Part 03 after Parts 01 and 02. The requestor approved this resolution:

- The provisional Part 00 gate above can authorize Part 01 source discovery.
- Part 02 implementation may start only after the sequential predecessor approvals required by the program.
- Part 02 cannot be approved until Part 03 re-runs and strengthens the regression, security, migration, design, accessibility, and deployment gates against the same committed baseline.
- If Part 03 finds a regression, Part 02 remains unapproved until fixed and reverified.

The Part 03 revalidation is not a production-baseline certification. Production use remains separately gated by the approved production environment, data-protection controls, backups, operations, and security acceptance.

## Explicit exclusions from this baseline

- No production repository, deployment, database, backup, or business data is identified.
- No project creation, procurement, goods receipt, billing, payroll, attendance, finance, or other unimplemented workflow is claimed or simulated.
- No report, KPI, cost, quantity, or progress calculation is certified beyond the existing source-defined authorized project/status counts.
- No external integration, worker, queue, socket service, object storage, or mobile application is claimed.
- The independent audit, technical-lead sign-off, and Part 03 revalidation are still required; this document alone cannot pass Part 00.
