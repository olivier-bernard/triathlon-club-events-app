"use client";

import type { Event } from "@/app/lib/types";
import { createEvent, updateEvent } from "./actions";
import { useActionState, useState } from "react";
import Link from "next/link";
import { getTranslations } from "@/app/lib/i18n";

type EventFormProps = {
    event?: Event | null;
    lang: string;
    timeFormat: boolean; // <-- Add this prop
};

export default function EventForm({ event, lang, timeFormat }: EventFormProps) {
    const translations = getTranslations(lang);
    const t = translations.eventForm;

    const isEditing = !!event;
    const action = isEditing ? updateEvent : createEvent;
    const [state, formAction] = useActionState(action, { message: "" });

    // Get enum keys from the translation objects
    const activityKeys = Object.keys(translations.activityTranslations);
    const eventTypeKeys = Object.keys(translations.eventTypeTranslations);

    const [eventType, setEventType] = useState(event?.type || eventTypeKeys[0]);

    // For editing, format date and time for input fields
    const defaultDate = event?.date ? new Date(event.date).toISOString().split('T')[0] : "";
    const defaultTime = event?.time
        ? new Date(event.time).toLocaleTimeString(lang, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !timeFormat,
        }).padStart(5, '0') // ensures HH:MM format
        : "";

    return (
        <div className="p-4 md:p-8">
            <form action={formAction} className="space-y-8 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{isEditing ? t.editTitle : t.createTitle}</h1>
                    <Link href={isEditing ? `/events/${event.id}` : "/events"} className="btn btn-ghost">
                        {t.cancel}
                    </Link>
                </div>

                {isEditing && <input type="hidden" name="id" value={event.id} />}

                {/* --- Main Details Card --- */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t.mainDetails}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Description */}
                            <div className="form-control md:col-span-2">
                                <label htmlFor="description" className="label"><span className="label-text">{t.description}</span></label>
                                <input type="text" id="description" name="description" className="input input-bordered w-full" defaultValue={event?.description || ""} required />
                            </div>

                            {/* Activity */}
                            <div className="form-control">
                                <label htmlFor="activity" className="label"><span className="label-text">{t.activity}</span></label>
                                <select id="activity" name="activity" className="select select-bordered w-full" defaultValue={event?.activity || ""} required>
                                    <option value="" disabled>{t.selectActivity}</option>
                                    {activityKeys.map((activity) => (
                                        <option key={activity} value={activity}>
                                            {translations.activityTranslations[activity as keyof typeof translations.activityTranslations]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div className="form-control">
                                <label htmlFor="type" className="label"><span className="label-text">{t.type}</span></label>
                                <select id="type" name="type" className="select select-bordered w-full" value={eventType} onChange={(e) => setEventType(e.target.value)} required>
                                    {eventTypeKeys.map((type) => (
                                        <option key={type} value={type}>
                                            {translations.eventTypeTranslations[type as keyof typeof translations.eventTypeTranslations]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div className="form-control">
                                <label htmlFor="date" className="label"><span className="label-text">{t.date}</span></label>
                                <input type="date" id="date" name="date" className="input input-bordered w-full" defaultValue={defaultDate} required />
                            </div>

                            {/* Time */}
                            <div className="form-control">
                                <label htmlFor="time" className="label"><span className="label-text">{t.time}</span></label>
                                <input type="time" id="time" name="time" className="input input-bordered w-full" defaultValue={defaultTime} pattern="[0-2][0-9]:[0-5][0-9]" placeholder="HH:MM" required={eventType !== "COMPETITION"} />
                            </div>

                            {/* Location */}
                            <div className="form-control md:col-span-2">
                                <label htmlFor="location" className="label"><span className="label-text">{t.location}</span></label>
                                <input type="text" id="location" name="location" className="input input-bordered w-full" defaultValue={event?.location || ""} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Content Card --- */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t.contentAndOptions}</h2>
                        <div className="space-y-6">
                            {/* Seance */}
                            <div className="form-control">
                                <label htmlFor="seance" className="label"><span className="label-text">{t.seance}</span></label>
                                <textarea id="seance" name="seance" className="textarea textarea-bordered h-24" defaultValue={event?.seance || ""}></textarea>
                            </div>
                            {/* Attendees Limit */}
                            <div className="form-control">
                                <label htmlFor="attendeesLimit" className="label"><span className="label-text">{t.attendeesLimit}</span></label>
                                <input type="number" id="attendeesLimit" name="attendeesLimit" className="input input-bordered w-full" defaultValue={event?.attendeesLimit ?? 0} min="0" required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Advanced Options Card --- */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t.linksAndDistances}</h2>
                        <div className="space-y-6">
                            {/* Distance Options */}
                            <div className="form-control">
                                <label htmlFor="distanceOptions" className="label"><span className="label-text">{t.distanceOptions}</span></label>
                                <input type="text" id="distanceOptions" name="distanceOptions" className="input input-bordered w-full" defaultValue={event?.distanceOptions?.join(", ") || ""} placeholder={t.distancePlaceholder} />
                                <label className="label"><span className="label-text-alt">{t.commaSeparated}</span></label>
                            </div>

                            {/* Event Links */}
                            <div className="form-control">
                                <label htmlFor="eventLinks" className="label"><span className="label-text">{t.eventLinks}</span></label>
                                <input type="text" id="eventLinks" name="eventLinks" className="input input-bordered w-full" defaultValue={event?.eventLinks?.join(", ") || ""} placeholder={t.linksPlaceholder}/>
                                <label className="label"><span className="label-text-alt">{t.commaSeparated}</span></label>
                            </div>
                        </div>
                    </div>
                </div>

                {state.message && <p className="text-error text-center">{state.message}</p>}

                {/* --- Action Buttons --- */}
                <div className="sticky bottom-0 bg-base-100/90 p-4 flex justify-end gap-4 rounded-t-lg -mx-4 -mb-8 md:static md:bg-transparent md:p-0 md:mx-0 md:mb-0">
                    <Link href={isEditing ? `/events/${event.id}` : "/events"} className="btn btn-ghost">
                        {t.cancel}
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? t.updateButton : t.createButton}
                    </button>
                </div>
            </form>
        </div>
    );
}