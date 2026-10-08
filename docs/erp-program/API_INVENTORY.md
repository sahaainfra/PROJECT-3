# API and route inventory

Source inspection and a localhost smoke test, 2026-10-08. No database-backed business API was found. “Auth required” below refers to the route/page contract in source; endpoints not fully exercised are explicitly marked.

| Method | Path | Handler / consumer | Auth / permission | Request and response | Status |
|---|---|---|---|---|---|
| GET, POST | `/api/auth/[...nextauth]` (Auth.js provider, CSRF, sign-in and callback endpoints beneath `/api/auth/*`) | `src/app/api/auth/[...nextauth]/route.ts` → `src/lib/auth.ts`; browser sign-in form | Auth.js manages its callback/CSRF protocol. Credentials callback requires valid active user plus an active company membership. No ERP permission registry. | Auth.js-defined; credentials are email/password; errors are generic in the app form. Provider discovery returns JSON. | `GET /api/auth/providers` returned 200 on localhost and advertised the credentials provider. Credentials verification needs PostgreSQL and was not exercised. |
| GET | `/` | `src/app/page.tsx` | Redirects to `/dashboard`, which is session-protected. | 307 redirect to protected dashboard (anonymous requests continue to sign-in). | Source inspected; not counted as business API. |
| GET | `/sign-in` | `src/app/sign-in/page.tsx` and `src/components/sign-in-form.tsx` | Signed-in session is redirected to dashboard; anonymous access allowed. | HTML page; browser form submits via Auth.js client helper. | Live localhost returned 200 and the sign-in page rendered. |
| GET | `/dashboard` | `src/app/(workspace)/dashboard/page.tsx` | Authenticated session; user’s active company memberships; projects filtered by company role/project membership. | HTML Server Component; query string `companyId` selects only an already-authorized membership. | Anonymous browser navigation redirected to `/sign-in`; authorized data query needs PostgreSQL. |
| GET | `/projects/[projectId]` | `src/app/(workspace)/projects/[projectId]/page.tsx` and `getAuthorizedProject` | Authenticated session and server-side company + project membership. | HTML Server Component; ID is looked up and scope checked; unauthorised/missing project returns not-found. | Source inspected; authenticated/IDOR integration cases need PostgreSQL. |

No OpenAPI file, versioned ERP API, CRUD endpoint, webhook, Socket.IO event, or API consumer contract suite was found.

## Live endpoint evidence

- `GET http://127.0.0.1:3000/api/auth/providers` → HTTP 200, JSON credentials provider.
- `GET http://127.0.0.1:3000/sign-in` → HTTP 200; page title “Buildwise ERP”.
- Anonymous navigation to `/dashboard` redirected to `/sign-in`.

The API route's database-backed credentials callback, throttle, and audit writes were not called because no usable PostgreSQL database was available.
