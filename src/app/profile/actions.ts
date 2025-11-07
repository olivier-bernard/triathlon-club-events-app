"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileInfo(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const language = formData.get("language") as string; // Read the language from the form

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        displayName,
        email,
        language, // Add language to the data being updated
      },
    });

    revalidatePath("/profile");
    // We need to revalidate the root layout as well to update the language in the navbar
    revalidatePath("/"); 
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    // Check for unique constraint violation on email
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
      return { error: "This email address is already in use." };
    }
    return { error: "Failed to update profile." };
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Server-side check to ensure passwords match
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {AbortController
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

export async function updateDisplayPreference(calendarView: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { calendarView },
    });
    revalidatePath("/");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update preference." };
  }
}