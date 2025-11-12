"use client";

import type { Event } from "@/app/lib/types";
import { createEvent, updateEvent } from "./actions";
import { useActionState, useState } from "react";
import Link from "next/link";
import { getTranslations } from "@/app/lib/i18n";

// --- New Type for Track State ---
type Track = {
    distance: string;
    link: string;
};

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
    const [groupCount, setGroupCount] = useState(event?.groupList?.length || 0);

    // --- New State for Dynamic Tracks ---
    const initialTracks = event?.distanceOptions?.map((distance, index) => ({
        distance: distance,
        link: event.eventLinks?.[index] || "",
    })) || [{ distance: "", link: "" }]; // Start with one empty track for new events

    const [tracks, setTracks] = useState<Track[]>(initialTracks);

    const handleTrackChange = (index: number, field: keyof Track, value: string) => {
        const newTracks = [...tracks];
        newTracks[index][field] = value;
        setTracks(newTracks);
    };

    const addTrack = () => {
        setTracks([...tracks, { distance: "", link: "" }]);
    };

    const removeTrack = (index: number) => {
        if (tracks.length <= 1) return; // Don't remove the last track
        const newTracks = tracks.filter((_, i) => i !== index);
        setTracks(newTracks);
    };
    // --- End of New State Logic ---

    // --- Start of Recommended Changes ---

    // Treat the ISO string from the database as text to avoid timezone conversion.
    // Example: "2025-11-20T14:00:00.000Z"
    const dateIsoString = event?.date ? new Date(event.date).toISOString() : "";
    console.log("EventForm isoString:", dateIsoString);

    // Extract 'YYYY-MM-DD' directly from the ISO string.
    const defaultDate = dateIsoString ? dateIsoString.substring(0, 10) : "";
    
    // Extract 'HH:mm' directly from the date string.
    const timeIsoString = event?.time ? new Date(event.time).toISOString() : "";
    console.log("EventForm isoString:", timeIsoString);
    const time24h = timeIsoString ? timeIsoString.substring(11, 16) : "";
    console.log("EventForm time24h:", time24h);

    // --- End of Recommended Changes ---

    let defaultTimeValue = time24h;
    console.log("EventForm defaultTimeValue:", defaultTimeValue);
    let defaultAmPm = 'AM';

    // If timeFormat is 12-hour AND there is a time, convert it
    if (!timeFormat && time24h) {
        let [hours, minutes] = time24h.split(':').map(Number);
        defaultAmPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert hour to 12-hour format (12, 1, 2, ..., 11)
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        defaultTimeValue = `${formattedHours}:${formattedMinutes}`;
    }
    console.log("EventForm defaultTimeValue:", defaultTimeValue);
    // --- End Time Formatting Logic ---

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
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        id="time" 
                                        name="time" 
                                        className="input input-bordered w-full" 
                                        defaultValue={defaultTimeValue} 
                                        pattern={timeFormat ? "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" : "^(0?[1-9]|1[0-2]):[0-5][0-9]$"}
                                        placeholder={timeFormat ? "HH:MM" : "hh:mm"}
                                        required={eventType !== "COMPETITION"} 
                                        maxLength={5}
                                    />
                                    {!timeFormat && (
                                        <select name="ampm" className="select select-bordered" defaultValue={defaultAmPm}>
                                            <option>AM</option>
                                            <option>PM</option>
                                        </select>
                                    )}
                                </div>
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
                             {/* Group Count */}
                             <div className="form-control">
                                <label htmlFor="groupCount" className="label"><span className="label-text">Number of Groups (0 for none)</span></label>
                                <input 
                                    type="number" 
                                    id="groupCount" 
                                    name="groupCount" 
                                    className="input input-bordered w-full" 
                                    value={groupCount}
                                    onChange={(e) => setGroupCount(Number(e.target.value))}
                                    min="0" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Advanced Options Card --- */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">{t.linksAndDistances}</h2>
                        
                        {/* --- Hidden inputs for form submission --- */}
                        <input type="hidden" name="distanceOptions" value={tracks.map(t => t.distance).join(",")} />
                        <input type="hidden" name="eventLinks" value={tracks.map(t => t.link).join(",")} />

                        <div className="space-y-4">
                            <label className="label"><span className="label-text font-medium">{t.distanceOptions}</span></label>
                            {tracks.map((track, index) => (
                                <div key={index} className="p-4 border border-base-300 rounded-lg space-y-2 relative bg-base-100">
                                    {tracks.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeTrack(index)} 
                                            className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2"
                                            aria-label="Remove track"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text-alt">{t.distancePlaceholder || 'Track Name or Distance'}</span></label>
                                        <input 
                                            type="text" 
                                            value={track.distance}
                                            onChange={(e) => handleTrackChange(index, 'distance', e.target.value)}
                                            className="input input-bordered w-full" 
                                            placeholder="e.g., Parcours S, 10km Run"
                                            required 
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text-alt">{t.linksPlaceholder || 'Link (GPX, website)'}</span></label>
                                        <input 
                                            type="url" 
                                            value={track.link}
                                            onChange={(e) => handleTrackChange(index, 'link', e.target.value)}
                                            className="input input-bordered w-full" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addTrack} className="btn btn-sm bg-green-50 hover:bg-green-100 shadow-md border-green-200 text-green-900">
                                {t.addDistance || 'Add Track'}
                            </button>
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