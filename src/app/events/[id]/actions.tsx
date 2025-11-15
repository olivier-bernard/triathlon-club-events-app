"use server";
import { db } from "@/app/lib/db";
import { updateEvent, getEventById } from "@/app/lib/queries/events";
import { revalidatePath } from "next/cache";

const MANUAL_ENTRY_KEY = "manual";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const nameSelection = formData.get("nameSelection") as string; // This is now a userId or "manual"
  const manualName = formData.get("manualName") as string;
  const tour = formData.get("tour") as string;
  const groupLevel = formData.get("groupLevel") as string;

  if (!eventId || !tour || !groupLevel) {
    return { error: "Missing required fields." };
  }

  const isManualEntry = nameSelection === MANUAL_ENTRY_KEY;
  let displayName: string | null = null;
  let userId: string | null = null;

  if (isManualEntry) {
    if (!manualName) return { error: "Name is required for manual entry." };
    displayName = manualName;
    userId = null;
  } else {
    // It's a userId, so we need to fetch the user's name
    userId = nameSelection;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "Selected user not found." };
    displayName = user.displayName;
  }

  if (!displayName) {
    return { error: "Name is required." };
  }

  try {
    const event = await getEventById(eventId);
    if (!event) {
      return { error: "Event not found." };
    }

    // Check if user is already registered by either userId or name
    const isAlreadyRegistered = event.attendeesList.some(attendeeString => {
      try {
        const attendee = JSON.parse(attendeeString);
        // A user with a userId is unique.
        if (userId && attendee.userId && attendee.userId === userId) {
          return true;
        }
        // For manual entries, check if the name already exists.
        if (!userId && attendee.name.toLowerCase() === displayName.toLowerCase()) {
          return true;
        }
        return false;
      } catch { 
        return false; 
      }
    });

    if (isAlreadyRegistered) {
      return { error: "This user or name is already registered for the event." };
    }

    const newRegistrationObject = {
      name: displayName,
      tour: tour,
      groupLevel: groupLevel,
      userId: userId,
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