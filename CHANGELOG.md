# Changelog

## Unreleased

### Documentation
- Added a provisional Part 000 baseline assessment for the Buildwise scaffold; production baseline, regression gate, and Part 00 approval remain blocked.
- Added a provisional Part 001 source inventory and verification notes; database-backed audit and predecessor gate remain blocked.
- Re-scoped the Part 00 evidence contract for this new-project scaffold; production-baseline claims remain explicitly excluded and provisional approval/review gates remain open.

### Added
- Added a source-only `erp:regression` runner with per-run evidence and a GitHub Actions workflow; it does not claim database, browser, report, backup, or Part 03 approval gates.
- Added server-evaluated, environment-configured feature-flag helpers with fail-closed omitted-flag behavior and company/project/role/user scopes; the helpers are not authorization and are not yet wired to application UI.
- Added strict parsing for supported feature-flag configuration and focused tests for omitted, scoped, malformed, and unsupported configurations.

- Initial Buildwise construction ERP foundation with PostgreSQL persistence, credentials authentication, company/project membership boundaries, and a responsive portfolio workspace.
