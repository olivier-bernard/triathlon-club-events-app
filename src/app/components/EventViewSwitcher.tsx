"use client";

import React, { useState } from "react";
import Link from "next/link";
import Calendar from "react-calendar"; // If you use react-calendar
import "@/app/calendar.css"; // Import our new custom calendar styles

export default function EventViewSwitcher({ events, children, isAdmin }: { events: any[]; children: React.ReactElement; isAdmin: boolean }) {
  const [view, setView] = useState<"list" | "calendar">("list");

  // Helper to check if a date has an event
  function hasEventOn(date: Date) {


    return events.some((event) => {
      const eventDate = new Date(event.date);

      const isMatch =
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();

      return isMatch;
    });
  }

  function getEventsForDate(date: Date) {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      // Use UTC methods for a robust, timezone-proof comparison
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }


  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          className={`btn btn-sm mr-2 ${view === "list" ? "btn-primary font-bold" : "btn-outline"}`}
          onClick={() => setView("list")}
        >
          List View
        </button>
        <button
          className={`btn btn-sm ${view === "calendar" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setView("calendar")}
        >
          Calendar View
        </button>
      </div>
      {view === "list" ? (
        React.cloneElement(children, { isAdmin })
      ) : (
        <div className="bg-base-100 rounded-xl shadow">
          <Calendar
            tileContent={({ date, view }) => {
              // Find events for the current day
              const dayEvents = getEventsForDate(date);
              // Only render content in the month view
              if (view === "month" && dayEvents.length > 0) {
                return (
                  <div className="flex flex-col gap-1 mt-1 w-full">
                    {dayEvents.map((event) => {
                      // Determine the color based on event type
                      const bgColor =
                        event.type.toLowerCase() === "competition"
                          ? "bg-red-500"
                          : "bg-blue-500";

                      // Format time for display
                      const timeStr = new Date(event.time).toLocaleTimeString("fr-FR", {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: "UTC",
                      });

                      return (
                        <Link
                          href={`/events/${event.id}`}
                          key={event.id}
                          className={`${bgColor} text-white text-xs rounded p-1 w-full truncate block hover:opacity-80 transition-opacity`}
                        >
                          {timeStr} - {event.activity}
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
      )}
    </div>
  );
}
