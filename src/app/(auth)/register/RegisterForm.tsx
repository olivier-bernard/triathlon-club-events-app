"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegisterForm({ initialLang, translations }: { initialLang: string, translations: any }) {
  const searchParams = useSearchParams();
  const langFromQuery = searchParams.get("lang");
  const [lang, setLang] = useState(langFromQuery || initialLang);
  const [t, setT] = useState(translations[langFromQuery || initialLang].authPages);

  useEffect(() => {
    setT(translations[lang].authPages);
  }, [lang, translations]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    setSuccess(false);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const passwordVal = (form.elements.namedItem("password") as HTMLInputElement).value;
    const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/user-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: passwordVal, displayName, email }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.error || t.registerFailed || "Registration failed. Please try again.");
    }
  }

  const passwordInputClass = () => {
    if (!password && !confirmPassword) return "";
    if (!passwordsMatch) return "input-error";
    if (password && confirmPassword && passwordsMatch) return "input-success";
    return "";
  };

  return (
    <>
      <div className="auth-card">
        <div className="flex justify-end mb-2">
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="select select-bordered select-sm"
            aria-label="Language"
          >
            {Object.keys(translations).map((key) => (
              <option key={key} value={key}>
                {translations[key].authPages.languageLabel || key}
              </option>
            ))}
          </select>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold">
          {t.registerTitle}
        </h2>
        {success && (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
            {t.registerSuccess || "Registration successful! Redirecting to login..."}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">{t.username}</label>
            <input id="username" name="username" type="text" required className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">{t.displayName}</label>
            <input id="displayName" name="displayName" type="text" required className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">{t.email}</label>
            <input id="email" name="email" type="email" className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">{t.password}</label>
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium">{t.confirmNewPassword}</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`input input-bordered w-full ${passwordInputClass()}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && <p className="mt-1 text-xs text-error">{t.passwordsDoNotMatch}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {t.registerButton}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm">
        {t.alreadyHaveAccountPrompt}{" "}
        <Link href={`/login?lang=${lang}`} className="font-medium text-primary hover:underline">
          {t.signInLink}
        </Link>
      </p>
    </>
  );
}