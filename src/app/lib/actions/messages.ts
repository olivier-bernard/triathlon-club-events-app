"use server";

import webpush from 'web-push';
import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Corrected import path
import { getMessagesByEventIdAfter } from "../queries/messages";

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function createMessage(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? String(session.user.id) : null;

  if (!userId) {
    throw new Error("You must be logged in to post a message.");
  }

  const content = formData.get("content") as string;
  const eventId = formData.get("eventId") as string;
  const isPrivate = formData.get("isPrivate") === "true";

  if (!content || !eventId) {
    throw new Error("Message content and event ID are required.");
  }

  const newMsg = await db.message.create({
    data: {
      content,
      isPrivate,
      eventId,
      userId: userId,
    },
    include: {
      user: {
        select: { id: true, displayName: true },
      },
    },
  });

  // --- START: PUSH NOTIFICATION LOGIC ---
  if (newMsg) {
    const event = await db.event.findUnique({ 
      where: { id: newMsg.eventId },
      select: { activity: true, attendeesList: true } 
    });

    // Get user IDs from the attendeesList JSON strings
    const recipientUserIds = event?.attendeesList
      .map(attendeeString => {
        try {
          const attendee = JSON.parse(attendeeString);
          // Only include valid user IDs (registered platform users, not manual entries)
          return typeof attendee.userId === "string" && attendee.userId !== newMsg.userId
            ? attendee.userId
            : null;
        } catch {
          return null;
        }
      })
      .filter((id): id is string => !!id) || [];

    // --- Create DB Notifications ---
    if (recipientUserIds.length > 0) {
      await db.notification.createMany({
        data: recipientUserIds.map(userId => ({
          userId,
          messageId: newMsg.id,
        })),
        skipDuplicates: true,
      });
    }

    // --- Send Web Push Notifications ---
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId: { in: recipientUserIds } },
    });

    const notificationPayload = {
      title: `New message in ${event?.activity}`,
      body: `${newMsg.user.displayName}: ${newMsg.content.substring(0, 100)}`,
      url: `/events/${newMsg.eventId}`
    };

    const sendPromises = subscriptions.map((sub: { endpoint: string; p256dh: string; auth: string }) => 
      webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      }, JSON.stringify(notificationPayload))
    );
    
    await Promise.all(sendPromises).catch(err => {
      // Handle errors, e.g., subscription is no longer valid
      console.error("Error sending push notification", err);
    });
  }

  revalidatePath(`/events/${eventId}`);
  return JSON.parse(JSON.stringify(newMsg)); // Ensure it's serializable for client
}

export async function getNewerMessages(eventId: string, lastMessageDate: string, currentUserId?: string) {
  "use server";
  // We use a dedicated query that is safe to expose and call from the client frequently.
  const messages = await getMessagesByEventIdAfter(eventId, new Date(lastMessageDate), currentUserId);
  // We need to serialize the data to pass it from a server component to a client component.
  return JSON.parse(JSON.stringify(messages));
}