import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, FolderKanban } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAuthorizedProject } from "@/lib/authorization";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  const { projectId } = await params;
  const project = await getAuthorizedProject(session.user.id, projectId);
  if (!project) notFound();

  return (
    <div className="project-page">
      <Link className="back-link" href={`/dashboard?companyId=${encodeURIComponent(project.companyId)}`}>
        <ArrowLeft aria-hidden="true" size={16} />
        Back to portfolio
      </Link>
      <div className="page-heading project-heading">
        <div>
          <p className="eyebrow">PROJECT OVERVIEW · {project.code}</p>
          <h1>{project.name}</h1>
          <p className="page-subtitle">{project.company.name}</p>
        </div>
        <span className={`status-pill status-${project.status.toLowerCase()}`}>
          <span className="status-indicator" />
          {project.status.replaceAll("_", " ")}
        </span>
      </div>
      <section aria-label="Project details" className="project-detail-grid">
        <article className="detail-card">
          <span className="detail-icon blue">
            <Building2 aria-hidden="true" size={18} />
          </span>
          <div>
            <span>Company</span>
            <strong>{project.company.name}</strong>
          </div>
        </article>
        <article className="detail-card">
          <span className="detail-icon purple">
            <FolderKanban aria-hidden="true" size={18} />
          </span>
          <div>
            <span>Project code</span>
            <strong>{project.code}</strong>
          </div>
        </article>
        <article className="detail-card">
          <span className="detail-icon green">
            <CalendarDays aria-hidden="true" size={18} />
          </span>
          <div>
            <span>Last updated</span>
            <strong>
              {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                project.updatedAt,
              )}
            </strong>
          </div>
        </article>
      </section>
      <section className="panel project-summary">
        <h2>Project summary</h2>
        <p>{project.description || "No project description has been recorded."}</p>
      </section>
    </div>
  );
}
