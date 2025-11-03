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
                  return (
                    <Link
                      href={`/events/${event.id}`}
                      key={event.id}
                      className={`${bgColor} text-white text-xs rounded p-1 w-full truncate block hover:opacity-80 transition-opacity`}
                    >
                      {timeStr} {event.activity}
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