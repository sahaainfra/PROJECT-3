"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    let result;
    try {
      result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        callbackUrl: "/dashboard",
        redirect: false,
      });
    } catch {
      setErrorMessage(
        "The sign-in service could not be reached. Check your connection and try again.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!result?.ok) {
      setErrorMessage(
        "We could not sign you in. Check your credentials or contact your administrator.",
      );
      setIsSubmitting(false);
      return;
    }

    router.replace(result.url ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Work email</label>
      <input
        autoComplete="username"
        autoCapitalize="none"
        id="email"
        maxLength={254}
        name="email"
        placeholder="you@company.com"
        required
        type="email"
      />

      <div className="password-label-row">
        <label htmlFor="password">Password</label>
      </div>
      <div className="password-input-wrap">
        <input
          autoComplete="current-password"
          id="password"
          maxLength={72}
          minLength={1}
          name="password"
          placeholder="Enter your password"
          required
          type={passwordVisible ? "text" : "password"}
        />
        <button
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          className="password-visibility"
          onClick={() => setPasswordVisible((visible) => !visible)}
          type="button"
        >
          {passwordVisible ? (
            <EyeOff aria-hidden="true" size={17} />
          ) : (
            <Eye aria-hidden="true" size={17} />
          )}
        </button>
      </div>

      {errorMessage && (
        <p aria-live="polite" className="form-error" role="alert">
          {errorMessage}
        </p>
      )}
      <button className="button button-primary sign-in-submit" disabled={isSubmitting} type="submit">
        {isSubmitting && <LoaderCircle aria-hidden="true" className="spin" size={17} />}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
