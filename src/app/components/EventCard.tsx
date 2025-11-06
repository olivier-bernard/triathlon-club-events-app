"use client";

import Link from "next/link";
import type { Event } from "@/app/lib/types";
import { getTranslations } from "../lib/i18n"; // Import the translation function

// --- ICONS ---
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>
);
const RoadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
);

type EventCardProps = {
  event: Event;
  isAdmin: boolean;
  lang: string; // Add lang prop
};

const EventCard: React.FC<EventCardProps> = ({ event, isAdmin, lang }) => {
  // Get the translation maps for the current language
  const { activityTranslations, eventTypeTranslations } = getTranslations(lang);

  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: "UTC", 
  });

  const timeStr = event.time ? new Date(event.time).toLocaleTimeString("fr-FR", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: "UTC", 
  }) : '';

  const getBorderColor = () => {
    if (event.type === 'COMPETITION') return 'border-red-500';
    if (event.activity === 'SWIMMING') return 'border-blue-500';
    if (event.type === 'TRAINING') return 'border-green-500';
    return 'border-transparent';
  };

  return (
    <div className={`relative flex bg-base-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 ${getBorderColor()}`}>
      
      {isAdmin && (
        <Link
          href={`/admin/events/${event.id}/edit`}
          className="absolute top-2 right-2 btn btn-xs btn-ghost btn-circle z-10"
          aria-label="Edit Event"
        >
          ✏️
        </Link>
      )}

      <Link
        href={`/events/${event.id}`}
        className="block w-full p-4"
      >
        <div className="flex flex-col gap-1.5">
          
          <h3 className="text-lg font-bold text-primary truncate pr-8">{event.description}</h3>

          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-base-content/70 flex-shrink-0">
              <CalendarIcon />
              <span className="font-bold">{dateStr}</span>
              {timeStr && <span>- {timeStr}</span>}
            </div>
            <div className="flex items-center gap-2">
              {/* Use the translated value for event type */}
              <span className={`badge ${event.type === 'COMPETITION' ? 'badge-error text-white font-bold' : 'badge-primary'}`}>
                {eventTypeTranslations[event.type] || event.type}
              </span>
              {/* Use the translated value for event activity */}
              <span className="badge badge-secondary">
                {activityTranslations[event.activity] || event.activity}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm mt-1">
            <div className="flex items-center gap-1.5">
              <UsersIcon />
              <span>
                {event.attendees}
                {event.attendeesLimit > 0 && ` / ${event.attendeesLimit}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <LocationIcon />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RoadIcon />
              <span>{event.distanceOptions.join(" / ")}</span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
};

export default EventCard;