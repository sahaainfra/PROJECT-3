# Protocol Baseline — Part 00

## Protocol Control Points (CP-PGM-01..CP-PGM-03)

All protocol control points are registered in **OBSERVE mode** — no behaviour change for existing flows. Enforcement (ENFORCE) will be approved in later Parts through the Protocol & Control Engine (Part 14, PC-2).

### CP-PGM-01 — PLAN

| Control point | Description | Enforcement | Evidence | Threshold | Escalation |
|---|---|---|---|---|---|
| CP-PGM-01 | No prompt starts until the previous prompt's regression gate evidence exists | BLOCK | `docs/erp-program/test-evidence/<prompt>/` regression summary | N/A | Tech lead → Program manager |

**Status**: REGISTERED, OBSERVE mode. Verified that the regression harness (`npm run erp:regression`) produces evidence before any new prompt can be started.

### CP-PGM-02 — VERIFY

| Control point | Description | Enforcement | Evidence | Threshold | Escalation |
|---|---|---|---|---|---|
| CP-PGM-02 | Baseline integrity check re-run before and after every migration batch | BLOCK | `docs/erp-program/baseline/integrity_check_last.json` | Zero diff required (additive changes allowed) | Tech lead |

**Status**: REGISTERED, OBSERVE mode. The integrity check script (`scripts/erp-program/db_integrity_check.mjs`) is configured to run and produce a report. On greenfield baseline with no production DB, the check exits 0 with a warning. Once the DB is provisioned, it will validate schema and row counts against `schema_baseline.json` and `data_baseline.csv`.

### CP-PGM-03 — CLOSE

| Control point | Description | Enforcement | Evidence | Threshold | Escalation |
|---|---|---|---|---|---|
| CP-PGM-03 | Prompt closed only with Definition of Done checklist signed | BLOCK | `DECISIONS.md` signed by technical lead | DoD checklist must be fully completed | Program manager |

**Status**: REGISTERED, OBSERVE mode. The Definition of Done checklist is documented in this file and will be signed off by the technical leader before any Part is considered complete.

---

## Existing Workflow Stages (PC-1) Already Enforced

The following PC-1 (Protocol & Control, section 8A) stages are already partially or fully enforced in the existing system, forming the starting point for OBSERVE mode in Part 14:

| PC Stage | Description | Current State |
|---|---|---|
| **PLAN** | Work is planned with proper authorization and scope definition | Partially enforced through feature flags and permission checks |
| **VERIFY** | Baseline integrity and testing verified before deployment | Integrity check script available; not yet integrated into CI for all Parts |
| **APPROVE** | Approvals obtained with maker-checker and authority limits | Workflow engine (Part 12) available; not yet wired to all business transactions |
| **EXECUTE** | Work executed per approved plan | No automatic execution; manual processes dominate |
| **RECORD** | All transactions recorded with audit trail | Audit framework (Part 07, AUD-1..AUD-18) structure defined; not yet fully implemented |
| **MONITOR** | Progress monitored through dashboards and alerts | Design system dashboards available; not yet connected to alert engine (Part 28) |
| **RECONCILE** | Discrepancies reconciled and documented | Not yet implemented |
| **CLOSE** | Work closed with formal sign-off | DoD checklist defined; not yet signed for most Parts |

**Starting point for Part 14 OBSERVE mode**: All 8 stages are documented; the Part 00 baseline captures the current state. The protocol engine will incrementally enforce controls from OFF → OBSERVE → WARN → ENFORCE (PC-13), starting with OBSERVE mode where no existing behaviour is changed.

---

## Protocol Register Entry

| Entry | Key | Scope | Mode | Status |
|---|---|---|---|---|
| Part 00 Protocol Baseline | `pc-pgm-baseline` | Program-wide | OBSERVE | Active |
| Feature Flag Evaluation | `ff.pgm.*` | Company/Project/Role/User | OBSERVE | Active |
| Integrity Check | `erp:db-integrity` | System-wide | OBSERVE | Active |
| Regression Run | `erp:regression` | CI pipeline | OBSERVE | Active |
| DoD Sign-off | `decision.done` | Technical lead | OBSERVE | Pending |

---

## Deviations and Exceptions (PC-3, PC-4, PC-5, PC-6, PC-7, PC-8, PC-9)

Since all control points are in OBSERVE mode, no deviations are currently captured. Should any deviation occur:

- **PC-3**: Exception requested with mandatory reason code
- **PC-4**: Threshold exceeded — escalation path activated
- **PC-5**: Mandatory evidence attached to exception request
- **PC-6**: Maker-checker approval for exception
- **PC-7**: Reason code assigned from controlled vocabulary
- **PC-8**: Ledger entry created for the exception
- **PC-9**: Escalation to program manager if not regularised within threshold

**Current status**: No deviations recorded. All control points active in OBSERVE mode only.