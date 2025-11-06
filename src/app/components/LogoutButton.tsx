"use client";

import { signOut } from "next-auth/react";
import { getTranslations } from "../lib/i18n";

// This is a client component because it uses the onClick event handler
export default function LogoutButton({ lang }: { lang: string }) {
  const { navBar } = getTranslations(lang);

  return (
    <li>
      <a className="text-base" onClick={() => signOut({ callbackUrl: '/login' })}>{navBar.logout}</a>
    </li>
  );
}