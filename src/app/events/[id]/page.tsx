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
import { authOptions } from "@/app/lib/auth";
import { getEventById } from "@/app/lib/queries/events";
import RegistrationForm from "@/app/components/RegistrationForm";
import AttendeesTableClient from "@/app/components/AttendeesTableClient";
import { getTranslations } from "@/app/lib/i18n";
import EventChat from "@/app/components/EventChat";
import { getMessagesByEventId } from "@/app/lib/queries/messages";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetail(props: EventDetailPageProps) {
  const params = await props.params;
  const { id } = params;
  // Fetch data sequentially
  const event = await getEventById(id);
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? String(session.user.id) : undefined;
  const messages = await getMessagesByEventId(id, userId); // Fetch messages

  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const lang = session?.user?.language || 'fr';
  const timeFormat = session?.user?.timeFormat ?? true;
  const { eventDetail, eventTypeTranslations, activityTranslations, chat: chatTranslations } = getTranslations(lang);

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

  // Helper function for border color, updated to use enum keys
  const getBorderColor = () => {
    if (event.type === 'COMPETITION') return 'border-red-500';
    if (event.activity === 'SWIMMING') return 'border-blue-500';
    if (event.type === 'TRAINING') return 'border-green-500';
    return 'border-transparent';
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/events" className="btn btn-outline btn-primary rounded-box">
          ← {eventDetail.back}
        </Link>
        {isAdmin && (
          <Link href={`/admin/events/${event.id}/edit`} className="btn btn-primary">
            {eventDetail.editEvent}
          </Link>
        )}
      </div>

      {/* --- Main Content Container --- */}
      <div className="grid lg:flex lg:gap-8">

        {/* --- Left Column --- */}
        <div className="contents lg:w-2/3 lg:flex lg:flex-col lg:gap-6">
          {/* Mobile Order: 1 */}
          <div className={`card bg-base-200 shadow-xl border-l-4 ${getBorderColor()} order-1`}>
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h1 className="card-title text-3xl md:text-4xl font-bold">{event.description}</h1>
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                  <span className={`badge ${event.type === 'COMPETITION' ? 'badge-error text-white font-bold' : 'badge-primary'}`}>
                    {eventTypeTranslations[event.type] || event.type}
                  </span>
                  <span className="badge badge-secondary">{activityTranslations[event.activity] || event.activity}</span>
                </div>
              </div>

              <div className="space-y-3 text-base md:text-lg mt-4">
                <p className="flex items-center"><CalendarDaysIcon className="h-6 w-6 mr-3 text-primary" /> {new Date(event.date).toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="flex items-center"><ClockIcon className="h-6 w-6 mr-3 text-primary" /> {event.time
                  ? new Date(event.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: !timeFormat, // 24h if true, 12h if false
                  })
                  : 'N/A'}</p>
                <p className="flex items-center"><MapPinIcon className="h-6 w-6 mr-3 text-primary" /> {event.location}</p>
                <p className="flex items-center"><FlagIcon className="h-6 w-6 mr-3 text-primary" /> {eventDetail.distances}: {event.distanceOptions.join(" / ")}</p>
                <p className="flex items-center"><UsersIcon className="h-6 w-6 mr-3 text-primary" /> {eventDetail.attendees}: {event.attendees}{event.attendeesLimit > 0 && ` / ${event.attendeesLimit}`}</p>
              </div>
            </div>
          </div>

          {/* Mobile Order: 2 */}
          {event.eventLinks && event.eventLinks.length > 0 && (
            <div className="card bg-base-200 shadow-xl order-2">
              <div className="card-body">
                <h2 className="card-title"><ArrowRightCircleIcon className="h-6 w-6 mr-2 text-primary" />{eventDetail.circuits}<span className="text-sm font-normal italic ml-2">{eventDetail.circuitsDescription}</span></h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  {event.eventLinks.map((link: any, index: number) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-secondary">
                      {event.distanceOptions[index] || `${eventDetail.route} ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Order: 5 */}
          <div className="card bg-base-200 shadow-xl order-5">
            <div className="card-body">
              <h2 className="card-title">{eventDetail.attendees}</h2>
              <AttendeesTableClient
                eventId={event.id}
                initialAttendeesList={event.attendeesList}
              />
            </div>
          </div>
        </div>

        {/* --- Right Column --- */}
        <div className="contents lg:w-1/3 lg:flex lg:flex-col lg:gap-6">
          {/* Mobile Order: 3 */}
          {event.seance && (
            <div className="card bg-base-200 shadow-xl order-3">
              <div className="card-body">
                <h2 className="card-title"><ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-primary" />{eventDetail.todaysSession}</h2>
                <p className="whitespace-pre-line p-2 rounded-box mt-2">{event.seance}</p>
              </div>
            </div>
          )}

          {/* Mobile Order: 4 */}
          <div className="order-4">
            {isUserRegistered ? (
              <div className="collapse collapse-arrow bg-base-200 shadow-xl">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium bg-success text-success-content">
                  {eventDetail.alreadyRegistered}
                </div>
                <div className="collapse-content">
                  <p className="pt-4">{eventDetail.registerAnother}</p>
                  <RegistrationForm
                    eventId={event.id}
                    distanceOptions={event.distanceOptions}
                    groupList={event.groupList}
                    user={null}
                    lang={lang}
                  />
                </div>
              </div>
            ) : (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{eventDetail.registerForEvent}</h2>
                  <RegistrationForm
                    eventId={event.id}
                    distanceOptions={event.distanceOptions}
                    groupList={event.groupList}
                    user={session?.user ? { id: session.user.id, displayName: session.user.name || "", email: session.user.email || "" } : null}
                    lang={lang}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Order: 6 - NEW CHAT COMPONENT */}
          {session?.user && (
            <div className="order-6 mt-6 lg:mt-0">
              <EventChat
                eventId={event.id}
                currentUserId={userId}
                initialMessages={JSON.parse(JSON.stringify(messages))}
                translations={chatTranslations}
                timeFormat={timeFormat}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}