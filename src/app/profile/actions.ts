"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function updateProfileInfo(_previousState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;

  try {
    await db.user.update({
      where: { id: parseInt(session.user.id) },
      data: { displayName, email },
    });
    revalidatePath("/profile"); // Refresh the data on the profile page
    return { success: "Profile updated successfully." };
  } catch (error) {
    return { error: "Failed to update profile." };
  }
}

export async function changePassword(_previousState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Server-side check to ensure passwords match
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const user = await db.user.findUnique({ where: { id: parseInt(session.user.id) } });
    if (!user) return { error: "User not found." };

    // This is the logic that securely checks the user's current password.
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return { error: "Incorrect current password." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: parseInt(session.user.id) },
      data: { password: hashedNewPassword },
    });

    return { success: "Password updated successfully." };
  } catch (error) {
    return { error: "Failed to update password." };
  }
}