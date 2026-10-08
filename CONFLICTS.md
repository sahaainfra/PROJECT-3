# Conflicts and blockers

## Part 001 — 2026-10-08

| ID | Conflict / blocker | Evidence | Resolution required |
|---|---|---|---|
| P001-C01 | The Part 001 directive is for an existing, live Construction ERP and depends on a completed Part 00 baseline, but the selected `PROJECT-3` workspace was empty and was explicitly authorized as a new-project workspace. No Part 00 baseline or regression PASS was established for it. | Workspace source inventory; no `.git`, existing program docs, `.env`, applied database, or `erp:regression` command. See [discovery note](docs/erp-program/discovery/part-001.md) and [DECISIONS.md](docs/erp-program/DECISIONS.md). | Confirm this workspace is the authoritative target, perform the required Part 00 baseline/readiness steps, then repeat or approve this audit against the intended system. |
| P001-C02 | Live database inventory and data-quality checks cannot be performed because no database URL/credentials identify the local process listening on port 5432 as the intended ERP database. Docker and the PostgreSQL CLI are unavailable. The Prisma schema/migration is a declaration, not proof of deployed objects. | Local tool/environment checks; migration source. | Supply/confirm an isolated, authorized test DB or read-only catalogue connection; never point discovery scripts at production with write credentials. |
| P001-C03 | The engine dependencies named by the program (quality gate, identity/RBAC, audit, observability, event bus, workflow/rules, protocol, calculation, document, notifications, reports) are not implemented in this new foundation. | Source/module inventory in `docs/erp-program/EXISTING_SYSTEM_MAP.md`. | Implement in strict owner-Part sequence; do not duplicate engines inside Part 001. |

Part 001 is read-only: no behavior/schema/data changes were made to resolve these blockers.

## Part 000 — 2026-10-08

| ID | Conflict / blocker | Evidence | Resolution required |
|---|---|---|---|
| P000-C01 | Part 00 requires a production branch/tag, but this workspace has no Git metadata and is documented as a new-project scaffold rather than an identified production checkout. | `git rev-parse --is-inside-work-tree` fails; see [Part 000 baseline report](docs/erp-program/baseline/BASELINE_REPORT.md). | Identify the authoritative repository and production commit; do not initialize/tag this scaffold as production without explicit approval. |
| P000-C02 | The required deployed schema/data baseline, backup, restore, and report comparison cannot be established without an identified authorized database/storage target. | No `.env` or process `DATABASE_URL`; no DB connection was attempted. | Supply an isolated authorized target and approved read-only/write backup procedures; verify identity before use. |
| P000-C03 | The baseline harness, CI workflow, feature flag, design gates, and shared enterprise engines referenced by Part 00 are absent. | `package.json`, application source inventory, and `npm run erp:regression` missing-script result. | Implement only after the baseline target and dependency ownership are approved; keep Part 00 blocked until gate evidence exists. |

The Part 000 assessment changed documentation only. No application behavior, database schema, or database data was changed.
