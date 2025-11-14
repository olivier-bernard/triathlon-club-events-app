import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { toggleUserActive, deleteUser, toggleUserAdmin } from "./actions";
import { getTranslations } from "@/app/lib/i18n";

function ToggleForm({
  user,
  field,
  checked,
  action,
  toggleClass,
}: {
  user: any;
  field: string;
  checked: boolean;
  action: (formData: FormData) => Promise<void>;
  toggleClass: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="userId" value={user.id} />
      <button type="submit" className="btn btn-ghost btn-xs p-0">
        <input
          type="checkbox"
          name={field}
          className={toggleClass}
          defaultChecked={checked}
          style={{ pointerEvents: "none" }}
        />
      </button>
    </form>
  );
}

// Correct the prop type for currentUserId to string
function DeleteUserButton({ user, currentUserId }: { user: any, currentUserId: string }) {
    // Prevent an admin from deleting their own account
    if (user.id === currentUserId) {
        return null;
    }

    return (
        <form action={deleteUser}>
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="btn btn-xs btn-error btn-ghost text-lg">✕</button>
        </form>
    );
}

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    // Protect the route
    if (!session?.user?.roles?.includes("admin")) {
        redirect("/");
    }

    const lang = session?.user?.language || 'fr';
    const { adminUsers } = getTranslations(lang);

    const users = await db.user.findMany({
        orderBy: { username: 'asc' },
    });

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">{adminUsers.title}</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="break-normal max-w-[120px]">{adminUsers.username}</th>
                            <th className="break-normal max-w-[120px]">{adminUsers.displayName}</th>
                            <th className="break-all max-w-[160px]">{adminUsers.email}</th>
                            <th className="text-center break-normal">{adminUsers.active}</th>
                            <th className="text-center break-normal">{adminUsers.admin}</th>
                            <th className="text-center break-normal">{adminUsers.delete}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                              <td className="whitespace-nowrap max-w-[80px] truncate">{user.username}</td>
                              <td className="break-normal max-w-[120px]">{user.displayName}</td>
                              <td className="break-all max-w-[160px]">{user.email}</td>
                              <td className="text-center whitespace-nowrap">
                                <ToggleForm
                                  user={user}
                                  field="active"
                                  checked={user.active}
                                  action={toggleUserActive}
                                  toggleClass="toggle toggle-success"
                                />
                              </td>
                              <td className="text-center whitespace-nowrap">
                                <ToggleForm
                                  user={user}
                                  field="admin"
                                  checked={user.roles?.includes("admin")}
                                  action={toggleUserAdmin}
                                  toggleClass="toggle toggle-warning"
                                />
                              </td>
                              <td className="text-center whitespace-nowrap">
                                <DeleteUserButton user={user} currentUserId={session.user.id} />
                              </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}