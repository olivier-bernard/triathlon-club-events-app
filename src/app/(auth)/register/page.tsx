"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // State for password fields to provide live feedback
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // Check if passwords match whenever they change
    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordsMatch(password === confirmPassword);
        } else {
            setPasswordsMatch(true); // Don't show an error if a field is empty
        }
    }, [password, confirmPassword]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        setSuccess(false);

        const form = e.currentTarget;
        const username = (form.elements.namedItem("username") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;


        const res = await fetch("/api/user-register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, displayName, email }),
        });

        if (res.ok) {
            setSuccess(true);
            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            const data = await res.json();
            setError(data.error || "Registration failed. Please try again.");
        }
    }

    const passwordInputClass = () => {
        if (!password && !confirmPassword) return ""; // No styling initially
        if (!passwordsMatch) return "input-error"; // Red border if they don't match
        if (password && confirmPassword && passwordsMatch) return "input-success"; // Green border if they match
        return "";
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4">
            <div className="w-full max-w-md">
                {/* Logo Placeholder */}
                <div className="mb-8 flex justify-center">
                    <h1 className="text-4xl font-bold text-primary">VCT Logo</h1>
                </div>

                <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 p-8 shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-bold">
                        Create your account
                    </h2>

                    {success && (
                        <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
                            Registration successful! Redirecting to login...
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">Username</label>
                            <input id="username" name="username" type="text" required className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium">Display Name</label>
                            <input id="displayName" name="displayName" type="text" required className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email (Optional - Highly recommended to get notifications and password recovery)</label>
                            <input id="email" name="email" type="email" className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`input input-bordered w-full ${passwordInputClass()}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`input input-bordered w-full ${passwordInputClass()}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {!passwordsMatch && <p className="mt-1 text-xs text-error">Passwords do not match.</p>}
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Register
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}