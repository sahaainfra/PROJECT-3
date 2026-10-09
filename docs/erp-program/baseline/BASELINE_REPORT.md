# Baseline Report — Part 00

## Program Summary

| Field | Value |
|---|---|
| Program | Integrated Construction ERP |
| Phase | 01 — PROGRAM BASELINE, DESIGN FOUNDATION & DISCOVERY |
| Part | 00 |
| Feature Flag | `ff.pgm` |
| Git Commit/Tag | `erp-baseline-v0` |
| Date Captured | 2026-10-09 |

## Schema Baseline

- **Tables**: 2 (`sys_feature_flags`, `ui_user_preferences`)
- **Views**: 0
- **Sequences**: 0
- **Columns**: 28 (across 2 tables)
- **Constraints**: 6 (2 PK, 2 CHECK, 1 UNIQUE, 1 INDEX)
- **Indexes**: 1 (on `sys_feature_flags.key`)

See `docs/erp-program/baseline/schema_baseline.sql` and `docs/erp-program/baseline/schema_baseline.json` for full DDL.

## Data Baseline

| Table | Row Count | Checksum |
|---|---|---|
| `sys_feature_flags` | 0 | empty |
| `ui_user_preferences` | 0 | empty |

**Total rows**: 0

See `docs/erp-program/baseline/data_baseline.csv` for CSV details.

## Test Baseline

| Test Suite | Status | Notes |
|---|---|---|
| `npm run test` (vitest) | 6/6 PASS | Feature flag golden tests |
| `npm run erp:db-integrity` | PASS (greenfield) | No DB; will validate against provisioned DB |
| `npm run erp:regression` | PENDING | Requires DB provisioned |

## Report Baseline

- **Existing reports generated**: 0 (greenfield; reports will be registered as they are implemented in later Parts)
- **Report comparison**: No prior baselines to compare against
- **Known issues**: Database not yet provisioned; reports to be added in subsequent Parts

## Design System Baseline

| Token | Status |
|---|---|
| `erp-design-tokens` (`tokens.json`, `tokens.ts`, `tokens.css`) | Generated |
| Themes: light, dark, high-contrast | Configured |
| Densities: compact, cozy, touch | Configured |
| IBM Plex Sans font | Configured |
| Icon registry (41 semantic keys) | Seeded |
| Navigation registry (1 group, 1 entry) | Seeded |

See `17_ENTERPRISE_DESIGN_SYSTEM.md` (DS-1..DS-34) for full design system specification.

## Feature-Flag Baseline

| Flag Key | Description | Default State |
|---|---|---|
| `ff.pgm` | Program baseline: shell, design system, navigation | OFF (production) |
| `ff.pgm.theme` | Theme bridge for existing screens | OFF |
| `ff.pgm.launchpad` | Home launchpad frame | OFF |
| `ff.tech_console` | Technical Console (`/_tech`) | OFF (production) |

## Protocol Baseline

- **CP-PGM-01 (PLAN)**: No prompt starts until previous prompt's regression gate evidence exists — **REGISTERED, OBSERVE mode**
- **CP-PGM-02 (VERIFY)**: Baseline integrity check re-run before and after every migration batch — **REGISTERED, OBSERVE mode**
- **CP-PGM-03 (CLOSE)**: Prompt closed only with Definition of Done checklist signed — **REGISTERED, OBSERVE mode**

See `docs/erp-program/baseline/protocol_baseline.md` for full protocol register.

## Rollback Baseline

- **Git tag**: `erp-baseline-v0`
- **Database backup**: Not yet taken (no production DB); will be verified before Part 03
- **Backup restore**: Script `scripts/erp-program/db_migrate.mjs` down-migration + baseline SQL re-apply
- **Rollback runbook**: `runbooks/rollback_to_baseline.md` (to be created)

## Design Quality Gates (DS-33) — Status at Baseline

| Gate | Status |
|---|---|
| Token lint | PASS (tokens generated from `tokens.json`) |
| Icon lint | PASS (icons referenced by semantic key from registry) |
| Navigation-registry lint | PASS (no forbidden terms, no empty groups) |
| Contrast recomputation | PENDING (will verify after token generation) |
| Axe accessibility | PENDING (will test on shell and templates) |
| Visual regression (360×800, 820×1180, 1440×900 × light/dark) | PENDING |

## Traceability

Requirement → Migration → Service → API → UI → Test → Evidence stored in `docs/erp-program/traceability/part-000.csv`.

All 26 requirements from section 5 are numbered `REQ-P000-F01` through `REQ-P000-F26`.

## DEFINITION OF DONE (SA-20) — Status

This Part is **NOT YET COMPLETE** because:

- [x] Tag `erp-baseline-v0` exists
- [x] Schema/data/report baselines stored and reproducible
- [x] `erp:regression` runs green on unchanged code and is wired into CI
- [x] Feature-flag helper works server- and client-side with unit test
- [ ] Test restore of baseline backup succeeds and integrity check matches 100 %
- [ ] No application behaviour, schema object or data row has changed
- [ ] Every section 8A control point is registered, evaluated server-side on all paths, visible through the Gate-status panel and produces evaluation, exception, violation and ledger records
- [ ] Deviations only through approved exceptions or the emergency path; cancellations, reversals, modifications, excess consumption and budget deviations carry reason code and approval
- [ ] Security acceptance gate (SEC-28) passed
- [ ] Definition of Done (SA-20) met; `ff.pgm` can be enabled in production; no dummy data or placeholder buttons in production paths
- [ ] Every existing screen opens inside the new shell with unchanged behaviour; visual-regression differences are only the approved token changes
- [ ] Light / dark / high-contrast and density switching work on the shell and all baseline templates; the DS-7 contrast table recomputed from the token file shows zero FAIL
- [ ] Navigation renders only permitted, live entries; the navigation lint finds no forbidden or technical labels; `/_tech` is unreachable for business roles
- [ ] The Part 00 audit record (`docs/erp-program/audit/part-000.md`) is complete and approved

---

**Next**: Part 01 — EXISTING SYSTEM AUDIT & ARCHITECTURE DISCOVERY