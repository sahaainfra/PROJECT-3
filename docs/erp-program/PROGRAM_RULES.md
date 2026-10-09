# Program Rules — Part 00 Baseline

## Program Baseline

| Field | Value |
|---|---|
| Program | Integrated Construction ERP — one database, one security model, one workflow / audit / notification / document / reporting / AI-governance layer |
| Phase | 01 — PROGRAM BASELINE, DESIGN FOUNDATION & DISCOVERY |
| Sequence | Part 00 in the build sequence Part 00 → Part 163 |
| Module code / feature flag | `pgm` / `ff.pgm` |
| Control principle | **PLAN → AUTHORIZE → EXECUTE → RECORD → VERIFY → ANALYZE → CONTROL → CLOSE**, operated as the eight-stage protocol cycle |
| Depends on | — (no prerequisite Part) |
| Consumed by | Parts 01–04 |

### End State Guarantee

Any later change can be proven non-destructive against this baseline. The baseline includes:

- **Schema baseline**: Full DDL of current database (tables, columns, types, defaults, PK/FK/unique/check constraints, indexes, views, functions, triggers, sequences) stored in `docs/erp-program/baseline/schema_baseline.sql` and `schema_baseline.json`.
- **Data baseline**: Per-table row counts and deterministic checksums stored in `docs/erp-program/baseline/data_baseline.csv`.
- **Behaviour baseline**: Characterisation (golden) tests for critical flows, frozen API response snapshots.
- **Report baseline**: Generated every existing report/export on the frozen dataset, stored for byte/semantic comparison.
- **Feature-flag mechanism**: Server-side `isEnabled(flagKey, context)` and client-side helper; flags evaluated per company/project/role/user; deny-by-default.
- **Regression harness**: `npm run erp:regression` runs existing tests + golden tests + DB integrity check + report comparison, writing evidence to `docs/erp-program/test-evidence/<prompt>/`.
- **Rollback plan**: Redeploy baseline tag and restore baseline DB backup; full DB + file-storage backup taken and verified.
- **CHANGELOG.md**: Entry "Program baseline established".
- **Protocol baseline**: For each existing workflow, which PC-1 stages it already enforces, in `docs/erp-program/baseline/protocol_baseline.md`.

---

## Non-Negotiable Rules (SA-3, SA-19, SEC-1..SEC-28)

1. **Database preservation** (SA-3): Existing table names, field names, relationships, constraints, indexes, data, business calculations, APIs, routes, screens, reports, workflows, integrations, permissions and background processes must not be changed. No destructive migrations against production.

2. **Additive only** (section 31): New tables, 1:1 extension tables (`<table>_ext`), nullable columns with safe defaults, views, compatible services, new API versions, configuration — all through non-destructive, reversible migrations. Pre-existing tables must show identical schema, row counts and checksums after any migration.

3. **Four-layer authorisation** (SA-5): Scope isolation per company/project/site; IDs re-authorised on every request (no IDOR); deny-by-default; explicit deny wins. Enforced at UI + API + service + data access. Sensitive fields masked in UI, API, exports, search, notifications, chat previews and AI context.

4. **Protocol controls** (section 8A, CP-PGM-01..CP-PGM-03): Register with Protocol & Control Engine (Part 14, PC-2). Services call `protocol.check()` inside every business transaction. Deviations only through exceptions (PC-3) with thresholds (PC-4), mandatory evidence (PC-5), maker-checker (PC-6), reason codes (PC-7), ledger (PC-8) and escalation (PC-9). Roll out OFF → OBSERVE → WARN → ENFORCE (PC-13).

5. **Characterisation tests** (section 9): Assert current behaviour, even if it seems wrong. Wrong behaviour is logged in `CONFLICTS.md`, not fixed here.

6. **Deny-by-default** (section 7): All feature flags, permissions, and scope rules deny by default. Explicit deny wins.

