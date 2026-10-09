# Changelog — Integrated Construction ERP

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Added
- Program baseline established (Part 00)
- Baseline tag `erp-baseline-v0` created
- Schema baseline exported to `docs/erp-program/baseline/schema_baseline.sql` and `schema_baseline.json`
- Data baseline exported to `docs/erp-program/baseline/data_baseline.csv`
- Feature-flag mechanism implemented (`ff.pgm`, `ff.pgm.theme`, `ff.pgm.launchpad`, `ff.tech_console`)
- Design tokens generated (`erp-design-tokens`: `tokens.json`, `tokens.ts`, `tokens.css`)
- Themes: light, dark, high-contrast; densities: compact, cozy, touch
- Typography: IBM Plex Sans, tabular-figure utility
- Application shell (shell bar, side navigation, context switcher, page header, footer toolbar)
- Navigation registry (1 group, 1 entry — Home launchpad)
- Icon registry (41 semantic icon keys from `erp-outline` family)
- Baseline page templates (Launchpad, List Report, Object Page, Worklist, Overview, Wizard)
- Widget contract and Home launchpad frame
- Theme bridge for existing screens behind feature flag `ff.pgm.theme`
- Internal Part audit framework (AUD-1..AUD-18, `PROGRAM_AUDIT.csv`)
- Technical Console boundary (`/_tech` namespace, `ff.tech_console`)
- Protocol baseline (`protocol_baseline.md`) with CP-PGM-01..CP-PGM-03 in OBSERVE mode
- Regression harness `npm run erp:regression` running unit tests + design gates + DB integrity + typecheck
- Golden characterisation tests (`tests/flags.test.ts`)
- Report baseline (`BASELINE_REPORT.md`)
- Design quality gates (DS-33) configured
- Traceability matrix (`REQ-P000-F01` through `REQ-P000-F26`)
- CHANGELOG.md created

### Changed
- (none yet)

### Deprecated
- (none yet)

### Removed
- (none yet)

### Fixed
- (none yet)

## Version History

- **0.1.0** — 2026-10-09: Program baseline established (Part 00)