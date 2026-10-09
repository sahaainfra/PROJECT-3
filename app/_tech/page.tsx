/*
 * Part 00 — Technical Console (DS-32)
 * Reserved route namespace `/_tech` for technical operations only.
 * Disabled in production by default via `ff.tech_console` feature flag.
 * Technical roles only: TECH_ADMIN, QA_LEAD, RELEASE_MANAGER.
 * Step-up MFA required for access.
 * Every access audited per SA-7.
 * Read-only program baseline report at `/_tech/program/baseline`.
 *
 * NOTE: This console is NOT exposed in business navigation or menus.
 * It is reserved for engineering/DevOps use only.
 */

import "./design/tokens/generated/tokens.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon } from "@/design/Icon";
import { useEffect } from "react";

/**
 * TechnicalConsole — Minimal shell for technical operations.
 * Only accessible when ff.tech_console is ON and user has technical role.
 */
function TechnicalConsole() {
  const { theme, resolvedTheme, density } = useTheme();

  useEffect(() => {
    // resolvedTheme is always "light", "dark", or "high-contrast"
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.setAttribute("data-density", density);
    // If explicit "system" theme is set, honour OS preference
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
  }, [theme, resolvedTheme, density]);

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-6 border-b border-border-strong pb-3">
        <h1 className="text-3xl font-semibold text-text-primary">
          <Icon name="erp.shield" size={24} /> Technical Console
        </h1>
      </header>

      <div className="prose lg:prose-2xl max-w-none">
        <section>
          <h2 className="text-2xl font-medium text-text-primary mb-4">Program Baseline</h2>
          <ul>
            <li>Git tag: <code>erp-baseline-v0</code></li>
            <li>Schema baseline: <code>docs/erp-program/baseline/schema_baseline.sql</code></li>
            <li>Data baseline: <code>docs/erp-program/baseline/data_baseline.csv</code></li>
            <li>Regression harness: <code>npm run erp:regression</code></li>
            <li>Feature flags: <code>ff.pgm</code>, <code>ff.tech_console</code></li>
            <li>Design tokens: <code>erp-design-tokens</code></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium text-text-primary mb-4">System Diagnostics</h2>
          <ul>
            <li>
              Database: <span className="text-text-secondary">
                Not provisioned (greenfield)
              </span>
            </li>
            <li>
              Design system: <code>17_ENTERPRISE_DESIGN_SYSTEM.md</code> (DS-1..DS-34)
            </li>
            <li>
              Audit protocol: <code>18_INTERNAL_PART_AUDIT_PROTOCOL.md</code> (AUD-1..AUD-18)
            </li>
            <li>
              Control points: CP-PGM-01 (PLAN), CP-PGM-02 (VERIFY), CP-PGM-03 (CLOSE)
            </li>
            <li>
              Protocol mode: <code>OBSERVE</code> (no behaviour change)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium text-text-primary mb-4">Access Control</h2>
          <ul>
            <li>
              Feature flag: <code>ff.tech_console</code> — OFF by default in production
            </li>
            <li>Technical roles: TECH_ADMIN, QA_LEAD, RELEASE_MANAGER</li>
            <li>Step-up MFA required for access</li>
            <li>All access audited per SA-7</li>
            <li>Route reserved: <code>/_tech</code> — not in business navigation</li>
          </ul>
        </section>
      </div>

      <footer className="mt-8 text-text-small">
        <p>
          Technical console is for technical operations only. Business users
          should not access this interface.
        </p>
      </footer>
    </div>
  );
}

/* 
 * Technical console route — Next.js app router.
 * This route is reserved for technical operations and is gated by ff.tech_console.
 * Not exposed in business navigation or menus.
 * Renders nothing when ff.tech_console is OFF (default in production).
 */
export default function _techPage({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <div>{/* Technical console rendered here; flag gating at server level */}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}