"use server";

import { db } from "@/app/lib/db";

// Function to get messages for an event
export async function getMessagesByEventId(eventId: string, userId?: string) {
  if (!userId) {
    // If user is not logged in, only show public messages
    return db.message.findMany({
      where: { eventId, isPrivate: false },
      include: { user: { select: { id: true, displayName: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  // If user is logged in, show public messages AND their own private messages
  try {
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch messages.");
  }
}

export async function getMessagesByEventIdAfter(eventId: string, afterDate: Date, userId?: string) {
  try {
    const messages = await db.message.findMany({
      where: {
        eventId: eventId,
        createdAt: {
          gt: afterDate, // gt = greater than
        },
        // Apply the same privacy logic as the original query
        OR: [
          { isPrivate: false },
          { userId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: { id: true, displayName: true },
        },
      },
    });
    return messages;
  } catch (error) {
    console.error("Database Error:", error);
    // Return empty array on error to prevent client from crashing
    return [];
  }
}