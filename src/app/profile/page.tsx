import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/db";
import { redirect } from "next/navigation";
import { ProfileInfoForm, ChangePasswordForm } from "./ProfileForms";
import { getTranslations } from "@/app/lib/i18n";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // The user ID is a string (cuid), not an integer.
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const lang = user.language || 'fr';
  const { profilePage } = getTranslations(lang);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{profilePage.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-start">
        <ProfileInfoForm user={user} lang={lang} />
        <ChangePasswordForm lang={lang} />
      </div>
    </div>
  );
}