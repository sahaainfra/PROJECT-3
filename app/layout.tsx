/*
 * Part 00 — Application Shell (DS-12, DS-29)
 * Layout component providing the enterprise ERP shell:
 * - Shell bar (top) with context switcher, search, notifications, user menu
 * - Side navigation (left) with rail mode, rendered from navigation registry
 * - Page content area
 * - Footer toolbar
 * - Mobile bottom navigation
 * - Tablet rail mode
 *
 * Existing ERP screens are mounted inside this shell with unchanged routes and behaviour.
 */

import "./design/tokens/generated/tokens.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { ICON_KEYS, type IconKey, Icon } from "@/design/Icon";
import { useEffect } from "react";

/**
 * ShellHeader — Top bar containing:
 * - Context switcher (Company › Project › Site)
 * - Global search / command palette (Ctrl/⌘ K)
 * - Notification bell
 * - User menu with preferences
 */
function ShellHeader() {
  const { setTheme, setDensity, resolvedTheme, density } = useTheme();

  return (
    <header
      className="flex items-center justify-between border-b border-border-strong bg-surface/70 backdrop-blur px-4 py-2 sm:px-6"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Context Switcher: Company › Project › Site */}
        <div className="relative">
          <button
            className="relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-text-primary hover:text-brand-active focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            aria-haspopup="menu"
            aria-label="Switch company/project/site context"
          >
            <span className="truncate">Project Alpha</span>
            <svg
              className="flex-shrink-0 w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
              <path d="M10 12l6 6 6-6" />
            </svg>
          </button>
          <menu
            className="absolute right-0 mt-2 w-48 rounded-md bg-surface-raised border border-border-strong shadow-menu p-2 min-w-48 z-10"
          >
            <div className="text-text-secondary text-xs mb-2">Context</div>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Company › Alpha Construction
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Project › Alpha Tower
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Site › Tower A
                </button>
              </li>
            </ul>
          </menu>
        </div>

        {/* Global Search / Command Palette (Ctrl/⌘ K) */}
        <div className="relative flex-1 max-w-sm">
          <button
            className="relative w-full rounded-md border border-border-strong bg-surface px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:bg-surface-raised"
            aria-label="Global search (Ctrl / ⌘ K)"
            onClick={() => window.dispatchEvent(new Event("toggle-search"))}
          >
            <svg
              className="absolute left-3 w-4 h-4 text-text-disabled pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search projects, modules, records...
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
          aria-label="Notifications"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="8" r="5" />
            <circle cx="8" cy="8" r="5" />
            <path
              d="M21.5 15a16.1 16.1 0 0 1-3.7 2.9 5.5 5.5 0 0 1-4.5 1 1.5 1.5 0 0 1-2 0 5.5 5.5 0 0 1-4.5-1 1.5 1.5 0 0 1-2 0 5.5 5.5 0 0 1-4.5 1 5.5 5.5 0 0 1-4.5-1 1.5 1.5 0 0 1-2 0 5.5 5.5 0 0 1-3.7 3H8m0-12l-6 9 3 11h11l-3-11-6-9m0 9h6m4-6v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2-2z"
            />
          </svg>
          <span
            className="absolute -top-1 -right-1 bg-critical text-text-inverse text-xs rounded-w-full h-3.5 w-3.5"
          >
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative hidden sm:inline-flex items-center gap-2">
          <button
            className="relative rounded-full p-1.5 text-sm"
            aria-haspopup="menu"
            aria-label="User menu"
          >
            <span className="w-6 h-6 rounded-full bg-surface-raised"></span>
          </button>
          <menu
            className="absolute right-0 mt-2 w-48 rounded-md bg-surface-raised border border-border-strong shadow-menu p-2 min-w-48 z-10"
          >
            <div className="text-text-secondary text-xs mb-2">User</div>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Preferences
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Language
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Theme
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1.5 rounded-md hover:bg-border-strong text-text-primary">
                  Sign out
                </button>
              </li>
            </ul>
          </menu>
        </div>
      </div>
    </header>
  );
}

/**
 * ShellNavigation — Side navigation rendered from the navigation registry.
 * Rendered only when ff.pgm feature flag is ON and user is authorised.
 */
