# Protocol baseline — provisional

**Status: BLOCKED / SOURCE-ONLY**  
**Part:** 000  
**Assessment date:** 2026-10-08

This inventory reflects only workflows visible in the checked-in Buildwise scaffold. It does not establish workflows in an external or deployed ERP database.

| Existing workflow / path | PLAN | VERIFY | APPROVE | EXECUTE | RECORD | MONITOR | RECONCILE | CLOSE | Evidence / limitation |
|---|---|---|---|---|---|---|---|---|---|
| Credentials sign-in | N/A | N/A | N/A | N/A | Partial | N/A | N/A | N/A | Auth.js credentials flow and authentication `AuditEvent` writes are declared in source; persisted behavior is not database-verified. This is not a business approval workflow. |
| Company/project membership authorization | N/A | Partial | N/A | N/A | N/A | N/A | N/A | N/A | Server-side membership checks are present in `src/lib/authorization.ts`; no central protocol/workflow engine or full action ledger was found. |
| Project creation / procurement / receipt / billing / attendance / payroll / reports | Not found | Not found | Not found | Not found | Not found | Not found | Not found | Not found | No corresponding business implementation or transaction model was located in the source inventory. External production systems were not inspected. |

## Part 00 control-point readiness

| Control point | Required evidence | Current finding |
|---|---|---|
| CP-PGM-01 — PLAN | Previous Part regression-gate evidence | No previous Part. The current `erp:regression` script is absent, so the baseline gate is not established. |
| CP-PGM-02 — VERIFY | Integrity report before/after migration batches | No database target or integrity checker; no migration was run. |
| CP-PGM-03 — CLOSE | Signed Definition-of-Done checklist | Part 00 is blocked; no approval or sign-off is claimed. |

No protocol engine was created or seeded by this documentation-only assessment. Register/evaluate these control points only through their owning shared engine when available and approved.
