"use client";

import { useState } from "react";
import type { Event } from "@/app/lib/types";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";
import { updateDisplayPreference } from "../profile/actions";

type EventsContainerProps = {
  initialEvents: Event[];
  isAdmin: boolean;
  initialView: 'list' | 'calendar';
};

export default function EventsContainer({ initialEvents, isAdmin, initialView }: EventsContainerProps) {
  const [currentView, setView] = useState(initialView);

  const handleSetView = (view: 'list' | 'calendar') => {
    setView(view);
    // Save the preference to the database (fire-and-forget)
    updateDisplayPreference(view === 'calendar');
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleSetView("list")}
          className={`btn btn-sm mr-2 transition-colors duration-200 ${
            currentView === "list" 
              ? "btn-primary font-bold" 
              : "btn-outline hover:bg-primary hover:text-primary-content hover:border-primary"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => handleSetView("calendar")}
          className={`btn btn-sm transition-colors duration-200 ${
            currentView === "calendar" 
              ? "btn-primary font-bold" 
              : "btn-outline hover:bg-primary hover:text-primary-content hover:border-primary"
          }`}
        >
          Calendar View
        </button>
      </div>

      {currentView === "list" ? (
        <EventList events={initialEvents} isAdmin={isAdmin} />
      ) : (
        <EventCalendar events={initialEvents} isAdmin={isAdmin} />
      )}
    </div>
  );
}