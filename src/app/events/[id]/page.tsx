import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  FlagIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEventById } from "@/app/lib/queries/events";
import RegistrationForm from "@/app/components/RegistrationForm";
import AttendeesTableClient from "@/app/components/AttendeesTableClient";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetail(props: EventDetailPageProps) {
  const params = await props.params;
  const { id } = params;
  // Fetch data sequentially to resolve the sync-dynamic-apis error.
  const event = await getEventById(id);
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.roles?.includes("admin") ?? false;

  if (!event) {
    return notFound();
  }

  const isUserRegistered = session?.user
    ? event.attendeesList.some(attendeeString => {
        try {
          const attendee = JSON.parse(attendeeString);
          return attendee.userId && attendee.userId === session.user.id;
        } catch {
          return false;
        }
      })
    : false;

  // Helper function for border color, same as in EventCard
  const getBorderColor = () => {
    if (event.type === 'Competition') return 'border-red-500';
    if (event.activity === 'Natation') return 'border-blue-500';
    if (event.type === 'Entrainement') return 'border-green-500';
    return 'border-transparent';
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="btn btn-outline btn-primary rounded-box">
          ← Retour
        </Link>
        {isAdmin && (
          <Link href={`/admin/events/${event.id}/edit`} className="btn btn-primary">
            Modifier l'événement
          </Link>
        )}
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        {/* --- Left Column: Event Info & Attendees --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`card bg-base-200 shadow-xl border-l-4 ${getBorderColor()}`}>
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h1 className="card-title text-3xl md:text-4xl font-bold">{event.description}</h1>
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                  <span className={`badge ${event.type === 'Competition' ? 'badge-error text-white font-bold' : 'badge-primary'}`}>
                    {event.type}
                  </span>
                  <span className="badge badge-secondary">{event.activity}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-base md:text-lg mt-4">
                <p className="flex items-center"><CalendarDaysIcon className="h-6 w-6 mr-3 text-primary" /> {new Date(event.date).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="flex items-center"><ClockIcon className="h-6 w-6 mr-3 text-primary" /> {event.time ? new Date(event.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'N/A'}</p>
                <p className="flex items-center"><MapPinIcon className="h-6 w-6 mr-3 text-primary" /> {event.location}</p>
                <p className="flex items-center"><FlagIcon className="h-6 w-6 mr-3 text-primary" /> Distances: {event.distanceOptions.join(" / ")}</p>
                <p className="flex items-center"><UsersIcon className="h-6 w-6 mr-3 text-primary" /> Participants: {event.attendees}{event.attendeesLimit > 0 && ` / ${event.attendeesLimit}`}</p>
              </div>
            </div>
          </div>

          {event.eventLinks && event.eventLinks.length > 0 && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title"><ArrowRightCircleIcon className="h-6 w-6 mr-2 text-primary" />Circuits<span className="text-sm font-normal italic ml-2">- Cliquer pour accéder au parcours ou description</span></h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  {event.eventLinks.map((link: any, index: number) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-secondary">
                      {event.distanceOptions[index] || `Parcours ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* On mobile, this will appear after the registration block */}
          <div className="card bg-base-200 shadow-xl order-3 lg:order-2">
            <div className="card-body">
              <h2 className="card-title">Participants</h2>
              <AttendeesTableClient
                eventId={event.id}
                initialAttendeesList={event.attendeesList}
              />
            </div>
          </div>
        </div>

        {/* --- Right Column: Registration & Seance --- */}
        {/* On mobile, this will appear before the participants list */}
        <div className="lg:col-span-1 space-y-6 mt-6 lg:mt-0 order-2 lg:order-3">
          {isUserRegistered ? (
            <div className="collapse collapse-arrow bg-base-200 shadow-xl">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium bg-success text-success-content">
                Vous êtes déjà inscrit !
              </div>
              <div className="collapse-content">
                <p className="pt-4">Vous pouvez inscrire une autre personne ci-dessous.</p>
                 <RegistrationForm
                    eventId={event.id}
                    distanceOptions={event.distanceOptions}
                    groupLevels={event.groupLevels || undefined}
                    user={null} // Forcing registration for another person
                  />
              </div>
            </div>
          ) : (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">S'inscrire à l'événement</h2>
                <RegistrationForm
                  eventId={event.id}
                  distanceOptions={event.distanceOptions}
                  groupLevels={event.groupLevels || undefined}
                  user={session?.user ? { id: session.user.id, displayName: session.user.name || "", email: session.user.email || "" } : null}
                />
              </div>
            </div>
          )}

          {event.seance && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title"><ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-primary" />Séance du jour</h2>
                <p className="whitespace-pre-line p-2 rounded-box mt-2">{event.seance}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}