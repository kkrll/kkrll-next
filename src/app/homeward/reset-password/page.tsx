"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const PasswordResetPage = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const handleAuthSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setError("Invalid or expired reset link");
          return;
        }

        if (!data.session) {
          setError("No active session found");
          return;
        }

        console.log("Session established for user:", data.session.user?.email);
        setSessionReady(true);
      } catch (err) {
        console.error("Session error:", err);
        setError(
          "Failed to establish session. Please try the reset link again.",
        );
      }
    };

    // Only run on client-side (Gatsby SSR protection)
    if (typeof window !== "undefined") {
      handleAuthSession();
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionReady) {
      setError("Session not ready. Please refresh the page.");
      return;
    }

    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while establishing session
  if (!sessionReady && !error) {
    return (
      <PageLayout>
        <div
          style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}
        >
          <h1>Homeward</h1>
          <p>Establishing secure session...</p>
        </div>
      </PageLayout>
    );
  }

  // Show error if session failed
  if (error && !sessionReady) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
        <h1>Homeward</h1>
        <h2>Reset Your Password</h2>
        <div>ERROR: {error}</div>
        <p>Please request a new password reset email from the extension.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
        <h1>Password Reset Successful!</h1>
        <p>Your password has been updated successfully.</p>
        <p>
          <strong>Next steps:</strong>
        </p>
        <ol>
          <li>Return to the Homeward Chrome extension</li>
          <li>Sign in with your email and new password</li>
        </ol>
        <p
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f0f9ff",
            border: "1px solid #0ea5e9",
          }}
        >
          You can close this tab and return to the extension now.
        </p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
        <h1>Homeward</h1>
        <h2>Reset Your Password</h2>
        <p>Be reasonable, use a complex password</p>

        <form onSubmit={handlePasswordReset}>
          <div style={{ marginBottom: "15px" }}>
            <label>New password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Confirm password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </div>

          {error && (
            <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
          )}

          <Button type="submit" color="primary" size="lg" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};

export default PasswordResetPage;
