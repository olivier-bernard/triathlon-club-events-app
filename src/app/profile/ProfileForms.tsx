"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfileInfo, changePassword } from "./actions";
import type { User } from "@prisma/client";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}

export function ProfileInfoForm({ user }: { user: User }) {
  const [state, formAction] = useFormState(updateProfileInfo, null);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Profile Information</h2>
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
  const [state, formAction] = useFormState(changePassword, null);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Change Password</h2>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label"><span className="label-text">Current Password</span></label>
            <input name="currentPassword" type="password" className="input input-bordered w-full" required />
          </div>
          <div>
            <label className="label"><span className="label-text">New Password</span></label>
            <input name="newPassword" type="password" className="input input-bordered w-full" required />
          </div>
          <div className="card-actions justify-end">
            <SubmitButton text="Update Password" />
          </div>
          {state?.error && <p className="text-sm text-error">{state.error}</p>}
          {state?.success && <p className="text-sm text-success">{state.success}</p>}
        </form>
      </div>
    </div>
  );
}