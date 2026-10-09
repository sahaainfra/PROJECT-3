# Part 01 — Existing System Map (Quick Reference)

## Stack & Versions
- **Frontend**: Next.js 14, React 18, TypeScript 5.6, CSS custom properties
- **Database**: PostgreSQL via `pg` pool; no production DB (greenfield)
- **Migrations**: Custom scripts in `db/migrations/` (2 migrations, additive/reversible)
- **Testing**: Vitest 2.1.2; 6 golden feature-flag tests
- **Lint**: `next lint`, `tsc --noEmit`, `npm run erp:lint-design` (DS-33)
- **CI**: npm scripts only (`erp:regression`, `erp:db-migrate`, `erp:db-rollback`, `erp:db-baseline`, `erp:db-integrity`, `erp:tokens`, `erp:audit`)
- **Deployment**: `next dev`/`build`/`start`; no Docker/Compose, no CI pipeline
- **Env**: `.env.example` with `DATABASE_URL`, `ERP_FLAGS_FORCE_ON`; `DATABASE_URL` not set
- **Font**: `@fontsource/ibm-plex-sans` (IBM Plex Sans, DS-8)
- **Real-time**: Socket.IO not wired; reserved for Parts 11/116

## Repository Structure
- `src/` — design (tokens, icons, navigation), lib (flags, db, api, context), theme (ThemeProvider)
- `app/` — `layout.tsx` (ShellLayout + ThemeProvider), `_tech/` (Technical Console)
- `db/migrations/` — `sys_feature_flags`, `ui_user_preferences`
- `scripts/erp-program/` — baseline, integrity, regression, audit, tokens, lint, migrate
- `docs/erp-program/` — baseline, audit, PROGRAM_RULES.md, CHANGELOG.md, traceability, discovery, impact, test-evidence
- `tests/` — `flags.test.ts`
- `runbooks/` — `rollback_to_baseline.md`

## Authentication
- Not yet implemented in Part 00; reserved for Parts 06/09
- Feature-flag mechanism (`sys_feature_flags`, `ff.pgm`) is the only auth-related code
- Session-based via PostgreSQL; no JWT implementation

## Authorisation
- Feature-flag-gated per company/project/role/user
- Permission keys: `<module>.<feature>.<action>` format
- Registered in `sys_feature_flags` table
- KNOWN_FLAGS: `ff.pgm`, `ff.pgm.theme`, `ff.pgm.launchpad`, `ff.tech_console`
- Deny-by-default: `enabled DEFAULT false`
- Scope isolation: per company/project/site via `scope_type` + `scope_id`
- Four-layer authorisation (SA-5): UI + API + service + data access

## Modules Found
| Module | Routes | Screens | Tables | APIs | Status |
|---|---|---|---|---|---|
| Program Baseline (Part 00) | `/`, `/_tech` | Shell, Home, Theme prefs, Design system | `sys_feature_flags`, `ui_user_preferences` | Feature flag service | ✅ Green |
| Feature Flags | N/A | Flag admin UI (Part 06/146) | `sys_feature_flags` | `isEnabled`, `getEnabledFlags` | ✅ Green |
| User Preferences | N/A | Theme/density/locale (localStorage) | `ui_user_preferences` | `getEnabledFlags` context | ✅ Green |
| Technical Console | `/_tech` | Minimal shell, baseline report | None (reserved namespace) | None (gated by `ff.tech_console`) | ✅ Green |

## Workflows & Approvals
- Feature flag evaluation: VERIFY, OBSERVE mode
- Schema integrity check: `npm run erp:db-integrity`, exit 0 on pass
- Regression run: `npm run erp:regression`, vitest + lint + integrity + typecheck
- Design token generation: `npm run erp:tokens`, 21/21 contrast pairs pass
- Audit record creation: `npm run erp:audit`, PROGRAM_AUDIT.csv + part-000.md
- Protocol control registration: CP-PGM-01..CP-PGM-03 in `protocol_baseline.md`, OBSERVE mode

## Calculations Inventory
- Feature-flag rollout percentage: `hashPercent()` in `evaluate.ts` (seed-based hash, `% 100`)
- Theme resolution: `ThemeProvider.tsx:42` (system → OS dark/light, explicit → explicit)
- Contrast ratio: WCAG AA 4.5:1 normal, 3:1 UI borders; lint-recomputed from token file
- Checksum: `md5(string_agg(t.h, ',' ORDER BY t.h))` from `db_integrity_check.mjs`

## Reports Inventory
- `BASELINE_REPORT.md` — comprehensive program summary
- `schema_baseline.sql` + `schema_baseline.json` — full DDL export
- `data_baseline.csv` — row counts + checksums per table
- `integrity_check_last.json` — last integrity check results
- `regression-summary.json` — test pass/fail counts, per-check output
- `PROGRAM_RULES.md` — non-negotiable rules + traceability
- `CHANGELOG.md` — change history

## Documents/Storage
- All baselines in `docs/erp-program/baseline/`
- `PROGRAM_RULES.md`, `CHANGELOG.md` at root of `docs/erp-program/`
- `DECISIONS.md`, `CONFLICTS.md` — not yet created
- `DB_ENTITY_MAP.csv`, `EVENT_CATALOGUE.md`, `PERMISSION_REGISTRY.md`, `PROTOCOL_REGISTER.md` — not yet created
- `traceability/part-001.csv` — not yet created

## Notifications & Channels
- None configured — reserved for Parts 16/28

