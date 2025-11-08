"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getTranslations } from "@/app/lib/i18n";


export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();
  const { status } = useSession();

  // Initialize state to null until the language is detected.
  const [t, setT] = useState<any>(null);

  // Detect browser language on component mount
  useEffect(() => {
    // This code only runs on the client, after the component mounts.
    const browserLang = navigator.language.split('-')[0];
    const newLang = ['en', 'fr'].includes(browserLang) ? browserLang : 'fr';
    
    // This log will appear in your BROWSER's developer console (F12).
    console.log("Detected browser language:", browserLang, "Using language:", newLang);
    
    setT(getTranslations(newLang).authPages);
  }, []);

  if (status === "authenticated") {
    router.replace("/");
  }

  // While translations are loading, show a spinner or nothing to prevent the flash.
  if (!t) {
    return (
      <div className="auth-card flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="auth-card">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {t.signInTitle}
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {t.loginFailed}
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
              {t.username}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="input input-bordered w-full"
              placeholder={t.usernamePlaceholder}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                {t.password}
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t.forgotPasswordLink}
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
            {t.signInButton}
          </button>
        </form>

        <div className="divider my-6">{t.orSignInWith}</div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline w-full"
          >
            {/* You can add a Google icon here */}
            {t.signInWithGoogle}
          </button>
          {/* Add other providers like Microsoft here */}
        </div>
      </div>

      <p className="mt-8 text-center text-sm">
        {t.newUserPrompt}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t.registerLink}
        </Link>
      </p>
    </>
  );
}