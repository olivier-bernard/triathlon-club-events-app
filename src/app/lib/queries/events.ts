import { db } from "@/app/lib/db";

export async function getEvents() {
  return db.event.findMany({
    include: { registrations: true },
    orderBy: { date: "asc" },
  });
}

/*
export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { registrations: true },
  });
} */

export async function getEventById(id: string) {

  return db.event.findUnique({
    where: { id },
    include: {
      registrations: true,
    },
  });

}

export async function createEvent(data: {
  activity: string;
  date: Date;
  time: Date;
  type: string;
  distanceOptions: string[];
  eventLinks: string[];
  description: string;
  location: string;
  attendeesLimit: number;
  seance: string;
}) {
  return db.event.create({
    data: {
      ...data,
      attendeesList: [],
      attendees: 0,
    },
  });
}

export async function registerForEvent(eventId: string, userName: string) {
  console.log("registerForEvent called with", eventId, userName);
  const event = await db.event.findUnique({
    where: { id: eventId },
  });
  console.log("registerForEvent called with", eventId, userName, "Found event:", event);

  if (!event) {
    console.log("Event not found", eventId);
    throw new Error("Event not found");
  }

  if (event.attendeesLimit > 0 && event.attendees >= event.attendeesLimit) {
    console.log("Event is full", eventId);
    throw new Error("Event is full");
  }

  if (event.attendeesList.includes(userName)) {
    console.log("User already registered for this event", userName);
    throw new Error("User already registered for this event");
  }

  return db.event.update({
    where: { id: eventId },
    data: {
      attendees: { increment: 1 },
      attendeesList: { push: userName },
    },
  });
}

export async function unregisterFromEvent(eventId: string, userName: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.attendeesList.includes(userName)) {
    throw new Error("User is not registered for this event");
  }

  // Remove all occurrences of userName from attendeesList
  const updatedAttendeesList = event.attendeesList.filter((name) => name !== userName);

  return db.event.update({
    where: { id: eventId },
    data: {
      attendees: { decrement: 1 },
      attendeesList: {
        set: updatedAttendeesList,
      },
    },
  });
}

export async function deleteEvent(eventId: string) {
  return db.event.delete({
    where: { id: eventId },
  });
}

export async function updateEvent(eventId: string, data: Partial<{
  activity: string;
  date: Date;
  time: Date;
  type: string;
  distanceOptions: string[];
  eventLinks: string[];
  description: string;
  location: string;
  attendeesLimit: number;
  attendeesList: string[];
  attendees: number;
}>) {
  return db.event.update({
    where: { id: eventId },
    data,
  });
}

