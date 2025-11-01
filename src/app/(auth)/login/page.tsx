"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo Placeholder */}
        <div className="mb-8 flex justify-center">
          {/* Replace with your actual logo component or <img> tag */}
          <h1 className="text-4xl font-bold text-primary">VCT Logo</h1>
        </div>

        <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
              Login failed. Please check your credentials.
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              signIn("credentials", {
                username: form.username.value,
                password: form.password.value,
                callbackUrl: "/",
              });
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input input-bordered w-full"
                placeholder="your_username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input input-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="divider my-6">Or sign in with</div>

          <div className="space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="btn btn-outline w-full"
            >
              {/* You can add a Google icon here */}
              Sign in with Google
            </button>
            {/* Add other providers like Microsoft here */}
          </div>
        </div>

        <p className="mt-8 text-center text-sm">
          New user?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}