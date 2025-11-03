"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-card text-center">
        <h2 className="mb-4 text-2xl font-bold">Password Reset Successful</h2>
        <p className="text-green-700">Your password has been updated. You will be redirected to the login page shortly.</p>
      </div>
    );
  }

  if (!token) {
    return (
       <div className="auth-card text-center">
        <h2 className="mb-4 text-2xl font-bold text-error">Invalid Link</h2>
        <p>The password reset link is invalid or has expired. Please request a new one.</p>
        <Link href="/forgot-password" className="btn btn-primary mt-4">Request a New Link</Link>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <h2 className="mb-6 text-center text-2xl font-bold">Reset Your Password</h2>
      {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password">New Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input input-bordered w-full" />
          {!passwordsMatch && confirmPassword && <p className="mt-1 text-xs text-error">Passwords do not match.</p>}
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !passwordsMatch}>
          {loading ? <span className="loading loading-spinner"></span> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

// Wrap the component in Suspense because useSearchParams requires it.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}