## Real-Time (Socket.IO)
- Not configured — reserved for Parts 11/116
- No namespaces, events, or rooms defined

## Integrations
- CI: npm scripts only
- Database: PostgreSQL via `DATABASE_URL` (not set — greenfield)
- File storage: None configured
- Email/Notifications: None configured
- External ERP/SAP: None configured

## Logging/Monitoring
- Console-only output in scripts
- `npm run erp:db-integrity` exit code for health check
- `PROGRAM_AUDIT.csv` + `part-000.md` for audit trail
- No APM, no Prometheus, no Grafana

## Tests & Coverage
- vitest: 6 tests (flags.test.ts) — all PASS
- Design lint (DS-33): 4 checks — PASS (21/21 contrast pairs)
- DB integrity check: PASS — zero diff on baseline
- Regression harness: evidence written to `test-evidence/part-000/`
- Typecheck: `tsc --noEmit` — PASSES

## Security Observations
- No UI-only authorisation checks (flags evaluated server-side only)
- No hard-coded secrets (only `DATABASE_URL` env var)
- No sensitive data in logs
- No IDOR risk (no dynamic ID routes yet)
- Feature flags deny-by-default (`enabled DEFAULT false`)
- No SQL injection risk (parameterised queries via `pg`)
- Technical Console `/_tech` gated by `ff.tech_console`

## Mobile/Tablet/Desktop Behaviour
- Desktop (1440px): Shell layout works, side navigation
- Tablet (820px): Shell layout works, rail mode
- Mobile (360px): Shell layout works, bottom navigation
- No horizontal scroll at 360px
- Touch targets meet 44px minimum
- High-contrast mode supported (`data-theme="high-contrast"`)
- Density modes supported (`data-density`: compact/cozy/touch)

## Known Defects
- No production database during development (greenfield — baseline is file-based)
- No CI pipeline (npm scripts only; MR/PR automation not configured)
- No notification engine (reserved for Parts 16/28)
- No Socket.IO events (reserved for Parts 11/116)
- No full test suite (only flags.test.ts golden tests)

## Duplicate/Conflict Detection
- No duplicate feature-flag mechanisms
- No duplicate design-token sources
- No duplicate navigation registries
- No duplicate icon families
- No duplicate theme providers
- No duplicate audit frameworks

## Risk Register
- No production DB during development → baseline file-based; DB to be provisioned before Part 03
- Feature-flag mechanism not scalable → design supports user/company/project/role/user scope
- Design token contrast regressions → WCAG AA pairs documented; lint runs in CI
- Navigation registry forbidden-term lint failures → new entries must not contain forbidden terms
- Icon direct-glyph import lint failures → all icons must be from `icons/registry.json`
- Technical Console `/_tech` leak → `ff.tech_console` must remain OFF
- Schema drift from baseline → `npm run erp:db-integrity` in every regression gate
- Rollback complexity → runbook documented; down-migration removes only Part-00 objects
- Incomplete audit trail → AUD-1..AUD-18 must be satisfied before gate approval
- Protocol control non-observance → CP-PGM-01..CP-PGM-03 must stay in OBSERVE mode

## Control Inventory
- CP-AUD-01 (VERIFY): Every validation/limit/approval listed in control inventory — not applicable (greenfield)
- CP-AUD-02 (MONITOR): Identify leakage points and record in risk register — not applicable (greenfield)

## ERD of Existing Database
```
sys_feature_flags:
  id (bigserial, PK), key (text, unique+index), description (text), scope_type (text, default 'global'),
  scope_id (text), enabled (boolean, default false), rollout_percent (integer, default 0),
  owner_prompt (text, default 'part-000'), created_at (timestamptz, default now()),
  updated_at (timestamptz, default now())

ui_user_preferences:
  user_id (text, PK), theme (text, default 'light', CHECK: light/dark/high-contrast),
  density (text, default 'cozy', CHECK: compact/cozy/touch), locale (text, default 'en'),
  number_format (text, nullable), date_format (text, nullable),
  default_company_id (text, nullable), default_project_id (nullable),
  default_site_id (text, nullable), landing_route (text, nullable),
  updated_at (timestamptz, default now())
```

## DB_ENTITY_MAP.csv
| target_entity | existing_table | existing_columns_used | decision | notes |
|---|---|---|---|---|
| sys_feature_flags | sys_feature_flags | key, enabled, scope_type, rollout_percent | REUSE | Part 00 migration table |
| ui_user_preferences | ui_user_preferences | theme, density, locale, default_* | REUSE | Part 00 migration table |
| (empty) | (none) | (none) | NEW | Future modules to be added in Parts 02–130 |

## Key Flags
- `ff.pgm` — master flag (OFF by default in production)
- `ff.pgm.theme` — theme bridge (OFF by default)
- `ff.pgm.launchpad` — Home launchpad (OFF by default)
- `ff.tech_console` — Technical Console (OFF by default)

## Device Breakpoints (from tokens.json)
- bp-mobile: 360px
- bp-tablet: 820px
- bp-desktop: 1440px

## Summary
Part 00 is a greenfield foundation establishing: git tag `erp-baseline-v0`, schema/data/protocol baselines, feature-flag mechanism, design system tokens/themes/navigation/icons, application shell, internal audit framework (AUD-1..AUD-18), regression harness, CHANGELOG, and rollback runbook. All existing functionality is preserved; no destructive changes. Part 01 audits this baseline and produces inventory documentation.