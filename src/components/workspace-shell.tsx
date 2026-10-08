import Link from "next/link";
import { Building2, ChartNoAxesCombined, FolderKanban, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";

type WorkspaceShellProps = {
  children: ReactNode;
  userName: string;
  userEmail: string;
};

export function WorkspaceShell({
  children,
  userName,
  userEmail,
}: WorkspaceShellProps) {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link aria-label="Buildwise ERP home" className="brand" href="/dashboard">
          <span className="brand-mark">
            <Building2 aria-hidden="true" size={21} />
          </span>
          <span>
            <strong>Buildwise</strong>
            <small>CONSTRUCTION ERP</small>
          </span>
        </Link>

        <div className="navigation-label">WORKSPACE</div>
        <nav aria-label="Main navigation" className="main-navigation">
          <Link className="navigation-item active" href="/dashboard">
            <ChartNoAxesCombined aria-hidden="true" size={18} />
            <span>Overview</span>
          </Link>
          <Link className="navigation-item" href="/dashboard#projects">
            <FolderKanban aria-hidden="true" size={18} />
            <span>Projects</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <span className="security-badge">
            <ShieldCheck aria-hidden="true" size={15} />
            Scoped access
          </span>
          <p>Company and project access is checked on the server for every request.</p>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">
              <Building2 aria-hidden="true" size={19} />
            </span>
            <strong>Buildwise</strong>
          </div>
          <div className="topbar-spacer" />
          <div className="user-menu">
            <div className="user-identity">
              <span aria-hidden="true" className="avatar">
                {userName.slice(0, 1).toUpperCase()}
              </span>
              <span className="user-copy">
                <strong>{userName}</strong>
                <small>{userEmail}</small>
              </span>
            </div>
            <SignOutButton />
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
