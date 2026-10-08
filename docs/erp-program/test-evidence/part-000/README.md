# Part 000 provisional evidence

**Gate: BLOCKED / NOT PASS**  
**Date:** 2026-10-08  
**Scope:** current Buildwise scaffold only; source checks and anonymous-route smoke verification. No usable database was available.

## Available local checks

- `npm run erp:regression`: passed after strict feature-flag configuration parsing and its tests were added; it runs tests, lint, typecheck, and production build. The latest run recorded 11 passing tests and 0 failures in [source-check evidence](runs/source-checks-2026-10-08T08-00-28-198Z.json), including the commit and dirty worktree paths.
- The source regression check is not a database check and did not invoke a database tool or database-backed route.
- Live browser smoke verification at `http://127.0.0.1:3000`: `/` redirected to `/sign-in`; `/sign-in` rendered with no horizontal overflow at 360, 820, and 1440 px; `/dashboard` redirected to `/sign-in`; and `/api/auth/providers` returned the credentials-provider JSON. The password visibility control changed its input type in the running page, and the browser reported no console errors or warnings.
- After the latest production build, the dev preview restarted successfully. The same anonymous route checks and password visibility interaction passed with no browser console/page errors; no credentials were submitted in this verification.
- During one browser validation interaction, the dev-server log recorded two `POST /api/auth/callback/credentials` requests. Both failed because `localhost:5432` refused the connection at the Prisma login-throttle query. No successful database connection or mutation is evidenced. The dev server was subsequently restarted only to render the anonymous sign-in preview; no further credential submission or database-backed action was performed.

## Missing required gates

- Git baseline: repository is on `main` at the recorded source commit, but the worktree is dirty; no approved baseline commit or tag exists.
- Database: no authorized database is available. Schema/data integrity, successful database-backed login/workspace tests, backup/restore, and migration checks are not run. The refused callback attempt is recorded above and in [CONFLICTS.md](../../../../CONFLICTS.md). PostgreSQL access remains deferred until the requestor provides an authorized database.
- Golden API/report outputs are not run; no business report implementation or approved fixture set exists.
- CI, visual regression, theme/token/navigation/icon lint, contrast, axe, permissions, and protocol matrices: not present or not run.
- Independent technical/product review and approved Part 00 audit: pending.

See [the provisional baseline report](../../baseline/BASELINE_REPORT.md), [discovery](../../discovery/part-000.md), and [impact sheet](../../impact/part-000.md). Passing local build checks do not imply Part 00 acceptance.