7. **Versioned, paginated, filterable APIs** (SA-11): Never change an existing contract — add `/v2` or new routes only.

8. **Audit trail** (SA-7): User, role, date/time, IP/device, previous/new value, approval/rejection, comment, document, source and related transaction for every create, update, soft delete, state change, approval, print, export and download.

9. **Secure development** (SEC-1..SEC-28): Register every route, job and socket event (permission, scope rule, schema, rate-limit group). Derive scope from server session. Parameterised queries only. Secure errors. No hard-coded secrets, debug bypasses, hidden accounts or client-only authorisation.

10. **Error handling** (SA-17): Loading, empty, validation, permission, API, network/offline, sync conflict, integration and job-failure states — each stating what happened → why → what the user can do with a correlation ID.

11. **Design system** (17_ENTERPRISE_DESIGN_SYSTEM.md, DS-1..DS-34): Design tokens with light, dark and high-contrast themes and density modes; application shell (shell bar, side navigation, context switcher, page header, footer toolbar); navigation and icon registries; baseline page templates; widget and KPI-card contract; Home launchpad frame.

12. **Internal Part audit** (18_INTERNAL_PART_AUDIT_PROTOCOL.md, AUD-1..AUD-18): Record implemented in `docs/erp-program/audit/part-000.md` and `PROGRAM_AUDIT.csv`. None exposed in business interface.

13. **Technical Console** (DS-32): Route namespace `/_tech` reserved with minimal shell variant, technical roles only, disabled in production by default (`ff.tech_console`). Every access audited. Read-only program baseline report at `/_tech/program/baseline`.

14. **Build sequence** (section 33.2): Part 00 → Part 163 is the only execution order. Part number is the stable cross-reference used in every prompt.

15. **Scope exclusions** (MI-37): BIM and Process Mining are excluded. Never implemented 'opportunistically'.

---

## Program Traceability

Requirement → Part → Migration → Service → API → UI → Test → Evidence stored in `docs/erp-program/traceability/part-000.csv`.

All 26 requirements from section 5 are numbered `REQ-P000-F01` through `REQ-P000-F26` and each is traced to its implementation artifact.

---

## Feature-Flag Conformance (section 5.7)

- `ff.pgm` — master flag for program baseline: shell, design system, navigation (default OFF in production)
- `ff.pgm.theme` — theme bridge for existing screens (compatibility stylesheet); requires master flag
- `ff.pgm.launchpad` — Home launchpad frame; requires master flag
- `ff.tech_console` — Technical Console (`/_tech`); disabled in production by default

Evaluation: per company/project/role/user; rollout percentage support via hash-based bucket assignment; deny-by-default when no matching enabled row.

---

## Design System Conformance (17_ENTERPRISE_DESIGN_SYSTEM.md)

- **DS-4, DS-5, DS-9**: Design tokens (CSS custom properties, TypeScript constants, mobile resources); themes: light, dark, high-contrast; densities: compact, cozy, touch
- **DS-8**: IBM Plex Sans and Plex Sans Devanagari / Noto (SIL OFL) self-hosted; tabular-figure utility for amounts
- **DS-10**: One licensed outline icon family + semantic keys from icon-registry.json; icon-only buttons have accessible names
- **DS-12, DS-29**: Application shell (shell bar, side navigation, context switcher, page header, footer toolbar); tablet rail and mobile bottom navigation
- **DS-13, DS-14**: Navigation registry from navigation-registry.json; entries render only when flag ON, user authorised, route live
- **DS-16, DS-25**: Widget registry schema, KPI-card component, role spaces
- **DS-26, DS-27, DS-28**: Baseline page templates (Launchpad, List Report, Object Page, Worklist, Overview, Wizard)
- **DS-33**: Design quality gates (token lint, icon lint, navigation-registry lint, contrast recomputation, axe, visual regression)
- **DS-32**: Technical Console boundary at `/_tech`

---

## Internal Part Audit Protocol (18_INTERNAL_PART_AUDIT_PROTOCOL.md)

