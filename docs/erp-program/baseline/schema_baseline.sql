-- Schema baseline — captured 2026-10-09T00:00:00.000Z
-- Part 00 program baseline (section 5.3). Read-only capture with read-only credentials.
-- This represents the state after Part 00 migrations are applied.
-- Greenfield: no production database yet; baseline captures migration-defined structure.

-- Table: sys_feature_flags
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

-- Table: ui_user_preferences
CREATE TABLE IF NOT EXISTS ui_user_preferences (
  user_id            text PRIMARY KEY,
  theme              text NOT NULL DEFAULT 'light',
  density            text NOT NULL DEFAULT 'cozy',
  locale             text NOT NULL DEFAULT 'en',
  number_format      text,
  date_format        text,
  default_company_id text,
  default_project_id text,
  default_site_id    text,
  landing_route      text,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_ui_user_preferences_theme CHECK (theme IN ('light', 'dark', 'high-contrast')),
  CONSTRAINT ck_ui_user_preferences_density CHECK (density IN ('compact', 'cozy', 'touch'))
);

-- End of schema baseline