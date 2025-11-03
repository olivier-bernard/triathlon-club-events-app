import Link from "next/link";
import type { Event } from "@/app/lib/types";

type EventCardProps = {
  event: Event;
  isAdmin: boolean;
};

const EventCard: React.FC<EventCardProps> = ({ event, isAdmin }) => {
  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: "UTC", 
  });

  // Format the time for display using the French locale AND UTC timezone
    const timeStr = event.time ? new Date(event.time).toLocaleTimeString("fr-FR", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Ensures 24-hour format
    timeZone: "UTC", 
  }) : '';

  return (
    <div className="relative bg-base-100 rounded-2xl shadow-xl p-2 md:p-5 transition-transform hover:scale-105 hover:shadow-2xl border-base-200">
      {isAdmin && (
        <Link
          href={`/admin/events/${event.id}/edit`}
          className="absolute top-2 left-1/2 -translate-x-1/2 btn btn-xs btn-outline btn-primary z-10"
        >
          Edit
        </Link>
      )}
      <Link
        href={`/events/${event.id}`}
        className="block cursor-pointer"
      >
        {/* First row: date, time, activity */}
        <div className="flex flex-wrap items-center justify-between text-base-content text-sm mb-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{dateStr}</span>
            {timeStr && <span>-</span>}
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`badge ${event.type === 'Competition' ? 'badge-error text-white font-bold' : 'badge-primary'}`}>
              {event.type}
            </span>
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
    </div>
  );
};

export default EventCard;