- **AUD-1**: Audit record exists for every Part implementation
- **AUD-2**: Audit record captures implementing team and technical lead
- **AUD-3**: Theme and navigation entry *Shell › App shell, Home launchpad & theme* tracked
- **AUD-4**: Navigation entry *Home launchpad* tracked with route `/` and flag `ff.pgm`
- **AUD-5**: Feature-flag mechanism `isEnabled` and `ff.pgm` registered
- **AUD-6**: Schema baseline export and integrity check script recorded
- **AUD-7**: Characterisation (golden) tests recorded
- **AUD-8**: Protocol control points CP-PGM-01..CP-PGM-03 recorded
- **AUD-9**: Regression harness `npm run erp:regression` recorded
- **AUD-10**: Rollback plan and baseline backup recorded
- **AUD-11**: CHANGELOG.md entry recorded
- **AUD-12**: Protocol baseline `protocol_baseline.md` recorded
- **AUD-13**: Design token and theme records recorded
- **AUD-14**: Typography and icon registry records recorded
- **AUD-15**: Application shell and navigation registry records recorded
- **AUD-16**: Page templates and widget contract records recorded
- **AUD-17**: Theme bridge for existing screens recorded
- **AUD-18**: Technical Console boundary `/_tech` recorded

The implementing team and technical lead sign off on this record in `DECISIONS.md`.

---

## Rollback Procedure

1. Redeploy the `erp-baseline-v0` git tag
2. Restore the verified baseline database backup
3. Restore the `docs/erp-program/baseline/` directory from the backup
4. Run `npm run erp:db-integrity` to confirm schema/data consistency
5. Redeploy the application with `ff.pgm` set OFF to disable new features

---

## Design Quality Gates (DS-33)

- Token lint: all generated CSS/TS conforms to `tokens.json` source
- Icon lint: no direct glyph imports; all icons referenced by semantic key from registry
- Navigation-registry lint: no forbidden terms; no empty groups; no technical labels
- Contrast recomputation: from token file shows zero FAIL (WCAG AA: 4.5:1 normal, 3:1 UI borders)
- Axe accessibility: shell and baseline templates pass
- Visual regression: 360×800, 820×1180, 1440×900 px × light and dark — baseline captured before and after theme bridge

---

## Traceability Matrix (REQ-P000-Fnn)

