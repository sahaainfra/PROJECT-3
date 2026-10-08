# Part 000 — Provisional impact sheet

**Status: PROVISIONAL / BLOCKED — no implementation or production baseline approval**  
**Assessment date:** 2026-10-08  
**Scope:** documentation-only assessment of the Buildwise scaffold. No application code, database schema, or data was changed.

| MI-36 question | Finding / impact |
|---|---|
| Master data used | Source declares `Company` and `Project`, plus membership models. Their deployment and data are not verified. No construction-domain masters were found; see `ITEM_LIKE_MASTERS.md`. |
| Transactions created | None by this assessment. No bootstrap, migration, application form, or database operation was run. |
| Records affected | None. Only Part 00 assessment documentation is added/updated. |
| Dependent modules | Existing auth and workspace screens depend on Prisma/PostgreSQL and NextAuth. Program-level feature flags, shell, regression framework, and shared engines are absent. |
| Permissions | Current source uses company/project memberships and coarse roles. No Part 00 feature flag, technical-console access, centralized permission registry, or step-up MFA exists. |
| Workflow | No business workflow/approval engine or existing business transaction lifecycle was found. Authentication and membership are not treated as substitutes. |
| Calculations | The current calculation inventory contains authorized project and status counts only. No financial or construction calculation was found; no golden numerical outputs can be captured. |
| Reports | No report/export implementation or frozen report dataset was found. There are no report outputs/hashes to preserve. |
| Audit records | An `AuditEvent` model and authentication audit writes are declared in source; deployed persistence and records are unverified. This assessment created no application audit records. |
| Financial impact | None. No financial posting or financial business feature was found. |
| Project/WBS/BOQ/cost relationships | A declared `Project` model exists. WBS, BOQ, activity, cost-code, budget, and posting relationships were not found. |
| Mobile/tablet/desktop behaviour | Prior Part 001 evidence records sign-in rendering at 360×800, 820×1180, and 1440×900 without horizontal document overflow. Authenticated screens were not data-tested. Part 00 shell/template visual baselines do not exist. |
| Existing functionality at risk | Global shell/theme changes could affect sign-in, dashboard, and project pages. No visual regression baseline or approved production commit exists to quantify risk. No such changes were made. |
| Test approach | Fresh `npm test` passed 4 tests; `npm run typecheck`, `npm run lint`, and `npm run build` passed. `npm run erp:regression` is unavailable. Database integrity, browser regression, design gates, golden APIs/reports, backup/restore, and CI remain unverified. |
| Regression verification | No Git repository/main branch or `erp:regression` harness exists. This assessment cannot certify unchanged production behavior or satisfy the Part 00 gate. |

## Required follow-up before Part 00 can pass

- Identify the authoritative ERP source/repository and production commit; establish the program branch/tag only against that approved commit.
- Provide an isolated, authorized database and storage target, with suitable read-only catalogue credentials and separately approved backup/restore access.
- Produce and verify schema/data baselines, golden behavior/report outputs, and a recoverable backup without writing to production.
- Implement and run the program regression and design gates against that target; secure review and product/technical approvals.
- Complete Part 00 traceability and its audit record. Until then, Part 00 remains blocked and Part 01 cannot proceed.
