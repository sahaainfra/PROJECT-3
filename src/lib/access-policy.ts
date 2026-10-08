import type { CompanyRole } from "@prisma/client";

export function canAccessAllCompanyProjects(
  role: CompanyRole | null,
  isActiveProjectMember: boolean,
): boolean {
  if (!role) return false;

  return (
    role === "SUPER_ADMIN" ||
    role === "COMPANY_ADMIN" ||
    isActiveProjectMember
  );
}
