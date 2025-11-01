"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input name="username" placeholder="Username" className="border px-2 py-1 rounded" />
        <input name="password" type="password" placeholder="Password" className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">Registration successful! You can now log in.</div>}
      </form>
    </div>
  );
}