"use server";
import { db } from "@/app/lib/db";
import { updateEvent } from "@/app/lib/queries/events";

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

export async function handleDelete(eventId: string, updatedAttendeesList: string[]) {
  await updateEvent(eventId, {
    attendeesList: updatedAttendeesList,
    attendees: updatedAttendeesList.length,
  });
}