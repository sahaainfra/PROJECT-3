# Part 001 decisions

| ID | Decision | Rationale / evidence | Status / owner |
|---|---|---|---|
| DEC-P001-01 | Treat this deliverable as a provisional source inventory of the new Buildwise foundation, not a full existing-production-system audit. | `PROJECT-3` contains the new platform scaffold; no repository history, existing system map, or legacy modules are present. | Provisional; program lead confirmation required |
| DEC-P001-02 | Do not change application code, schema, or database for Part 001. | Source prompt defines Part 001 as read-only discovery/documentation. | Applied |
| DEC-P001-03 | Do not claim schema/data inventory, database-backed authorization, complete route count, backup, recovery, or report golden baseline without an available database/environment. | No configured database URL, Docker, or PostgreSQL CLI; migration application could not be checked. | Open evidence gap |
| DEC-P001-04 | Do not mark Part 001 PASS or create/enable `ff.audit` while predecessor evidence and sign-off are missing. | Part 001 sections 2, 27, and 34 require Part 00 PASS and the regression gate. | Blocked; program lead/technical lead |
| DEC-P001-05 | Defer shared authorization, audit, workflow, protocol, reporting, and other engine decisions to their owning Parts. | None of the referenced enterprise engines is delivered in this foundation; duplicating them in the audit would violate source scope. | Open; track by owning Part |

## Sign-off

- Independent peer review: **Pending** (no second reviewer evidence).
- Technical lead: **Pending**.
- Part 00 prerequisite gate: **Missing**.
- Part 001 status: **PROVISIONAL / BLOCKED — not complete**.

## Part 000 — provisional assessment (2026-10-08)

| ID | Decision | Rationale / evidence | Status / owner |
|---|---|---|---|
| DEC-P000-01 | Assess the current workspace only as a new-project scaffold; do not represent it as the authoritative live ERP. | Existing `EXISTING_SYSTEM_MAP.md` and Part 001 evidence identify no production repository/database. See [Part 000 discovery](discovery/part-000.md). | Provisional; program owner confirmation required |
| DEC-P000-02 | Keep this Part 00 activity documentation-only until the system and database targets are identified. | No `.git`, `.env`, process `DATABASE_URL`, approved target DB, or verified backup/restore is available. | Applied |
| DEC-P000-03 | Record local build/test results as source-level evidence only; do not claim the regression gate passed. | Four unit tests and lint/typecheck/build pass, but `erp:regression` is not defined and DB/golden/CI gates cannot run. | Applied |
| DEC-P000-04 | Do not create the baseline branch/tag, run a DB migration, enable `ff.pgm`, replace the application shell, or start Part 01. | There is no verified production commit/data baseline and no approved Part 00 audit. | Blocked; program owner/technical lead |
| DEC-P000-05 | Re-scope Part 00 as the baseline for a new-project scaffold, not an existing live ERP. | The requestor selected this re-scope and asked for equivalent baseline and approval evidence; see [new-project baseline scope](baseline/PROJECT_BASELINE_SCOPE.md). No production system or data is identified. | Requestor direction recorded; product/program owner acceptance and technical/independent review pending |
| DEC-P000-06 | Use a provisional Part 00 gate for Part 01, with mandatory Part 03 revalidation before Part 02 approval. | Part 00 calls for a Part 03 gate report while the strict execution order places Part 03 after Part 02. The requestor selected this sequencing resolution. | Requestor direction recorded; gate implementation and formal approvals pending |

### Part 000 sign-off

- Part 00 gate: **BLOCKED / NOT PASS**.
- Database/schema/data baseline and verified backup: **Not available**.
- Regression/CI and design-gate evidence: **Incomplete**.
- Independent reviewer and product/technical approval: **Pending**.
- Part 01 authorization: **Not granted by this provisional assessment**.
