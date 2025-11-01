"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <form
        onSubmit={e => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          signIn("credentials", {
            username: form.username.value,
            password: form.password.value,
            callbackUrl: "/"
          });
        }}
      >
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Sign in with Username/Password</button>
      </form>
    </div>
  );
}