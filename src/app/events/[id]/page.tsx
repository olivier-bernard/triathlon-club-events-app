import { notFound } from "next/navigation";
import { getEventById } from "@/app/lib/queries/events";
import RegistrationForm from "@/app/components/RegistrationForm";
import AttendeesTable from "@/app/components/AttendeesTable";
import Link from "next/link";
import { EventWithRegistrations } from "@/app/lib/types"; // <-- Import the new type

interface EventDetailPageProps {
  params: { id: string };
}


export default async function EventDetail({ params }: EventDetailPageProps) {
  const inputParams = await params;
  const event: EventWithRegistrations | null = await getEventById(inputParams.id);

  if (!event) {
    return notFound();
  }

  return (
    <>
      <div className="container mx-auto p-1 md:p-8">
        <div className="mb-2">
          <Link href="/events" className="btn btn-outline btn-secondary rounded-box">
            ← Retour à la liste des événements
          </Link>
        </div>

        <div className="bg-base-200 rounded-box shadow-md pt-1 pb-1 px-6 mb-4">
          <h1 className="text-xl font-bold">{event.activity}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-base">
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Heure: {new Date(event.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <p>Distances Options: {event.distanceOptions.join("/")}</p>
            <p>Description: {event.description}</p>
            <p>Lieu: {event.location}</p>
            <p>
              Participants: {event.attendees}
              {event.attendeesLimit > 0 && ` / ${event.attendeesLimit}`}
            </p>
          </div>
        </div >

        {/* Conditionally display the 'seance' field */}
        {event.seance && (
          <div className="bg-base-200 rounded-box shadow-md pt-1 pb-1 px-6 mb-2">
            <div className="mt-2">
              <h2 className="text-lg font-semibold mb-1">Séance du jour :</h2>
              {/* whitespace-pre-line preserves line breaks from your data */}
              <p className="whitespace-pre-line p-4 rounded-box">
                {event.seance}
              </p>
            </div>
          </div >
        )}

        <div className="w-4/5 md:w-3/5 mx-auto mb-6">
          <RegistrationForm
            eventId={event.id}
            distanceOptions={event.distanceOptions}
            groupLevels={event.groupLevels || ["1", "2", "3"]}
          />
        </div>
        <AttendeesTable
          attendeesList={event.attendeesList}
        />
      </div>
    </>
  );
}