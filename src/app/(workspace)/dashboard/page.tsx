import Link from "next/link";
import { ArrowDown, ArrowUpRight, Building2, FolderKanban } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getActiveCompanyMembership, listAccessibleProjects } from "@/lib/authorization";
import { prisma } from "@/lib/db";

type DashboardProps = {
  searchParams: Promise<{ companyId?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  const [params, memberships] = await Promise.all([
    searchParams,
    prisma.companyMembership.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        company: { status: "ACTIVE" },
        user: { status: "ACTIVE" },
      },
      include: { company: { select: { id: true, code: true, name: true } } },
      orderBy: { company: { name: "asc" } },
    }),
  ]);

  const requestedCompanyId = params.companyId;
  const requestedMembership = requestedCompanyId
    ? await getActiveCompanyMembership(session.user.id, requestedCompanyId)
    : null;
  const membership =
    requestedMembership ??
    memberships.find((item) => item.companyId === requestedCompanyId) ??
    memberships[0] ??
    null;

  if (!membership) {
    return (
      <section className="empty-state">
        <span className="empty-icon">
          <Building2 aria-hidden="true" size={24} />
        </span>
        <p className="eyebrow">WORKSPACE ACCESS</p>
        <h1>No company workspace assigned</h1>
        <p>
          Your account is active, but it is not yet linked to an active company.
          Ask your ERP administrator to assign your company access.
        </p>
      </section>
    );
  }

  const projects = await listAccessibleProjects(
    session.user.id,
    membership.companyId,
    membership.role,
  );
  const activeProjects = projects.filter((project) => project.status === "ACTIVE").length;
  const onHoldProjects = projects.filter((project) => project.status === "ON_HOLD").length;

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROGRAM OVERVIEW</p>
          <h1>Good to see you, {session.user.name?.split(" ")[0] ?? "there"}</h1>
          <p className="page-subtitle">
            Your construction portfolio at a glance.
          </p>
        </div>
        <form action="/dashboard" className="company-switcher" method="get">
          <label htmlFor="companyId">Company workspace</label>
          <div className="select-wrap">
            <Building2 aria-hidden="true" size={16} />
            <select
              aria-label="Choose a company workspace"
              defaultValue={membership.companyId}
              id="companyId"
              name="companyId"
            >
              {memberships.map((item) => (
                <option key={item.companyId} value={item.companyId}>
                  {item.company.name} · {item.company.code}
                </option>
              ))}
            </select>
            <ArrowDown aria-hidden="true" size={14} />
          </div>
          <button className="button button-secondary switch-button" type="submit">
            Switch
          </button>
        </form>
      </div>

      <div className="company-context">
        <span className="context-dot" />
        <span>{membership.company.name}</span>
        <span className="context-separator">/</span>
        <span className="context-code">{membership.company.code}</span>
        <span className="context-role">{membership.role.replaceAll("_", " ")}</span>
      </div>

      <section aria-label="Portfolio metrics" className="metric-grid">
        <article className="metric-card">
          <div className="metric-topline">
            <span>Accessible projects</span>
            <span className="metric-icon blue">
              <FolderKanban aria-hidden="true" size={18} />
            </span>
          </div>
          <strong className="metric-value">{projects.length}</strong>
          <span className="metric-caption">within your assigned scope</span>
        </article>
        <article className="metric-card">
          <div className="metric-topline">
            <span>Active</span>
            <span className="status-indicator active-status" />
          </div>
          <strong className="metric-value">{activeProjects}</strong>
          <span className="metric-caption">projects in progress</span>
        </article>
        <article className="metric-card">
          <div className="metric-topline">
            <span>On hold</span>
            <span className="status-indicator hold-status" />
          </div>
          <strong className="metric-value">{onHoldProjects}</strong>
          <span className="metric-caption">requiring a status review</span>
        </article>
        <article className="metric-card metric-card-context">
          <div className="metric-topline">
            <span>Current role</span>
            <span className="metric-icon purple">
              <Building2 aria-hidden="true" size={18} />
            </span>
          </div>
          <strong className="role-value">{membership.role.replaceAll("_", " ")}</strong>
          <span className="metric-caption">in this company</span>
        </article>
      </section>

      <section aria-labelledby="projects-heading" className="panel" id="projects">
        <div className="panel-heading">
          <div>
            <h2 id="projects-heading">Projects</h2>
            <p>Projects available in your current company scope.</p>
          </div>
          <span className="record-count">{projects.length} records</span>
        </div>

        {projects.length === 0 ? (
          <div className="table-empty">
            <FolderKanban aria-hidden="true" size={24} />
            <strong>No projects in scope</strong>
            <span>
              Projects will appear here when they are assigned to your company
              or project membership.
            </span>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last updated</th>
                  <th scope="col">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <Link
                        className="project-name-link"
                        href={`/projects/${encodeURIComponent(project.id)}`}
                      >
                        <span className="project-code">{project.code}</span>
                        <strong>{project.name}</strong>
                      </Link>
                    </td>
                    <td>
                      <span className={`status-pill status-${project.status.toLowerCase()}`}>
                        <span className="status-indicator" />
                        {project.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(project.updatedAt)}
                    </td>
                    <td>
                      <Link
                        aria-label={`Open ${project.name}`}
                        className="row-action"
                        href={`/projects/${encodeURIComponent(project.id)}`}
                      >
                        <ArrowUpRight aria-hidden="true" size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="data-notice">
        Portfolio figures reflect records you are authorized to access in this
        company context.
      </p>
    </div>
  );
}
