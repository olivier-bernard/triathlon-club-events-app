"use server";
import { db } from "@/app/lib/db";
import { updateEvent, getEventById } from "@/app/lib/queries/events";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

const MANUAL_ENTRY_KEY = "manual";

export async function registerForEvent(formData: FormData) {
  const session = await getServerSession(authOptions);

  const eventId = formData.get("eventId") as string;
  const nameSelection = formData.get("nameSelection") as string;
  const manualName = formData.get("manualName") as string;
  const tour = formData.get("tour") as string;
  const groupLevel = formData.get("groupLevel") as string;

  if (!eventId || !tour || !groupLevel) {
    return { error: "Missing required fields." };
  }

  const isManualEntry = nameSelection === MANUAL_ENTRY_KEY;
  const displayName = isManualEntry ? manualName : nameSelection;

  if (!displayName) {
    return { error: "Name is required." };
  }

  try {
    const event = await getEventById(eventId);
    if (!event) {
      return { error: "Event not found." };
    }

    const newRegistrationObject = {
      name: displayName,
      tour: tour,
      groupLevel: groupLevel,
      userId: isManualEntry ? null :  String(session?.user?.id),
    };

    const newRegistrationString = JSON.stringify(newRegistrationObject);

    const updatedAttendeesList = [...event.attendeesList, newRegistrationString];

    await updateEvent(eventId, {
      attendeesList: updatedAttendeesList,
      attendees: updatedAttendeesList.length,
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { error: "Failed to register for the event." };
  }
}

export async function handleDelete(eventId: string, updatedAttendeesList: string[]) {
  await updateEvent(eventId, {
    attendeesList: updatedAttendeesList,
    attendees: updatedAttendeesList.length,
  });
}