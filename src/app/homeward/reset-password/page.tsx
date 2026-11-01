"use client";

import { createClient } from "@supabase/supabase-js";
import type React from "react";
import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

// Expired or reused reset links arrive as #error=…&error_description=…
// Read it before the Supabase client initialises and rewrites the URL.
const linkHash = typeof window !== "undefined" ? window.location.hash : "";

// The reset link signs the user in through the URL. Keep that session in
// memory only, so nothing stays signed in on kkrll.com afterwards.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const MIN_PASSWORD_LENGTH = 6;

type Status = "checking" | "ready" | "invalid" | "done";

const getLinkError = () => {
  const description = new URLSearchParams(linkHash.slice(1)).get(
    "error_description",
  );
  return description ? description.replace(/\+/g, " ") : null;
};

const ResetLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <PageLayout>
    <section className="px-default w-full max-w-md py-16 md:py-24 text-left text-foreground">
      <p className="font-mono text-xs uppercase">Homeward</p>
      <h1 className="mt-2 mb-6 text-2xl font-medium">{title}</h1>
      {children}
    </section>
  </PageLayout>
);

const PasswordField = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => (
  <label className="block">
    <span className="font-mono text-xs uppercase">{label}</span>
    {/* text-base: anything under 16px makes iOS Safari zoom in on focus */}
    <input
      type="password"
      autoComplete="new-password"
      required
      minLength={MIN_PASSWORD_LENGTH}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="mt-2 block h-10 w-full rounded-md border border-foreground-07 bg-background px-3 text-base text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-foreground/50 disabled:opacity-50"
    />
  </label>
);

const PasswordResetPage = () => {
  const [status, setStatus] = useState<Status>("checking");
  const [linkProblem, setLinkProblem] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (data.session) {
        setStatus("ready");
        return;
      }
      setLinkProblem(
        getLinkError() ??
          error?.message ??
          "This page only works from the link in a password reset email.",
      );
      setStatus("invalid");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    // Revoke just this reset session; "local" keeps the extension signed in
    await supabase.auth.signOut({ scope: "local" });
    setStatus("done");
  };

  if (status === "checking") {
    return (
      <ResetLayout title="Reset your password">
        <p>Checking your reset link…</p>
      </ResetLayout>
    );
  }

  if (status === "invalid") {
    return (
      <ResetLayout title="This link doesn't work">
        <p role="alert">{linkProblem}</p>
        <p className="mt-4">
          Request a new one from the extension: Sign in → Sign in with email →
          Forgot password.
        </p>
      </ResetLayout>
    );
  }

  if (status === "done") {
    return (
      <ResetLayout title="Password updated">
        <p>
          Go back to the Homeward tab and sign in with your email and the new
          password. You can close this page.
        </p>
      </ResetLayout>
    );
  }

  return (
    <ResetLayout title="Reset your password">
      <p className="mb-8">
        Be reasonable, use a complex password. At least {MIN_PASSWORD_LENGTH}{" "}
        characters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          disabled={saving}
        />
        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={saving}
        />

        {error && (
          <p role="alert" className="font-mono text-xs uppercase">
            Error: {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
      </form>
    </ResetLayout>
  );
};

export default PasswordResetPage;
