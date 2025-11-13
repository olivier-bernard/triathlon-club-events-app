import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getTranslations } from "../lib/i18n";

export default async function NavBar() {
  const session = await getServerSession(authOptions);

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
          VCT Events
        </Link>
      </div>

      <div className="flex-none gap-2">

        {/* Admin Menu Dropdown */}
        {session.user?.roles?.includes('admin') && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost text-xl">
              {navBar.admin}
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-dropdown p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/admin/events/new" className="text-base">{navBar.addEvent}</Link>
              </li>
              <li>
                <Link href="/admin/users" className="text-base">{navBar.manageUsers}</Link>
              </li>
            </ul>
          </div>
        )}

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {/* Display user initials */}
              <span className="text-xl font-bold flex items-center justify-center h-full">
                {session.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-dropdown p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li className="menu-title">
              <span>{navBar.signedInAs.replace('{username}', session.user?.name || '')}</span>
            </li>
            <li>
              <Link href="/profile" className="text-base">{navBar.profile}</Link>
            </li>
    
            <LogoutButton lang={lang} />
          </ul>
        </div>
      </div>
    </div>
  );
}