"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useSession } from "next-auth/react"; // 1. Import useSession
import { useRouter } from 'next/navigation';
import { updateProfileInfo, changePassword } from "./actions";
import { getTranslations } from "@/app/lib/i18n";
// I would like to import USER from '@/types/next-auth.d.ts'
import { User } from 'next-auth';

function SubmitButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending || disabled}>
      {pending ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}

export function ProfileInfoForm({ user, lang }: { user: User; lang: string }) {
  const { profilePage } = getTranslations(lang);
  const [state, formAction] = useActionState(updateProfileInfo, null);
  const [selectedLanguage, setSelectedLanguage] = useState(user.language || 'fr');
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (user.language) {
      setSelectedLanguage(user.language);
    }
  }, [user.language]);

  useEffect(() => {
    // Define an async function to handle the update process
    const handleSuccess = async () => {
      if (state?.success) {
        // 1. First, AWAIT the session update. This ensures the session token
        //    on the server is fresh before we do anything else.
        await update({ language: selectedLanguage });

        // 2. THEN, refresh the page. Now when the server re-fetches data,
        //    getServerSession() will receive the new, correct token.
        router.refresh();
      }
    };

    handleSuccess();
    // We only want this effect to run when `state.success` changes.
    // The other dependencies are stable and can be removed to prevent accidental re-runs.
  }, [state?.success]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{profilePage.infoTitle}</h2>
        <form action={formAction} className="space-y-4">
          {user.roles?.includes("admin") && (
            <div className="badge badge-info badge-outline">{profilePage.adminUser}</div>
          )}
          <div>
            <label className="label"><span className="label-text">{profilePage.displayName}</span></label>
            <input name="displayName" type="text" defaultValue={user.displayName || ""} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">{profilePage.email}</span></label>
            <input name="email" type="email" defaultValue={user.email || ""} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">{profilePage.language}</span></label>
            {/* Use `value` and `onChange` to make this a controlled component */}
            <select 
              name="language" 
              className="select select-bordered w-full" 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="card-actions justify-end">
            <SubmitButton text={profilePage.saveChanges} />
          </div>
          {state?.error && <p className="text-sm text-error">{state.error}</p>}
          {state?.success && <p className="text-sm text-success">{state.success}</p>}
        </form>
      </div>
    </div>
  );
}

export function ChangePasswordForm({ lang }: { lang: string }) {
  const { profilePage } = getTranslations(lang);
  const [state, formAction] = useActionState(changePassword, null);

  // State for live password matching feedback
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true); // Don't show an error if a field is empty
    }
  }, [newPassword, confirmPassword]);

  const passwordInputClass = () => {
    if (!newPassword && !confirmPassword) return "";
    if (!passwordsMatch) return "input-error";
    if (newPassword && confirmPassword && passwordsMatch) return "input-success";
    return "";
  };
  return (
    <div className="collapse collapse-arrow bg-base-100 shadow-xl">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {profilePage.changePasswordTitle}
      </div>
      <div className="collapse-content">
        <form action={formAction} className="space-y-4 pt-4">
          <div>
            <label className="label"><span className="label-text">{profilePage.currentPassword}</span></label>
            <input name="currentPassword" type="password" className="input input-bordered w-full" required />
          </div>
          <div>
            <label className="label"><span className="label-text">{profilePage.newPassword}</span></label>
            <input
              name="newPassword"
              type="password"
              className={`input input-bordered w-full ${passwordInputClass()}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label"><span className="label-text">{profilePage.confirmNewPassword}</span></label>
            <input
              name="confirmPassword"
              type="password"
              className={`input input-bordered w-full ${passwordInputClass()}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {!passwordsMatch && <p className="mt-1 text-xs text-error">{profilePage.passwordsDoNotMatch}</p>}
          </div>
          <div className="card-actions justify-end">
            <SubmitButton text={profilePage.updatePassword} disabled={!passwordsMatch} />
          </div>
          {state?.error && <p className="text-sm text-error">{state.error}</p>}
          {state?.success && <p className="text-sm text-success">{state.success}</p>}
        </form>
      </div>
    </div>
  );
}