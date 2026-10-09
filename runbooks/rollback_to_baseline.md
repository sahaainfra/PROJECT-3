# Rollback Runbook — Part 00 Baseline

## Overview

This runbook documents the rollback procedure for Part 00 — Program Baseline. Rollback is required to redeploy the baseline tag and restore the baseline database backup if a migration or change introduces destructive modifications.

**Rollback should only be performed if:**
1. A migration introduces a non-additive change to a pre-existing table
2. A feature flag or configuration change causes unexpected behaviour
3. The integrity check (`npm run erp:db-integrity`) reports failures that cannot be resolved additively

## Rollback Procedure

### Step 1: Redeploy Baseline Tag

```bash
# 1.1 Checkout the baseline tag
git checkout erp-baseline-v0

# 1.2 Reset the working tree to match the tag (discard any Part 01+ changes)
git reset --hard erp-baseline-v0

# 1.3 Verify we are at the correct commit
git log --oneline -1
# Expected: erp-baseline-v0 (Part 00 baseline)
```

### Step 2: Restore Baseline Database

```bash
# 2.1 Restore the verified baseline database backup
# Replace <backup-path> with the path to the baseline backup
pg_restore -d erp --no-owner <backup-path>

# 2.2 Or alternatively, run the baseline SQL schema
psql postgresql://erp:erp@localhost:5432/erp -f docs/erp-program/baseline/schema_baseline.sql

# 2.3 Verify the restored schema matches the baseline
npm run erp:db-integrity
# Expected: PASS (zero diff, or only additive changes reported as allowed)
```

### Step 3: Restore Baseline File Storage

```bash
# 3.1 Restore the docs/erp-program/baseline/ directory from backup
cp -r /path/to/baseline-backup/docs/erp-program/baseline/* docs/erp-program/baseline/

# 3.2 Verify the restored files
cat docs/erp-program/baseline/data_baseline.csv
cat docs/erp-program/baseline/integrity_check_last.json
```

### Step 4: Redeploy Application with Flags OFF

```bash
# 4.1 Ensure all program feature flags are OFF
# In production, set ERP_FLAGS_FORCE_OFF or disable flags via the DB admin UI
# Or set the environment variable to force flags OFF
export ERP_FLAGS_FORCE_ON=""

# 4.2 Redeploy the application
npm run build
npm run start

# 4.3 Verify the application runs in baseline mode
# - Shell without new design-tokens theming (if ff.pgm is OFF)
# - No new navigation entries (if ff.pgm is OFF)
# - No launchpad tiles (if ff.pgm.launchpad is OFF)
```

### Step 5: Verify Rollback Completeness

```bash
# 5.1 Run the integrity check one more time
npm run erp:db-integrity
# Expected: PASS with zero failures

# 5.2 Verify the git tag is correct
git status
# Expected: clean working tree, on erp-baseline-v0

# 5.3 Check that no Part 01+ changes are present
git log --oneline -3
# Expected: erp-baseline-v0, followed by earlier commits (no newer Part tags)
```

## Emergency Rollback

If the production database is severely corrupted and no clean backup is available:

1. **Contact the DBA team** immediately to assess backup availability
2. **Use the last known good backup** that was verified against the baseline
3. **Redeploy the application** with `ff.pgm` OFF and `ERP_FLAGS_FORCE_ON` empty
4. **File a post-incident report** documenting the gap in backup procedures

**Never** attempt to reconstruct the database from partial or guessed data. The baseline is the authoritative reference — if the backup is lost, the program must be rebuilt from source code and migration scripts.

## Rollback Checklist

- [ ] Git checkout to `erp-baseline-v0` completed
- [ ] Database restored from verified baseline backup
- [ ] `npm run erp:db-integrity` exits 0 (PASS)
- [ ] `docs/erp-program/baseline/` restored from backup
- [ ] Application deployed with `ff.pgm` OFF
- [ ] No Part 01+ changes in the working tree
- [ ] Technical lead sign-off recorded in `DECISIONS.md`