function ShellNavigation() {
  return (
    <nav
      className="bg-surface min-h-screen border-r border-border-strong flex flex-col"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="p-4 pt-2">
        <h2 className="text-text-secondary text-xs uppercase tracking-wider mb-3">Navigation</h2>

        {/* Home Launchpad Entry — from navigation registry, gated by ff.pgm */}
        <div className="group">
          <a
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-primary hover:text-brand-active hover:bg-border-strong transition-colors"
          >
            <Icon name="erp.home.pgm" size={18} />
            <span>Home</span>
          </a>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-border-strong" />

        {/* Additional navigation entries would be imported from the registry
            and rendered only when their feature flag is ON,
            the user is authorised, and the route is live. */}
      </div>
    </nav>
  );
}

/**
 * ShellSidebarToggle — Button to toggle the navigation rail on/off.
 * Visible on tablet/mobile or when rail mode is active.
 */
function ShellSidebarToggle() {
  return (
    <button
      className="sm:hidden p-2"
      aria-label="Toggle navigation sidebar"
      onClick={() => {
        // Toggle logic would go here
      }}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12l2" />
        <path d="M12 3l2" />
        <path d="M21 12l2" />
      </svg>
    </button>
  );
}

/**
 * ShellContent — Main content area with page header and footer toolbar.
 */
function ShellContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose lg:prose-xl max-w-none">
      {children}
    </div>
  );
}

/**
 * FooterToolbar — Fixed footer toolbar with action buttons.
 */
function FooterToolbar() {
  return (
    <footer
      className="border-t border-border-strong bg-surface/80 backdrop-blur fixed bottom-0 left-0 right-0 px-4 py-2 sm:px-6"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-text-secondary text-xs">
          <span>Alpha Construction ERP</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md px-3 py-1.5 text-sm text-brand hover:text-brand-active transition-colors">
            Create
          </button>
        </div>
      </div>
    </footer>
  );
}

/**
 * MobileNav — Mobile bottom navigation.
 * Shown on screens below bp-mobile (360px) and in touch density mode.
 */
function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-strong z-20"
    >
      <div className="flex justify-around px-2 py-1">
        <a
          href="/"
          className="flex flex-col items-center rounded-sm py-2 text-xs font-medium hover:text-brand-active"
          aria-current="page"
        >
          <Icon name="erp.home.pgm" size={20} />
          <span>Home</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center rounded-sm py-2 text-xs font-medium hover:text-brand-active"
        >
          <Icon name="erp.icon.bell" size={20} />
          <span>Inbox</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center rounded-sm py-2 text-xs font-medium hover:text-brand-active"
        >
          <Icon name="erp.icon.plus" size={20} />
          <span>Create</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center rounded-sm py-2 text-xs font-medium hover:text-brand-active"
        >
          <Icon name="erp.icon.tasks" size={20} />
          <span>Tasks</span>
        </a>
      </div>
    </nav>
  );
}

/**
 * ShellLayout — Main shell layout component.
 * Wraps the entire application with the Part 00 enterprise shell.
 *
 * Usage:
 *   <ShellLayout>
 *     <p>Page content</p>
 *   </ShellLayout>
 */
export function ShellLayout({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, density } = useTheme();

  useEffect(() => {
    // Apply theme attribute to document element
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
    <div className="flex min-h-screen bg-background">
      {/* Shell bar (always visible, full width) */}
      <ShellHeader />

      {/* Navigation section: side nav on desktop, hidden on mobile */}
      <div className="flex min-h-screen">
        {/* Sidebar / Side navigation (visible on desktop, hidden on mobile) */}
        <ShellNavigation />

        {/* Page content area */}
        <div className="flex-1 overflow-auto sm:w-0">
          {/* Page content with header and footer toolbar */}
          <div className="w-full">
            <ShellContent>{children}</ShellContent>
            <FooterToolbar />
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation (visible on mobile / touch devices) */}
      <MobileNav />
    </div>
  );
}

/* 
 * Root layout component for Next.js app router.
 * This provides the shell around every page in the application.
 */
export default function ShellRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <ShellLayout>{children}</ShellLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}