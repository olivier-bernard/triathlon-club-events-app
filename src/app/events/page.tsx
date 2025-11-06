import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getEvents } from "../lib/queries/events";
import EventsContainer from "../components/EventsContainer";
import EventFilters from "../components/EventFilters";
import { Activity, EventType } from "@prisma/client";

export const dynamic = 'force-dynamic';

type EventsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const lang = session?.user?.language || 'fr';
  
  // Read the preference directly from the session user object
  const userPrefersCalendar = (session?.user as any)?.calendarView ?? false;

  const filters = {
    showPast: searchParams.showPast === 'true',
    activity: searchParams['activity'] as Activity | undefined,
    type: searchParams['type'] as EventType | undefined,
    fromDate: searchParams['fromDate'] as string | undefined,
    toDate: searchParams['toDate'] as string | undefined,
  };

  const events = await getEvents(filters);

  const safeEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    time: event.time?.toISOString() ?? null,
  }));

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Événements</h1>
      <EventsContainer
        initialEvents={safeEvents}
        isAdmin={isAdmin}
        initialView={userPrefersCalendar ? 'calendar' : 'list'}
        lang={lang}
      />
    </div>
  );
}