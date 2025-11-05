"use client";

import Link from "next/link";
import Calendar from "react-calendar";
import "@/app/calendar.css";
import type { Event } from "@/app/lib/types";

export default function EventCalendar({ events }: { events: Event[] }) {
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
    switch (event.type) {
      case 'Competition':
        return {
          border: 'border-red-500',
          bg: 'bg-red-100/60 dark:bg-red-900/30',
          hover: 'hover:bg-red-200/60 dark:hover:bg-red-900/50',
        };
      case 'Entrainement':
        // Special case for Swimming activity
        if (event.activity === 'Natation') {
          return {
            border: 'border-blue-500',
            bg: 'bg-blue-100/60 dark:bg-blue-900/30',
            hover: 'hover:bg-blue-200/60 dark:hover:bg-blue-900/50',
          };
        }
        return {
          border: 'border-green-500',
          bg: 'bg-green-100/60 dark:bg-green-900/30',
          hover: 'hover:bg-green-200/60 dark:hover:bg-green-900/50',
        };
      default:
        return {
          border: 'border-gray-400',
          bg: 'bg-gray-100/60 dark:bg-gray-700/30',
          hover: 'hover:bg-gray-200/60 dark:hover:bg-gray-700/50',
        };
    }
  };

  return (
    <div className="bg-base-100 rounded-xl shadow">
      <Calendar
        tileContent={({ date, view }) => {
          const dayEvents = getEventsForDate(date);
          if (view === "month" && dayEvents.length > 0) {
            return (
              <div className="flex flex-col gap-1 mt-1 w-full">
                {dayEvents.map((event) => {
                  const bgColor =
                    event.type.toLowerCase() === "competition"
                      ? "bg-red-500"
                      : "bg-blue-500";
                  const timeStr = event.time
                    ? new Date(event.time).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })
                    : "";

                 const style = getEventStyleClasses(event);

                  return (
                    <Link
                      href={`/events/${event.id}`}
                      key={event.id}
                      // 2. Apply the new styling: light background, dark text, and a colored border.
                                            className={`group w-full rounded border-l-4 p-1 text-base-content transition-colors duration-200 ${style.border} ${style.bg} ${style.hover}`}
                    >
                      {/* 3. Display the time and the more informative event description. */}
                      <div className="flex items-center gap-1 text-xs truncate">
                        {timeStr && <span className="font-semibold">{timeStr}</span>}
                        <span className="truncate">{event.description}</span>
                      </div>
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
  );
}