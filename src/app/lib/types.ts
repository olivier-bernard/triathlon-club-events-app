import { Prisma } from "@prisma/client";

export interface Event {
  id: string;
  activity: string;
  date: Date;
  time: Date;
  type: string;
  location: string;
  description: string;
  distanceOptions: string[];
  attendees: number;
  attendeesLimit: number;
  attendeesList: string[];
  groupLevels?: string[];
  seance?: string | null;
  eventLinks?: string[];
}


const eventWithRegistrations = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: { registrations: true },
});

// This creates the actual TypeScript type based on the validator
export type EventWithRegistrations = Prisma.EventGetPayload<typeof eventWithRegistrations>;


