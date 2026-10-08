import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Building2, ShieldCheck } from "lucide-react";
import { SignInForm } from "@/components/sign-in-form";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/dashboard");

  return (
    <main className="sign-in-page">
      <section aria-label="Sign in to Buildwise" className="sign-in-card">
        <div className="sign-in-brand">
          <span className="brand-mark">
            <Building2 aria-hidden="true" size={22} />
          </span>
          <span>
            <strong>Buildwise</strong>
            <small>CONSTRUCTION ERP</small>
          </span>
        </div>
        <div className="sign-in-heading">
          <p className="eyebrow">SECURE WORKSPACE</p>
          <h1>Welcome back</h1>
          <p>Sign in with your company account to continue.</p>
        </div>
        <SignInForm />
        <div className="sign-in-security">
          <ShieldCheck aria-hidden="true" size={16} />
          <span>Access is protected by company and project permissions.</span>
        </div>
      </section>
      <footer className="sign-in-footer">
        <span>Buildwise ERP</span>
        <span>Enterprise construction operations</span>
      </footer>
    </main>
  );
}
