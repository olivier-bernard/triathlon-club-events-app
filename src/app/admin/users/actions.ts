"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    const userId = parseInt(formData.get("userId") as string);

    if (userId === parseInt(session.user.id)) {
        throw new Error("Admins cannot deactivate their own account.");
    }

    const isActive = formData.get("active") === "on";
    console.log(`Toggling user ${userId} active status to ${!isActive}`);

    await db.user.update({
        where: { id: userId },
        data: { active: !isActive },
    });
    revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
    const session = await verifyAdmin();
    const userId = parseInt(formData.get("userId") as string);

    if (userId === parseInt(session.user.id)) {
        throw new Error("Admins cannot delete their own account.");
    }

    await db.user.delete({
        where: { id: userId },
    });
    revalidatePath("/admin/users");
}