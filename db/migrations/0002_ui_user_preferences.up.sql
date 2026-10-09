-- Part 00 — ui_user_preferences (section 11, DS-5). Additive, idempotent, reversible.
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
COMMENT ON TABLE ui_user_preferences IS 'Part 00 — per-user shell preferences (theme, density, locale, default context). Self-service; OS preference honoured by default.';
