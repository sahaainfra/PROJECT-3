# UI inventory

| Route | Screen | Main components | Audience/access | Responsive evidence |
|---|---|---|---|---|
| `/sign-in` | Credentials sign-in | `SignInForm`, visibility toggle, generic error/loading state, branded card | Anonymous; active signed-in users are redirected | Loaded at 360×800, 820×1180, 1440×900; document width equalled viewport at each size |
| `/dashboard` | Company portfolio overview | `WorkspaceShell`, company selector, portfolio metrics, project table/empty state | Authenticated user with active company membership | Not data-rendered: unavailable database prevents login/workspace query; responsive source styling exists |
| `/projects/[projectId]` | Project overview | `WorkspaceShell`, status badge, detail cards, summary | Authenticated company member with project access or company-admin role | Not data-rendered: unavailable database/session; responsive source styling exists |
| `/` | Root redirect | Next.js redirect to `/dashboard` | Same as dashboard | Redirect only |

The app has no launchpad module tiles, approvals/worklists, transaction object-page tabs, user-admin screens, charts/reports, notification centre, or design-system package. The dashboard shows only scope-filtered project counts and contains no internal audit/debug console.

## Live checks

The sign-in page loaded from `http://127.0.0.1:3000/sign-in`; password visibility toggle changed its accessible name from “Show password” to “Hide password”. Anonymous `/dashboard` navigation ended at `/sign-in`. At all measured sign-in widths (360, 820, 1440 px), `document.documentElement.scrollWidth === clientWidth`. Dashboard/project record layouts at those breakpoints still require a database-backed browser walkthrough.

During the later source-only validation, the preview was temporarily restarted and these anonymous checks were repeated. A browser interaction unexpectedly triggered two credential callbacks; both local database connections were refused. The dev server was stopped then restarted for preview use; no successful authentication or database operation is evidenced. See [Part 000 verification evidence](test-evidence/part-000/README.md).
