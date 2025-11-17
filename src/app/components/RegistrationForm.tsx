"use client";

import { useState } from "react";
import { registerForEvent } from "@/app/events/[id]/actions";
import { useFormStatus } from "react-dom";
import { getTranslations } from "@/app/lib/i18n";

type AppUser = {
  id: string;
  displayName: string | null;
};

interface RegistrationFormProps {
  eventId: string;
  distanceOptions: string[];
  groupList: string[];
  user: {
    id: string;
    displayName: string;
    email: string;
  } | null;
  allUsers: AppUser[]; // <-- Add allUsers prop
  defaultToManual?: boolean;
  lang?: string;
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

export default function RegistrationForm({ eventId, distanceOptions, groupList, user, allUsers, defaultToManual = false, lang = "fr" }: RegistrationFormProps) {
  const t = getTranslations(lang).eventRegistration;
  const [message, setMessage] = useState("");
  const [selectedTour, setSelectedTour] = useState(distanceOptions[0] || "");
  const [groupLevel, setGroupLevel] = useState(groupList?.[0] || "-");
  
  // If the user is logged in, default to registering themself. Otherwise, show the placeholder.
  const [nameSelection, setNameSelection] = useState(user ? user.id : "");

  const isManualEntry = nameSelection === MANUAL_ENTRY_KEY;

  async function registerAction(formData: FormData) {
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
    <form action={registerAction} className="flex flex-col gap-4">
      {/* Name Input Section */}
      <div className="form-control">
        <label className="label"><span className="label-text">{t.nameLabel}</span></label>
        <select
          name="nameSelection" // This name is now used to submit the selected userId or "manual"
          className="select select-bordered"
          value={nameSelection}
          onChange={(e) => setNameSelection(e.target.value)}
          required // Ensure a selection is made
        >
          <option value="" disabled>{t.selectUserPlaceholder}</option>
          {user && <option value={user.id}>{t.registerMyself} ({user.displayName})</option>}
          <optgroup label={t.registeredUsers}>
            {/* Filter out the current user from the main list */}
            {allUsers.filter(u => u.id !== user?.id).map(u => (
              <option key={u.id} value={u.id}>{u.displayName}</option>
            ))}
          </optgroup>
          <option value={MANUAL_ENTRY_KEY}>{t.manualEntry}</option>
        </select>

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
