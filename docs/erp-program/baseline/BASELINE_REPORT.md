# Program baseline report — provisional

**Part:** 000 — Master Development Directive, Program Baseline & Enterprise Design Foundation  
**Status:** **BLOCKED / NOT ESTABLISHED**  
**Assessment date:** 2026-10-08  
**Evidence scope:** checked-in `PROJECT-3` Buildwise scaffold and local checks only. This is not a production baseline, a live database inventory, or a Part 00 pass.

## Environment and source baseline

| Item | Observed | Qualification |
|---|---|---|
| Application | Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Prisma 6.19.3, PostgreSQL target, NextAuth credentials | From the manifest and source declarations; not a production deployment inventory. |
| Routes | `/`, `/sign-in`, `/dashboard`, `/projects/[projectId]`, `/api/auth/[...nextauth]` | Source inventory; DB-backed workspace behavior is not verified. |
| Declared Prisma models | `User`, `Company`, `CompanyMembership`, `Project`, `ProjectMembership`, `LoginThrottle`, `AuditEvent` | Source schema only; actual database objects and row counts are unknown. |
| Migration files | One checked-in migration directory, `0001_foundation` | Whether it was applied is unknown. |
| Git | No `.git` metadata; `git rev-parse --is-inside-work-tree` failed | No production commit, branch, or baseline tag could be established. |
| Database configuration | No project `.env`; no `DATABASE_URL` in the process environment | No connection or query was attempted. |
| Regression harness | `npm run erp:regression` is not defined | Full regression, integrity, golden-output, and report comparison gates are unavailable. |
| CI | No workflow files located in the workspace | No CI gate evidence. |
| Feature flags/design foundation | No app-level feature flag, generated token package, theme provider, navigation/icon registries, or technical console found | Part 00 implementation is not started. |
| Business reports / calculations | No business report/export; only authorized project count/status summaries are inventoried | No report hashes or financial/quantity golden outputs exist. |
| Backup / restore | No identified DB/storage target or verified backup | No backup/restore claim is made. |

## Checks run against the current workspace

| Check | Result |
|---|---|
| `npm test` | PASS — 4 tests, 0 failures. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS — Next.js production build compiled and listed the existing routes. |
| `npm run erp:regression` | BLOCKED — npm reports missing script. |
| Database schema/data integrity | NOT RUN — no configured or authorized target. |
| API/report golden comparison | NOT RUN — no fixture dataset, golden snapshots, or report outputs. |
| Backup and restore rehearsal | NOT RUN — no identified target or backup authority. |
| Git baseline branch/tag | NOT RUN — workspace is not a Git repository. |
| CI, design lint, accessibility, visual regression | NOT RUN — corresponding Part 00/03 gates are not implemented. |

Earlier provisional Part 001 evidence records a localhost sign-in smoke test and Auth.js discovery endpoints at `http://127.0.0.1:3000`; it also records NextAuth warnings when `NEXTAUTH_URL` and a secret are absent. These checks do not establish authenticated, database-backed production behavior.

## Gate decision

**Part 00 is BLOCKED.** This report does not claim:

- a production schema, data, code, or report baseline;
- a safe production branch/tag or verified backup;
- an `erp:regression` or CI pass;
- a completed feature-flag, design-system, shell, or technical-console implementation;
- an approved Part 00 audit or authorization to begin Part 01.

Resume only after the authoritative system and authorized isolated database/storage targets are identified and the missing baseline/approval evidence can be produced.
