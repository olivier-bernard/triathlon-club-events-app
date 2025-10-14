"use server";
import { db } from "@/app/lib/db";

export async function registerForEvent(eventId: string, name: string, tour: string, groupLevel: string) {
  if (!eventId || !name) throw new Error("Missing fields");
  const attendeeInfo = JSON.stringify({ name, tour, groupLevel });
  console.log("Registering", attendeeInfo, "for event", eventId);
  await db.event.update({
    where: { id: eventId },
    data: {
      attendeesList: { push: attendeeInfo },
      attendees: { increment: 1 },
    },
  });
}