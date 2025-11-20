"use client";

import { signOut } from "next-auth/react";
import { getTranslations } from "../lib/i18n";

// This is a client component because it uses the onClick event handler
export default function LogoutButton({ lang, onClick }: { lang: string, onClick?: () => void }) {
  const { navBar } = getTranslations(lang);

  return (
    <a
      className="text-base cursor-pointer block px-4 py-2 hover:bg-base-200"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      {navBar.logout}
    </a>
  );
}