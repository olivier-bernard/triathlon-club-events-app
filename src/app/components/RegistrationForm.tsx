"use client";

import { useState } from "react";
import { registerForEvent } from "@/app/events/[id]/actions";
import { useFormStatus } from "react-dom";
import { getTranslations } from "@/app/lib/i18n";

interface RegistrationFormProps {
  eventId: string;
  distanceOptions: string[];
  groupList: string[];
  user: {
    id: string;
    displayName: string;
    email: string;
  } | null;
  defaultToManual?: boolean; // Add this prop
  lang?: string; // Add language prop
}

const MANUAL_ENTRY_KEY = "manual";

function SubmitButton({ lang }: { lang: string }) {
  const { pending } = useFormStatus();
  const t = getTranslations(lang).eventRegistration;
  return (
    <button
      type="submit"
      className="btn btn-primary font-bold py-2 px-4 rounded-lg hover:bg-primary-focus"
      disabled={pending}
    >
      {pending ? <span className="loading loading-spinner"></span> : (t.registerButton || "Register")}
    </button>
  );
}

export default function RegistrationForm({ eventId, distanceOptions, groupList, user, defaultToManual = false, lang = "fr" }: RegistrationFormProps) {
  const t = getTranslations(lang).eventRegistration;
  const [message, setMessage] = useState("");
  const [selectedTour, setSelectedTour] = useState(distanceOptions[0] || "");
  const [groupLevel, setGroupLevel] = useState(groupList?.[0] || "-");
  
  // If user is null, it's always a manual entry.
  const isForLoggedInUser = user && !defaultToManual;

  const [nameSelection, setNameSelection] = useState(isForLoggedInUser ? user.displayName : MANUAL_ENTRY_KEY);

  const isManualEntry = nameSelection === MANUAL_ENTRY_KEY || !isForLoggedInUser;

  async function action(formData: FormData) {
    formData.append("eventId", eventId);
    if (groupList.length === 0) {
      formData.append("groupLevel", "-");
    }

    try {
      const result = await registerForEvent(formData);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Registration successful!");
        // A page reload is a simple way to see the updated list
        window.location.reload();
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      console.error("Registration failed", err);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* This hidden input is crucial. It ensures nameSelection is always submitted. */}
      <input type="hidden" name="nameSelection" value={nameSelection} />

      {/* Name Input Section */}
      <div className="form-control">
        <label className="label"><span className="label-text">{t.nameLabel}</span></label>
        {isForLoggedInUser ? (
          <select
            // The name attribute is removed here to avoid duplicate submission.
            className="select select-bordered"
            value={nameSelection}
            onChange={(e) => setNameSelection(e.target.value)}
          >
            <option value={user.displayName}>{user.displayName}</option>
            <option value={MANUAL_ENTRY_KEY}>{t.manualEntry}</option>
          </select>
        ) : null}
        {isManualEntry && (
          <input
            type="text"
            name="manualName"
            placeholder={t.nameLabel}
            className="input input-bordered mt-2"
            required
          />
        )}
      </div>

      {/* Tour/Distance Selection */}
      <div className="form-control">
        <label className="label"><span className="label-text">{t.parcoursLabel}</span></label>
        <select
          name="tour"
          value={selectedTour}
          onChange={(e) => setSelectedTour(e.target.value)}
          className="select select-bordered"
          required
        >
          {distanceOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Group Level Selection */}
      {groupList && groupList.length > 0 && (
        <div className="form-control">
          <label className="label"><span className="label-text">{t.groupLevelLabel}</span></label>
          <select
            name="groupLevel"
            value={groupLevel}
            onChange={(e) => setGroupLevel(e.target.value)}
            className="select select-bordered"
            required
          >
            {groupList.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      )}

      <SubmitButton lang={lang} />
    </form>
  );
};
