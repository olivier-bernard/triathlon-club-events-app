import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventForm from "../../EventForm";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

type EditEventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEventPage(props: EditEventPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
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

  return <EventForm event={event} />;
}