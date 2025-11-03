import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventForm from "../EventForm";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("admin")) {
    redirect("/"); // Or a dedicated unauthorized page
  }

  return <EventForm />;
}