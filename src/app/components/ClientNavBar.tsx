'use client';
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import NotificationBell from './NotificationBell';
import { getTranslations } from "../lib/i18n";
import { Session } from "next-auth";

export default function ClientNavBar({ session }: { session: Session }) {
  const [openMenu, setOpenMenu] = useState<"admin" | "profile" | "notifications" | null>(null);

  // If there's no session, don't render the navbar
  if (!session) {
    return null;
  }

  // Get language and translations
  const lang = session?.user?.language || 'fr';
  const { navBar } = getTranslations(lang);

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl text-primary">
          Events
        </Link>
      </div>

      <div className="flex-none gap-2">
        {session?.user && (
          <>
            {/* Notification Bell Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
              >
                <NotificationBell
                  lang={lang}
                  open={openMenu === "notifications"}
                  setOpen={open => setOpenMenu(open ? "notifications" : null)}
                  onMessageClick={() => setOpenMenu(null)}
                />
              </div>
              {openMenu === "notifications" && (
                <ul className="mt-3 z-dropdown p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80">
                  {/* Render your notification items here */}
                  {/* Example: <li>Notification 1</li> */}
                </ul>
              )}
            </div>

            {/* Admin Menu Dropdown */}
            {session.user?.roles?.includes('admin') && (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost text-xl"
                  onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}
                >
                  {navBar.admin}
                </label>
                {openMenu === "admin" && (
                  <ul
                    tabIndex={0}
                    className="mt-3 z-dropdown p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <Link
                        href="/admin/events/new"
                        className="text-base"
                        onClick={() => setOpenMenu(null)}
                      >
                        {navBar.addEvent}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/users"
                        className="text-base"
                        onClick={() => setOpenMenu(null)}
                      >
                        {navBar.manageUsers}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}

            {/* User Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
              >
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-xl font-bold flex items-center justify-center h-full">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </label>
              {openMenu === "profile" && (
                <ul
                  tabIndex={0}
                  className="mt-3 z-dropdown p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li className="menu-title">
                    <span>{navBar.signedInAs.replace('{username}', session.user?.name || '')}</span>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="text-base"
                      onClick={() => setOpenMenu(null)}
                    >
                      {navBar.profile}
                    </Link>
                  </li>
                  <li>
                    <LogoutButton lang={lang} onClick={() => setOpenMenu(null)} />
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}