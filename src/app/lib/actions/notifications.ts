"use server";

import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function saveSubscription(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  await db.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId: session.user.id,
    },
    create: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId: session.user.id,
    },
  });
}

// This action will fetch all unread notifications for the logged-in user.
export async function getUnreadNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  const notifications = await db.notification.findMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    include: {
      message: {
        include: {
          user: { // The user who sent the message
            select: { displayName: true },
          },
          event: { // The event the message belongs to
            select: { id: true, activity: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return notifications;
}

// This action will mark notifications as read.
export async function markNotificationsAsRead(notificationIds: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return;

    await db.notification.updateMany({
        where: {
            id: { in: notificationIds },
            userId: session.user.id, // Ensure users can only mark their own notifications
        },
        data: {
            isRead: true,
        },
    });
}

export async function markNotificationsAsReadForEvent(userId: string, eventId: string) {
  // Find all unread notifications for this user and event
  const notifications = await db.notification.findMany({
    where: {
      userId,
      isRead: false,
      message: {
        eventId,
      },
    },
    select: { id: true },
  });

  if (notifications.length > 0) {
    await db.notification.updateMany({
      where: {
        id: { in: notifications.map(n => n.id) },
      },
      data: { isRead: true },
    });
  }
}