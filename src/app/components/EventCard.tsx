import Link from "next/link";
import type { Event } from "@/app/lib/types";


const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: "UTC", // <-- This is crucial to fix hydration errors
  });

  // Format the time for display using the French locale AND UTC timezone
  const timeStr = new Date(event.time).toLocaleTimeString("fr-FR", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Ensures 24-hour format
    timeZone: "UTC", // <-- This is crucial to fix hydration errors
  });
  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-base-100 rounded-2xl shadow-xl p-2 md:p-5 transition-transform hover:scale-105 hover:shadow-2xl  border-base-200 cursor-pointer"
    >
      {/* First row: date, time, activity */}
      <div className="flex flex-wrap items-center justify-between text-base-content text-sm mb-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{dateStr}</span>
          <span>-</span>
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="badge badge-primary">{event.type}</span>
          <span>-</span>
          <span className="badge badge-primary">{event.activity}</span>
        </div>
      </div>
      {/* Second row: attendees, location, distances */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-sm text-base-content">
          👥 {event.attendees}
          {event.attendeesLimit > 0 && ` / ${event.attendeesLimit}`}
        </span>
        <span className="text-sm text-base-content truncate">
          📍 {event.location}
        </span>
        <span className="text-sm text-base-content">
    {event.distanceOptions.join("/")}
        </span>
      </div>
    </Link>
  );
};

export default EventCard;