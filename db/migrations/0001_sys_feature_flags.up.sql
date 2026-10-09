-- Part 00 — sys_feature_flags (section 11). Additive, idempotent, reversible.
CREATE TABLE IF NOT EXISTS sys_feature_flags (
  id              bigserial PRIMARY KEY,
  key             text NOT NULL,
  description     text,
  scope_type      text NOT NULL DEFAULT 'global',
  scope_id        text,
  enabled         boolean NOT NULL DEFAULT false,
  rollout_percent integer NOT NULL DEFAULT 0,
  owner_prompt    text NOT NULL DEFAULT 'part-000',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_sys_feature_flags_scope UNIQUE (key, scope_type, scope_id)
);
CREATE INDEX IF NOT EXISTS ix_sys_feature_flags_key ON sys_feature_flags (key);
COMMENT ON TABLE sys_feature_flags IS 'Part 00 — program feature flags (ff.pgm and sub-flags). Readable by the application; writable only by Super Admin from Parts 06/146.';
