"use client";

import { useState, useTransition } from "react";
import AttendeesTable from "./AttendeesTable";
import { handleDelete } from "@/app/events/[id]/actions";

interface AttendeesTableClientProps {
  eventId: string;
  initialAttendeesList: string[];
}

export default function AttendeesTableClient({ eventId, initialAttendeesList }) {
  const [attendeesList, setAttendeesList] = useState(initialAttendeesList);
  const [isPending, startTransition] = useTransition();

  const onDelete = async (idx: number) => {
    const updatedAttendeesList = [...attendeesList];
    updatedAttendeesList.splice(idx, 1);
    setAttendeesList(updatedAttendeesList);

    startTransition(async () => {
      await handleDelete(eventId, updatedAttendeesList);
    });
  };

  return (
    <AttendeesTable attendeesList={attendeesList} onDelete={onDelete} />
  );
}