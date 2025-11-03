import { getEvents } from "../lib/queries/events";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EventsContainer from "../components/EventsContainer";

// This is a clean Server Component again.
export default async function EventsPage() {
  const [events, session] = await Promise.all([
    getEvents(),
    getServerSession(authOptions),
  ]);

  const isAdmin = session?.user?.roles?.includes("admin") ?? false;

  const safeEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    time: event.time ? event.time.toISOString() : null,
  }));

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Evenements VCT</h1>

      <EventsContainer initialEvents={safeEvents} isAdmin={isAdmin} />
    </div>
  );
}