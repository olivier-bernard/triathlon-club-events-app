"use server";

import { db } from "@/app/lib/db";

// Function to get messages for an event
export async function getMessagesByEventId(eventId: string, userId?: number) {
  if (!userId) {
    // If user is not logged in, only show public messages
    return db.message.findMany({
      where: { eventId, isPrivate: false },
      include: { user: { select: { id: true, displayName: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  // If user is logged in, show public messages AND their own private messages
  const messages = await db.message.findMany({
    where: {
      eventId,
      OR: [
        { isPrivate: false },
        { isPrivate: true, userId: String(userId) } // Ensure userId is a string
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return messages;
}