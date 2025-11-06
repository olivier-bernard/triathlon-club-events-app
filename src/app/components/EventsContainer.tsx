"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { type Event } from "@prisma/client";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";
import EventFilters from "./EventFilters";

type EventsContainerProps = {
  initialEvents: Event[];
  isAdmin: boolean;
  initialView: 'list' | 'calendar';
  lang: string;
};

export default function EventsContainer({ initialEvents, isAdmin, initialView, lang }: EventsContainerProps) {
  const [currentView, setView] = useState(initialView);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { update } = useSession();

  const handleSetView = async (view: 'list' | 'calendar') => {
    setView(view);
    await update({ calendarView: view === 'calendar' });
  };

  return (
    <div>
      {/* This single container now handles all layout states */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-y-4">
        <EventFilters 
          lang={lang} 
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
        />

        <div className="join">
          <button
            className={`join-item btn btn-sm ${currentView === 'list' ? 'btn-primary' : ''}`}
            onClick={() => handleSetView('list')}
          >
            List View
          </button>
          <button
            className={`join-item btn btn-sm ${currentView === 'calendar' ? 'btn-primary' : ''}`}
            onClick={() => handleSetView('calendar')}
          >
            Calendar View
          </button>
        </div>
      </div>

      {currentView === 'list' ? (
        <EventList events={initialEvents} isAdmin={isAdmin} />
      ) : (
        <EventCalendar events={initialEvents} />
      )}
    </div>
  );
}