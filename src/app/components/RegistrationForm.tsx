"use client";

import { useState, useTransition } from "react";
import { registerForEvent } from "@/app/events/[id]/actions";

interface RegistrationFormProps {
  eventId: string;
  distanceOptions: string[];
  groupLevels?: string[];
}

export default function RegistrationForm({ eventId, distanceOptions, groupLevels }: RegistrationFormProps) {
  const [message, setMessage] = useState("");
  const [selectedTour, setSelectedTour] = useState(distanceOptions[0] || "");
  const [groupLevel, setGroupLevel] = useState(groupLevels?.[0] || "A");

  async function action(formData: FormData) {
    const name = formData.get("name") as string;
    const tour = formData.get("tour") as string;
    const groupLevel = formData.get("groupLevel") as string;
    console.log("Submitting registration for", name, "to event", eventId);
    try {
      await registerForEvent(eventId, name, tour, groupLevel);
      setMessage("Registration successful!");
      // Refresh the page to show updated attendees
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      console.log("Registration succeeded");
    } catch (err) {
      setMessage("Registration failed.");
      console.error("Registration failed", err);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">S'enregistrer à l'événement</h2>
      {message && <p className="text-blue-500">{message}</p>}
      <input
        type="text"
        name="name"
        placeholder="Ton nom"
        className="border p-2 rounded"
        required
      />
      <select
        name="tour"
        value={selectedTour}
        onChange={(e) => setSelectedTour(e.target.value)}
        className="border p-2 rounded"
        required
      >
        {distanceOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <select
        name="groupLevel"
        value={groupLevel}
        onChange={(e) => setGroupLevel(e.target.value)}
        className="border p-2 rounded"
        required
      >
        {(["1", "2", "3"]).map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
      <button
        type="submit"
        className="btn btn-primary font-bold py-2 px-4 rounded-lg hover:bg-primary-focus"
      >
        S'enregistrer
      </button>
    </form>
  );
};