| Req | Description | Part | Migration | Service | API | UI | Test | Evidence |
|---|---|---|---|---|---|---|---|---|
| REQ-P000-F01 | Branch tag and baseline snapshot | 00 | — | — | — | — | Tag `erp-baseline-v0` exists | Git tag |
| REQ-P000-F02 | Documentation set `docs/erp-program/` | 00 | — | — | — | — | `PROGRAM_RULES.md` exists | File check |
| REQ-P000-F03 | Schema baseline export | 00 | `0001_sys_feature_flags`, `0002_ui_user_preferences` | `schema_baseline_export.mjs` | — | — | `schema_baseline.sql` and `schema_baseline.json` exist | File check |
| REQ-P000-F04 | Data baseline with row counts + checksums | 00 | same | `schema_baseline_export.mjs` | — | — | `data_baseline.csv` exists | File check |
| REQ-P000-F05 | DB integrity check script | 00 | — | `db_integrity_check.mjs` | — | — | Script runs, exit 0 on pass | Script check |
| REQ-P000-F06 | Characterisation (golden) tests | 00 | — | — | — | — | vitest suite passes | `tests/` directory |
| REQ-P000-F07 | Report baseline outputs | 00 | — | — | — | — | Every existing report generated and hashed | `baseline/` directory |
| REQ-P000-F08 | Feature-flag helper server+client with unit test | 00 | `sys_feature_flags` | `isEnabled`, `FlagsProvider`, `useFlag` | — | — | Unit test in `tests/flags.test.ts` passes | Test file |
| REQ-P000-F09 | Regression harness `npm run erp:regression` | 00 | — | `regression.mjs` | — | — | Command runs all checks, writes evidence | Script check |
| REQ-P000-F10 | Rollback plan documented + backup verified | 00 | — | — | — | — | `runbooks/rollback_to_baseline.md` exists + backup restores | Doc + script |
| REQ-P000-F11 | CHANGELOG.md entry "Program baseline established" | 00 | — | — | — | — | `CHANGELOG.md` exists with entry | File check |
| REQ-P000-F12 | Protocol baseline `protocol_baseline.md` | 00 | — | — | — | — | File exists with PC-1 stage mapping | File check |
| REQ-P000-F13 | Design tokens + themes (light/dark/high-contrast + densities) | 00 | `tokens.json` generation | `generate-tokens.mjs` | — | — | `tokens.css`, `tokens.ts` generated | Generated files |
| REQ-P000-F14 | Typography (IBM Plex Sans, tabular-figure utility) | 00 | `tokens.json` | `generate-tokens.mjs` | — | — | Font loaded, tabular figures used | Render check |
| REQ-P000-F15 | Application shell (DS-12, DS-29) | 00 | — | `ThemeProvider.tsx`, shell components | — | — | Shell renders with navigation, context switcher, etc. | Visual check |
| REQ-P000-F16 | Navigation registry (DS-13, DS-14) | 00 | — | `navigation/registry.json` | — | — | Entries render only when flag ON + authorised | Render check |
| REQ-P000-F17 | Icon registry (DS-10) | 00 | — | `icons/registry.json` | — | — | Icons referenced by key only | Render check |
| REQ-P000-F18 | Baseline page templates (DS-26, DS-27, DS-28) | 00 | — | — | — | — | Launchpad, List Report, Object Page, Worklist, Overview, Wizard | Component check |
| REQ-P000-F19 | Widget contract + Home launchpad (DS-16, DS-25) | 00 | — | `widget` schema, KPI-card | — | — | Home shows launch tiles for live modules only | Render check |
| REQ-P000-F20 | Theme bridge for existing screens | 00 | — | compatibility stylesheet behind `ff.pgm.theme` | — | — | Visual-regression baselines captured | Diff report |
| REQ-P000-F21 | Internal Part audit framework (AUD) | 00 | — | `audit.mjs` | — | — | `docs/erp-program/audit/part-000.md` + `PROGRAM_AUDIT.csv` | File check |
| REQ-P000-F22 | Technical Console boundary (`/ _tech`) | 00 | — | route handler + `ff.tech_console` | — | — | `/_tech` unreachable for business roles | Access check |
| REQ-P000-F23 | Security acceptance gate (SEC-28) | 00 | — | — | — | — | functional, security, authorisation, regression, performance, backup/recovery tests pass | CI report |
| REQ-P000-F24 | Definition of Done (SA-20) met; `ff.pgm` can enable in production | 00 | — | — | — | — | No dummy data/placeholder buttons in production paths | DoD checklist |
| REQ-P000-F25 | Every existing screen opens inside new shell with unchanged behaviour | 00 | — | — | — | — | Visual regression diffs only approved token changes | Visual check |
| REQ-P000-F26 | Light/dark/high-contrast + density switching works | 00 | — | `ThemeProvider` + tokens | — | — | Contrast table zero FAIL | Axe + lint check |

---

## DEFINITION OF DONE (SA-20)

This Part is **COMPLETE** only when every `REQ-P000-Fnn` criterion is met and its internal audit (AUD-1..AUD-18) is approved — proven by the Part 03 gate report, not by a page loading.

The Part 03 gate report confirms:
- Schema-diff on pre-existing tables: EMPTY (no destructive changes)
- Golden outputs unchanged
- OpenAPI diff without breaking change
- Permission/SoD tests pass
- Protocol test matrix for CP-PGM-01..CP-PGM-03 in OBSERVE mode
- Design gates (DS-33) all passed