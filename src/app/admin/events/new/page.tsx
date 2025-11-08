import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import EventForm from "../EventForm";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  const lang = session?.user?.language || 'fr';

  if (!session?.user?.roles?.includes("admin")) {
    redirect("/"); // Or a dedicated unauthorized page
  }

  return <EventForm lang={lang} />;
}