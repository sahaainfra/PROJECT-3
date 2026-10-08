import "server-only";
import { CompanyRole, CompanyStatus, ProjectStatus } from "@prisma/client";
import { canAccessAllCompanyProjects } from "@/lib/access-policy";
import { prisma } from "@/lib/db";

export async function getActiveCompanyMembership(
  userId: string,
  companyId: string,
) {
  const membership = await prisma.companyMembership.findFirst({
    where: {
      companyId,
      userId,
      user: { status: "ACTIVE" },
    },
    include: { company: true },
  });

  if (
    !membership?.isActive ||
    membership.company.status !== CompanyStatus.ACTIVE
  ) {
    return null;
  }

  return membership;
}

export async function listAccessibleProjects(
  userId: string,
  companyId: string,
  companyRole: CompanyRole,
) {
  return prisma.project.findMany({
    where: {
      companyId,
      status: { not: ProjectStatus.ARCHIVED },
      ...(companyRole === "SUPER_ADMIN" || companyRole === "COMPANY_ADMIN"
        ? {}
        : { memberships: { some: { userId, isActive: true } } }),
    },
    orderBy: [{ name: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function getAuthorizedProject(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      company: {
        include: {
          memberships: { where: { userId, isActive: true }, take: 1 },
        },
      },
      memberships: {
        where: {
          userId,
          isActive: true,
          user: { status: "ACTIVE" },
        },
        take: 1,
      },
    },
  });

  if (
    !project ||
    project.status === ProjectStatus.ARCHIVED ||
    project.company.status !== CompanyStatus.ACTIVE
  ) {
    return null;
  }

  const companyMembership = project.company.memberships[0];
  const projectMembership = project.memberships[0];

  if (
    !companyMembership ||
    !canAccessAllCompanyProjects(
      companyMembership.role,
      projectMembership !== undefined,
    )
  ) {
    return null;
  }

  return project;
}
