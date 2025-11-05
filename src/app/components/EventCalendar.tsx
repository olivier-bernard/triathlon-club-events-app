"use client";

import { useState } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "@/app/calendar.css";
import type { Event } from "@/app/lib/types";
import EventCard from "./EventCard"; // We'll reuse the excellent EventCard component

export default function EventCalendar({ events, isAdmin }: { events: Event[], isAdmin: boolean }) {
  const [activeDate, setActiveDate] = useState(new Date());

  // --- Helper functions from our previous version ---
  function getEventsForDate(date: Date) {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }

  const getEventStyleClasses = (event: Event) => {
    // This logic provides the theme-aware colors you liked
    if (event.type === 'Competition') {
      return { border: 'border-red-500', bg: 'bg-red-100/60 dark:bg-red-900/30', hover: 'hover:bg-red-200/60 dark:hover:bg-red-900/50' };
    }
    if (event.activity === 'Natation') {
      return { border: 'border-blue-500', bg: 'bg-blue-100/60 dark:bg-blue-900/30', hover: 'hover:bg-blue-200/60 dark:hover:bg-blue-900/50' };
    }
    if (event.type === 'Entrainement') {
      return { border: 'border-green-500', bg: 'bg-green-100/60 dark:bg-green-900/30', hover: 'hover:bg-green-200/60 dark:hover:bg-green-900/50' };
    }
    return { border: 'border-gray-400', bg: 'bg-gray-100/60 dark:bg-gray-700/30', hover: 'hover:bg-gray-200/60 dark:hover:bg-gray-700/50' };
  };

  // --- New functionality for the weekly list ---
  const startOfWeek = new Date(activeDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Adjust to Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weeklyEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      {/* The Calendar itself */}
      <div className="bg-base-100 rounded-xl shadow p-2">
        <Calendar
          onClickDay={(date) => setActiveDate(date)}
          value={activeDate}
          tileContent={({ date, view }) => {
            const dayEvents = getEventsForDate(date);
            if (view === "month" && dayEvents.length > 0) {
              return (
                <div className="flex flex-col gap-1 mt-1 w-full">
                  {dayEvents.map((event) => {
                    const style = getEventStyleClasses(event);
                    return (
                      // 1. The event indicator is now a Link component
                      <Link
                        href={`/events/${event.id}`}
                        key={event.id}
                        // 2. Added hover effect and transition for better UX
                        className={`block w-full rounded border-l-4 p-1 transition-colors duration-200 ${style.border} ${style.bg} ${style.hover}`}
                      >
                        <div className="text-xs truncate text-base-content">{event.description}</div>
                      </Link>
                    );
                  })}
                </div>
              );
            }
            return null;
          }}
        />
      </div>

      {/* The Weekly Events List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          Semaine du {startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </h2>
        {weeklyEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {weeklyEvents.map(event => (
              <EventCard key={event.id} event={event} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <p className="text-base-content/70">Aucun événement pour cette semaine.</p>
        )}
      </div>
    </div>
  );
}