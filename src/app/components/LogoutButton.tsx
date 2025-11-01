"use client";

import { signOut } from "next-auth/react";

// This is a client component because it uses the onClick event handler
export default function LogoutButton() {
  return (
    <li>
      <a className="text-base" onClick={() => signOut({ callbackUrl: '/login' })}>Logout</a>
    </li>
  );
}