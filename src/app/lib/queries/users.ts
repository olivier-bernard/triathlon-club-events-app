"use server";
import { db } from "@/app/lib/db";

export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        displayName: true,
      },
      orderBy: {
        displayName: 'asc',
      },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}