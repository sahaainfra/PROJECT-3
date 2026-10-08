# Buildwise Construction ERP

Buildwise is a new construction ERP codebase. The first implementation slice is the platform foundation: credentials sign-in, company and project membership boundaries, a responsive portfolio workspace, and an audited project overview.

## Current foundation

- Next.js App Router, React, and strict TypeScript.
- PostgreSQL persistence through Prisma; all schema changes are versioned migrations.
- Auth.js credentials with bcrypt password hashes, JWT sessions, generic sign-in errors, and a PostgreSQL-backed per-account login throttle.
- Company membership is required before a user can enter a workspace. Company/project scope is resolved from the authenticated server session and re-authorized in database queries; request-supplied IDs never grant access by themselves.
- Company and project records are isolated by membership; company admins and super admins can see company projects, while members need an active project membership.
- Active-user status is checked on protected requests. Sign-in success/failure events are written to the audit log.
- There is no public registration, demo data, seeded production account, or unprotected admin bootstrap route.

This is the platform foundation, not the completed ERP. Project setup, user administration, finance, procurement, execution, reporting, integrations, and production deployment controls remain future work. The UI exposes only workflows that are implemented; it does not present placeholder action buttons.

## Local development

Requirements: Node.js 20.9+ and Docker Compose (or a compatible PostgreSQL 16 instance).

1. Copy `.env.example` to `.env`. Change the local PostgreSQL password and generate `AUTH_SECRET` with:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   `.env.example` values are development-only. Use a managed secret store and managed PostgreSQL for deployed environments.

2. Start local PostgreSQL and install dependencies:

   ```powershell
   docker compose up -d postgres
   npm install
   ```

3. Generate the Prisma client and apply the checked-in migrations:

   ```powershell
   npm run db:generate
   npm run db:migrate:deploy
   ```

   To add a migration during local development after changing the Prisma schema, use `npm run db:migrate:dev -- --name describe_change`; review and commit the generated migration. Production/release environments apply committed migrations only.

4. For the one-time first administrator and company, set the `ERP_BOOTSTRAP_CONFIRM`, `ERP_ADMIN_*`, and `ERP_COMPANY_*` variables in `.env`, then run:

   ```powershell
   npm run admin:bootstrap
   ```

   Use a unique 15+ character password (maximum 72 UTF-8 bytes). The command refuses to create a second super administrator. Remove the bootstrap values from `.env` immediately after use.

5. Start the app:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`.

The bootstrap command creates the first administrator and company only; it does not create sample projects or additional users. Those management workflows are not part of this foundation slice.

## Validation

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Authentication/database integration checks require a running PostgreSQL database and applied migrations. Never point local migration commands at production.

## Program discovery

The provisional Part 001 source inventory is in [docs/erp-program/discovery/part-001.md](docs/erp-program/discovery/part-001.md). It does not claim a live database or production ERP audit; the Part 00 regression gate, database connection, independent review, and technical-lead sign-off are still required.

## Security and operations notes

- Deploy behind HTTPS. Set `AUTH_SECRET` in the deployment secret manager, and configure edge/reverse-proxy request-rate limits in addition to the account throttle.
- Set `NEXTAUTH_URL` to the canonical HTTPS application origin in each deployed environment.
- `docker-compose.yml` is a local-development service definition, not a production database deployment strategy.
- Use a managed PostgreSQL service with encrypted connections, backups, point-in-time recovery, monitoring, and a tested restore procedure in production.
- Run `npm run db:migrate:deploy` as a controlled release step before serving new code. Do not use `prisma db push` in production.
- Bootstrap credentials are one-time operator input; never commit `.env`, real passwords, or production connection strings.
- The login throttle is keyed using an HMAC of the normalized email, so raw email addresses are not stored in throttle keys. Configure an external edge limit as protection against distributed attempts and account lockout abuse.
