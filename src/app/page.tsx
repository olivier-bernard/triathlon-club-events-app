import EventViewSwitcher from "./components/EventViewSwitcher";
import { getEvents } from "./lib/queries/events";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-2 py-4 md:px-4">
      <h1 className="text-2xl font-bold mb-4">Triathlon & Training Events</h1>
      <EventViewSwitcher events={events} />
    </div>
  );
}