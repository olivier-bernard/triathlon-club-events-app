"use client";

import { type Event } from "@prisma/client";
import { createEvent, updateEvent } from "./actions";
import { useActionState, useState } from "react";

type EventFormProps = {
    event?: Event | null;
};

export default function EventForm({ event }: EventFormProps) {
    const isEditing = !!event;
    const action = isEditing ? updateEvent : createEvent;
    const [state, formAction] = useActionState(action, { message: "" });
    const [eventType, setEventType] = useState(event?.type || "Entrainement");

    // For editing, format date and time for input fields
    const defaultDate = event?.date ? new Date(event.date).toISOString().split('T')[0] : "";
    const defaultTime = event?.time ? new Date(event.time).toTimeString().substring(0, 5) : "";

    return (
        <form action={formAction} className="space-y-6 p-4 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Event" : "Create New Event"}</h1>

            {isEditing && <input type="hidden" name="id" value={event.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity */}
                <div className="form-control">
                    <label htmlFor="activity" className="label">
                        <span className="label-text">Activity</span>
                    </label>
                    <select
                        id="activity"
                        name="activity"
                        className="select select-bordered w-full"
                        defaultValue={event?.activity || ""}
                        required
                    >
                        <option value="" disabled>Select an activity</option>
                        <option value="Cyclisme">Cyclisme</option>
                        <option value="Course sur route">Course sur route</option>
                        <option value="Trail">Trail</option>
                        <option value="Natation">Natation</option>
                        <option value="Triathlon">Triathlon</option>
                        <option value="Run & Bike">Run & Bike</option>
                        <option value="Aquathlon">Aquathlon</option>
                    </select>
                </div>

                {/* Type */}
                <div className="form-control">
                    <label htmlFor="type" className="label">
                        <span className="label-text">Type</span>
                    </label>
                    <select
                        id="type"
                        name="type"
                        className="select select-bordered w-full"
                        defaultValue={event?.type || ""}
                        onChange={(e) => setEventType(e.target.value)}
                        required
                    >
                        <option value="Entrainement">Entrainement</option>
                        <option value="Competition">Competition</option>
                    </select>
                </div>

                {/* Date */}
                <div className="form-control">
                    <label htmlFor="date" className="label">
                        <span className="label-text">Date</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="input input-bordered w-full"
                        defaultValue={defaultDate}
                        required
                    />
                </div>

                {/* Time */}
                <div className="form-control">
                    <label htmlFor="time" className="label">
                        <span className="label-text">Time (24h format)</span>
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className="input input-bordered w-full"
                        defaultValue={defaultTime}
                        pattern="[0-2][0-9]:[0-5][0-9]"
                        placeholder="HH:MM"
                        required={eventType !== 'Competition'}
                    />
                </div>

                {/* Location */}
                <div className="form-control">
                    <label htmlFor="location" className="label">
                        <span className="label-text">Location</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="input input-bordered w-full"
                        defaultValue={event?.location || ""}
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-control">
                    <label htmlFor="description" className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="input input-bordered w-full"
                        defaultValue={event?.description || ""}
                        required
                    />
                </div>

                {/* Attendees Limit */}
                <div className="form-control">
                    <label htmlFor="attendeesLimit" className="label">
                        <span className="label-text">Attendees Limit (0 for unlimited)</span>
                    </label>
                    <input
                        type="number"
                        id="attendeesLimit"
                        name="attendeesLimit"
                        className="input input-bordered w-full"
                        defaultValue={event?.attendeesLimit ?? 0}
                        min="0"
                        required
                    />
                </div>
            </div>

            {/* Seance */}
            <div className="form-control">
                <label htmlFor="seance" className="label">
                    <span className="label-text">Seance (Optional)</span>
                </label>
                <textarea
                    id="seance"
                    name="seance"
                    className="textarea textarea-bordered h-24"
                    defaultValue={event?.seance || ""}
                ></textarea>
            </div>

            {/* Distance Options */}
            <div className="form-control">
                <label htmlFor="distanceOptions" className="label">
                    <span className="label-text">Distance Options (comma-separated)</span>
                </label>
                <input
                    type="text"
                    id="distanceOptions"
                    name="distanceOptions"
                    className="input input-bordered w-full"
                    defaultValue={event?.distanceOptions.join(", ") || ""}
                />
            </div>

            {/* Event Links */}
            <div className="form-control">
                <label htmlFor="eventLinks" className="label">
                    <span className="label-text">Event Links (comma-separated URLs)</span>
                </label>
                <input
                    type="text"
                    id="eventLinks"
                    name="eventLinks"
                    className="input input-bordered w-full"
                    defaultValue={event?.eventLinks.join(", ") || ""}
                />
            </div>

            {state.message && <p className="text-error">{state.message}</p>}

            <button type="submit" className="btn btn-primary w-full md:w-auto">
                {isEditing ? "Update Event" : "Create Event"}
            </button>
        </form>
    );
}