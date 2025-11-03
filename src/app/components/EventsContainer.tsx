"use client";

import { useState } from "react";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";
import type { Event } from "@/app/lib/types";

type EventsContainerProps = {
  initialEvents: Event[];
  isAdmin: boolean;
};

export default function EventsContainer({ initialEvents, isAdmin }: EventsContainerProps) {
  // The currentView state is now managed here, on the client.
  const [currentView, setView] = useState("list");

  return (
    <div>
      {/* These buttons now just change the client-side state. */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView("list")}
          className={`btn btn-sm mr-2 ${
            currentView === "list" ? "btn-primary font-bold" : "btn-outline"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`btn btn-sm ${
            currentView === "calendar" ? "btn-primary" : "btn-outline"
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Conditionally render the correct component based on the state */}
      {currentView === "list" ? (
        <EventList events={initialEvents} isAdmin={isAdmin} />
      ) : (
        <EventCalendar events={initialEvents} />
      )}
    </div>
  );
}