"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

async function verifyAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.roles?.includes("admin")) {
        throw new Error("Not authorized");
    }
    return session;
}

export async function toggleUserActive(formData: FormData) {
    console.log("toggleUserActive called");
    const session = await verifyAdmin();
    const userId = formData.get("userId") as string;

    if (userId === session.user.id) {
        throw new Error("Admins cannot deactivate their own account.");
    }

    const isActive = formData.get("active") === "on";
    console.log("toggleUserActive called with isAdmin:", formData.get("active"));
    console.log(`Toggling user ${userId} active status to ${!isActive}`);

    await db.user.update({
        where: { id: userId },
        data: { active: !isActive },
    });
    revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
    const session = await verifyAdmin();
    const userId = formData.get("userId") as string;

    if (userId === session.user.id) {
        throw new Error("Admins cannot delete their own account.");
    }

    await db.user.delete({
        where: { id: userId },
    });
    revalidatePath("/admin/users");
}

export async function toggleUserAdmin(formData: FormData) {
    const userId = formData.get("userId") as string;
    const isAdmin = formData.get("admin") === "on";
    console.log("toggleUserAdmin called with isAdmin:", formData.get("admin"));
    console.log("toggleUserAdmin called for userId:", userId, "isAdmin:", isAdmin);
    const userInfo = await db.user.findUnique({ where: { id: userId } });
    if (!userInfo) return;

    let roles = userInfo.roles ?? [];

    if (!isAdmin) {
        console.log(`* Adding admin role to user ${userId}`);
        roles = Array.from(new Set([...roles, "admin"]));
        console.log("Updated roles:", roles);
    } else {
        console.log(`* Removing admin role from user ${userId}`);
        roles = roles.filter((r) => r !== "admin");
        console.log("Updated roles:", roles);
    }

    await db.user.update({
        where: { id: userId },
        data: { roles },
    });
    revalidatePath("/admin/users");
}