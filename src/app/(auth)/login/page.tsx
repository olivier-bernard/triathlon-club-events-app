"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
    const router = useRouter();
  const { status } = useSession();

      if (status === "authenticated") {
      router.replace("/");
    }

  return (
    <>
      <div className="auth-card">
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
    </>
  );
}