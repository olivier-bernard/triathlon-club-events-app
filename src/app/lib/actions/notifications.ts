"use server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function saveSubscription(subscription: PushSubscription) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  await db.pushSubscription.create({
    data: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId: session.user.id,
    },
  });
}