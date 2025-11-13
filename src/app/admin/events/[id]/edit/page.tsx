export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import EventForm from "../../EventForm";
import { db as prisma } from "@/app/lib/db";
import { notFound } from "next/navigation";

type EditEventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEventPage(props: EditEventPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const lang = session?.user?.language || 'fr';
  const timeFormat = session?.user?.timeFormat ?? true;
  console.log("EditEventPage timeFormat:", timeFormat);

  if (!session?.user?.roles?.includes("admin")) {
    redirect("/");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!event) {
    notFound();
  }

  return <EventForm event={event} lang={lang} timeFormat={timeFormat} />;
}