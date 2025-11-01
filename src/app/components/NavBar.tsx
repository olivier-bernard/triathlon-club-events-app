import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  // If there's no session, don't render the navbar (or render a different one)
  if (!session) {
    return null;
  }

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl text-primary">
          VCT Events
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {/* Display user initials */}
              <span className="text-xl font-bold">
                {session.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li className="menu-title">
              <span>Signed in as {session.user?.name}</span>
            </li>
            <li>
              <a href="text-base">Profile</a>
            </li>
            <LogoutButton />
          </ul>
        </div>
      </div>
    </div>
  );
}