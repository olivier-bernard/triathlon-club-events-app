import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/db";
import { redirect } from "next/navigation";
import { ProfileInfoForm, ChangePasswordForm } from "./ProfileForms";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-start">
        <ProfileInfoForm user={user} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}