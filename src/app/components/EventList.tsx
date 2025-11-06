import React from "react";
import EventCard from "./EventCard";
import type { Event } from "@/app/lib/types"; 

// Make sure EventListProps accepts lang
type EventListProps = {
  events: Event[];
  isAdmin: boolean;
  lang: string; // Receive lang from EventsContainer
};

export default function EventList({ events, isAdmin, lang }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isAdmin={isAdmin} lang={lang} /> // Pass lang to EventCard
      ))}
    </div>
  );
}
