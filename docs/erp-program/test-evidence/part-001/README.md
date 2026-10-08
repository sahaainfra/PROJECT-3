# Part 001 verification evidence (2026-10-08)

## Workspace/runtime

- Workspace: new `PROJECT-3` Buildwise foundation; no `.git` metadata or pre-existing ERP documentation/database.
- Local URL: `http://127.0.0.1:3000`.
- Dev server started and responsive on the loopback interface for this audit.
- A local process was observed listening on TCP port 5432, but no project database URL/credentials identify it as the target; no DB connection or query was attempted.
- `GET /sign-in`: HTTP 200; Buildwise sign-in form rendered.
- `GET /api/auth/providers`: HTTP 200 JSON; Auth.js credentials provider returned.
- `GET /api/auth/csrf`: HTTP 200 JSON; Auth.js returned a CSRF token (token value intentionally not retained).
- `GET /api/auth/session`: HTTP 200 JSON; empty session for anonymous browser.
- Anonymous browser navigation to `/dashboard`: redirected to `/sign-in`.
- Password visibility control toggled between “Show password” and “Hide password”.
- Sign-in page viewport checks at 360×800, 820×1180, and 1440×900: document width equalled viewport width at each size (no horizontal document overflow).
- No screenshots or sensitive values are stored in this evidence bundle.

## Source/build checks available at this checkpoint

The preceding foundation implementation checkpoint reported:

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: 4 access-policy unit tests passed.
- `npm run build`: pass; `/dashboard` and `/projects/[projectId]` were listed as dynamic/server-rendered routes.
- Prisma schema validation/client generation and SQL migration generation: pass.
- `npm audit --audit-level=high` and runtime-only audit: zero vulnerabilities at that checkpoint.

The Part 001 audit itself changed documentation only. Re-run all commands against the exact current workspace/lockfile before release; this note is not an automated CI artifact.

## Not run / blocked

- `erp:regression`, Part 00 evidence gate, schema/data integrity comparison, DB catalogue inspection, live migration apply, data-quality/orphan scan, database-backed auth, tenant-isolation integration tests, golden API/report outputs, backup/restore, OpenAPI contract diff, performance benchmark, full authenticated dashboard/project walkthrough, complete device screenshots, security acceptance gate, independent peer review, technical-lead sign-off.
- Docker and `psql` are unavailable in the host; no `.env`/`DATABASE_URL` is configured.

**Gate result: BLOCKED / NOT PASS.** This evidence verifies the rendered unauthenticated shell and live Auth.js discovery endpoint only; it does not satisfy Part 001 acceptance criteria.
