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

  const newMessage = await db.message.create({
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

  if (newMessage) {
    const event = await db.event.findUnique({ where: { id: newMessage.eventId } });
    const recipients = event?.attendeesList.filter(id => id !== newMessage.userId) || [];

    const subscriptions = await db.PushSubscription.findMany({
      where: { userId: { in: recipients } },
    });

    const notificationPayload = {
      title: `New message in ${event?.activity}`,
      body: `${newMessage.user.displayName}: ${newMessage.content.substring(0, 100)}`,
      url: `/events/${newMessage.eventId}`
    };

    const sendPromises = subscriptions.map(sub => 
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
  return JSON.parse(JSON.stringify(newMessage)); // Ensure it's serializable for client
}

export async function getNewerMessages(eventId: string, lastMessageDate: string, currentUserId?: string) {
  "use server";
  // We use a dedicated query that is safe to expose and call from the client frequently.
  const messages = await getMessagesByEventIdAfter(eventId, new Date(lastMessageDate), currentUserId);
  // We need to serialize the data to pass it from a server component to a client component.
  return JSON.parse(JSON.stringify(messages));
}