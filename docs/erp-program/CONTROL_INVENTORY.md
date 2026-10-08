# Control inventory — current foundation

Evidence is source-level only unless the live-check section says otherwise. `protocol.check()` and the Part 14 engine are not present. Audit-event persistence has not been verified against a database.

| Area / PC-1 stage | Existing control | Source/evidence | Enforcement / observed gap |
|---|---|---|---|
| Authentication / VERIFY | Credentials schema validation; active-user/active-company check; bcrypt compare; generic user-facing error | `src/lib/auth.ts` | Hard within the login callback if the database is available; no MFA/SSO/recovery or login integration test |
| Authentication / MONITOR | Per-account HMAC-keyed throttle window; success/failure audit event | `src/lib/auth.ts`, `LoginThrottle`, `AuditEvent` declarations | App DB-backed only; no IP/edge limit, alert, escalation, correlation ID, or persistence verification |
| Authorization / VERIFY | Authenticated server session; active company membership; company-role project list filter; per-project company/member recheck | `src/app/(workspace)/layout.tsx`, `src/lib/authorization.ts` | Applied to current workspace pages; no centralized RBAC/ABAC, API catalog, field mask, job/socket/portal guard, SoD, or negative DB integration suite |
| Data integrity / RECORD | PKs, uniqueness, declared relations, restrict-on-delete/set-null relation actions, indexes | `prisma/schema.prisma` and initial migration | Declared in source only; not confirmed in a deployed DB |
| Business transaction / PLAN, APPROVE, EXECUTE, RECONCILE, CLOSE | None found | No business service/workflow/ledger model | No control evidence; must be designed by the owning later Parts |
| CP-AUD-01 / VERIFY | Require an evidence-backed complete control inventory | This inventory draft | **Not passed**: DB and all deployed entry points cannot be inspected; predecessor Part 00 gate is absent |
| CP-AUD-02 / MONITOR | Record leakage points and risks | [RISK_REGISTER.md](RISK_REGISTER.md) | Monitoring-only inventory; alert engine/escalation ladder not implemented |

Do not seed/enforce CP-AUD controls or add protocol/gate UI during this read-only Part. Part 14 owns the shared protocol engine; Part 03 owns the gate pipeline.
