import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { toggleUserActive, deleteUser } from "./actions";
import { getTranslations } from "@/app/lib/i18n";

function ToggleActiveForm({ user }: { user: any }) {
    return (
        <form action={toggleUserActive}>
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="btn btn-ghost btn-xs p-0">
                <input
                    type="checkbox"
                    name="active"
                    className="toggle toggle-success"
                    defaultChecked={user.active}
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
                            <th>{adminUsers.username}</th>
                            <th>{adminUsers.displayName}</th>
                            <th>{adminUsers.email}</th>
                            <th className="text-center">{adminUsers.active}</th>
                            <th className="text-center">{adminUsers.delete}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td className="text-center">
                                    <ToggleActiveForm user={user} />
                                </td>
                                <td className="text-center">
                                    {/* Remove the incorrect parseInt */}
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