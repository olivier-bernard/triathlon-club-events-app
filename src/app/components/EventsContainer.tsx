"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { type Event } from "@prisma/client";
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
  const { update } = useSession();
  const { filterLabels } = getTranslations(lang);

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

      {/* Conditionally render the filter panel below the control bar */}
      {isFilterOpen && <EventFilters lang={lang} />}

      <div className={isFilterOpen ? "mt-4" : ""}>
        {currentView === 'list' ? (
          <EventList events={initialEvents} isAdmin={isAdmin} />
        ) : (
          <EventCalendar events={initialEvents} />
        )}
      </div>
    </div>
  );
}