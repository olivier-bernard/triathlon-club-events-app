"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/password/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "An unexpected error occurred.");
    }
  }

  return (
    <>
      <div className="auth-card">
        <h2 className="mb-2 text-center text-2xl font-bold">Forgot Password</h2>
        <p className="mb-6 text-center text-sm">
          Enter your email to receive a reset link.
        </p>

        {success && (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
            If an account with that email exists, a reset link has been sent.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input id="email" name="email" type="email" required className="input input-bordered w-full" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}