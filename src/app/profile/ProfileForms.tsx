"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileInfo, changePassword } from "./actions";
import type { User } from "@prisma/client";

function SubmitButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending || disabled}>
      {pending ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}

export function ProfileInfoForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileInfo, null);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Profile Information for {user.username}</h2>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label"><span className="label-text">Display Name</span></label>
            <input name="displayName" type="text" defaultValue={user.displayName} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">Email Address</span></label>
            <input name="email" type="email" defaultValue={user.email || ""} className="input input-bordered w-full" />
          </div>
          <div className="card-actions justify-end">
            <SubmitButton text="Save Changes" />
          </div>
          {state?.error && <p className="text-sm text-error">{state.error}</p>}
          {state?.success && <p className="text-sm text-success">{state.success}</p>}
        </form>
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
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
        Change Password
      </div>
      <div className="collapse-content">
        <form action={formAction} className="space-y-4 pt-4">
          <div>
            <label className="label"><span className="label-text">Current Password</span></label>
            <input name="currentPassword" type="password" className="input input-bordered w-full" required />
          </div>
          <div>
            <label className="label"><span className="label-text">New Password</span></label>
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
            <label className="label"><span className="label-text">Confirm New Password</span></label>
            <input
              name="confirmPassword"
              type="password"
              className={`input input-bordered w-full ${passwordInputClass()}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {!passwordsMatch && <p className="mt-1 text-xs text-error">Passwords do not match.</p>}
          </div>
          <div className="card-actions justify-end">
            <SubmitButton text="Update Password" disabled={!passwordsMatch} />
          </div>
          {state?.error && <p className="text-sm text-error">{state.error}</p>}
          {state?.success && <p className="text-sm text-success">{state.success}</p>}
        </form>
      </div>
    </div>
  );
}