import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUpcomingEvents } from "../lib/queries/events";
import EventsContainer from "../components/EventsContainer";

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const events = await getUpcomingEvents();

  const userPrefersCalendar = session?.user?.calendarView ?? false;
  console.log("Users preference for calendar view:", userPrefersCalendar);

  const safeEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    time: event.time?.toISOString() ?? null,
  }));

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Événements à venir</h1>
      <EventsContainer
        initialEvents={safeEvents}
        isAdmin={isAdmin}
        initialView={userPrefersCalendar ? 'calendar' : 'list'}
      />
    </div>
  );
}