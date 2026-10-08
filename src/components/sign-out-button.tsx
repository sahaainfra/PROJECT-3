"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      className="icon-button sign-out-button"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      type="button"
    >
      <LogOut aria-hidden="true" size={17} />
      <span>Sign out</span>
    </button>
  );
}
