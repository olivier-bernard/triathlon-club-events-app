import React from "react";
import EventCard from "./EventCard";
import type { Event } from "@/app/lib/types"; 

export default function EventList({ events, isAdmin }: { events: Event[], isAdmin: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
