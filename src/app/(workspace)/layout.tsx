import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { authOptions } from "@/lib/auth";
import { WorkspaceShell } from "@/components/workspace-shell";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <WorkspaceShell
      userEmail={session.user.email ?? ""}
      userName={session.user.name ?? "User"}
    >
      {children}
    </WorkspaceShell>
  );
}
