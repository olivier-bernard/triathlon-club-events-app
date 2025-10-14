import EventViewSwitcher from "../components/EventViewSwitcher";
import { getEvents } from "../lib/queries/events";

export default async function EventsPage() {
  const events = await getEvents();
  const safeEvents = events.map(event => ({
    ...event,
    date: event.date instanceof Date ? event.date.toISOString() : event.date,
    time: event.time instanceof Date ? event.time.toISOString() : event.time,
  }));

  return (
    <div className="container mx-auto px-2 py-4 md:p-32:w
    ">
      <h1 className="text-2xl font-bold mb-4">Evenements VCT</h1>
      <EventViewSwitcher events={safeEvents} />
    </div>
  );
}