-- Part 00 — reverse of 0001_sys_feature_flags. Removes only objects this Part created.
DROP INDEX IF EXISTS ix_sys_feature_flags_key;
DROP TABLE IF EXISTS sys_feature_flags;
