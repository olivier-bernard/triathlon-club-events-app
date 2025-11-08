"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { type Event } from "@/app/lib/types";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";
import EventFilters from "./EventFilters";
import { getTranslations } from "../lib/i18n";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

type EventsContainerProps = {
  initialEvents: Event[];
  isAdmin: boolean;
  initialView: 'list' | 'calendar';
  lang: string;
};

export default function EventsContainer({ initialEvents, isAdmin, initialView, lang }: EventsContainerProps) {
  const [currentView, setView] = useState(initialView);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const { update } = useSession();
  
  // Use the 'lang' prop directly for translations
  const { filterLabels, eventsContainer } = getTranslations(lang);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleSetView = async (view: 'list' | 'calendar') => {
    setView(view);
    await update({ calendarView: view === 'calendar' });
  };

  return (
    <div>
      {/* Control bar with trigger and view switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="btn btn-sm btn-ghost">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          {isFilterOpen ? filterLabels.hideFilters : filterLabels.displayFilters}
        </button>

        <div className="join">
          <button
            className={`join-item btn btn-sm ${currentView === 'list' ? 'btn-primary' : ''}`}
            onClick={() => handleSetView('list')}
          >
            {eventsContainer.listView}
          </button>
          <button
            className={`join-item btn btn-sm ${currentView === 'calendar' ? 'btn-primary' : ''}`}
            onClick={() => handleSetView('calendar')}
          >
            {eventsContainer.calendarView}
          </button>
        </div>
      </div>

      {/* Conditionally render the filter panel below the control bar */}
      {isFilterOpen && <EventFilters lang={lang} />}

      <div className={isFilterOpen ? "mt-4" : ""}>
        {currentView === 'list' ? (
          // Ensure the 'lang' prop is passed to EventList
          <EventList events={events} isAdmin={isAdmin} lang={lang} />
        ) : (
          <EventCalendar events={events} isAdmin={isAdmin} lang={lang} />
        )}
      </div>
    </div>
  );
}