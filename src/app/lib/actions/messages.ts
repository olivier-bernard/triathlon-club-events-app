"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Corrected import path

// Action to create a new message
export async function createMessage(formData: FormData) {
  const session = await getServerSession(authOptions);
  // The user ID from the session can be a string or number depending on the adapter
  const userId = session?.user?.id ? parseInt(String(session.user.id), 10) : null;

  if (!userId) {
    throw new Error("You must be logged in to post a message.");
  }

  const content = formData.get("content") as string;
  const eventId = formData.get("eventId") as string;
  const isPrivate = formData.get("isPrivate") === "true";

  if (!content || !eventId) {
    throw new Error("Message content and event ID are required.");
  }

  await db.message.create({
    data: {
      content,
      isPrivate,
      eventId,
      userId: userId,
    },
  });

  revalidatePath(`/events/${eventId}`);
}