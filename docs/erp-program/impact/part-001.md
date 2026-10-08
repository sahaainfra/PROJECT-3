# Part 001 impact sheet

Part 001 is a read-only discovery and inventory activity. It must not alter application behaviour, schema, or data. This sheet reflects only the new Buildwise foundation in this workspace, not a production ERP.

| MI-36 question | Finding / impact |
|---|---|
| Master data used | Declared `Company` and `Project`; no construction-domain master data. Database existence is unverified. |
| Transactions created | None by this audit. Existing bootstrap code can create an initial user/company when explicitly run; it was not run. |
| Records affected | None. Audit deliverables are documentation only. |
| Dependent modules | No delivered construction business modules. Auth depends on PostgreSQL, Auth.js, and Prisma. |
| Permissions | Company/project membership and coarse company roles only. No fine-grained permission registry, ABAC, SoD, field masking, or permission catalogue. |
| Workflow | No approval/workflow engine or business transaction lifecycle located. |
| Calculations | No money/rate/tax/quantity calculation code located. Portfolio counts are simple counts over authorized projects. |
| Reports | No report/export implementation located. |
| Audit records | Auth success/failure events are implemented in source; no write was made by the audit. Database persistence is unverified. |
| Financial impact | None; no financial feature or posting path is present. |
| Project/WBS/BOQ/cost relationships | Project exists as a declared model. WBS, BOQ, activity, cost-code, and posting relations were not found. |
| Mobile/tablet/desktop | Sign-in page rendered at 360×800, 820×1180, and 1440×900 with no horizontal document overflow. Authenticated dashboard/project pages could not be exercised without database/session setup. |
| Existing functionality at risk | None from this documentation-only pass; no app files, data, or schema changed. |
| Test approach | Existing npm lint/typecheck/unit/build commands; live `GET /sign-in`, `GET /api/auth/providers`, anonymous `/dashboard` redirect; responsive browser measurements. PostgreSQL tests and sign-in remain blocked. |
| Regression verification | No `erp:regression` script or Part 00 gate evidence exists. Part 00 is a prerequisite; this audit is not signed off. |
