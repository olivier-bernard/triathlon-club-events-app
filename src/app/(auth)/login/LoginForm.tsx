"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LoginForm({ initialLang, translations }: { initialLang: string, translations: any }) {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const langFromQuery = searchParams.get("lang");
    const router = useRouter();
    const { status } = useSession();

    const [lang, setLang] = useState(langFromQuery || initialLang);
    const [t, setT] = useState(translations[langFromQuery || initialLang].authPages);

    // Update translations when language changes
    useEffect(() => {
        setT(translations[lang].authPages);
    }, [lang, translations]);

    if (status === "authenticated") {
        router.replace("/");
    }

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
                        <label htmlFor="username" className="block text-sm font-medium">
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
                            <label htmlFor="password" className="block text-sm font-medium">
                                {t.password}
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
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
                        {t.signInWithGoogle}
                    </button>
                </div>
            </div>
            <p className="mt-8 text-center text-sm">
                {t.newUserPrompt}{" "}
                <Link href={`/register?lang=${lang}`} className="font-medium text-primary hover:underline">
                    {t.registerLink}
                </Link>
            </p>
        </>
    );
}