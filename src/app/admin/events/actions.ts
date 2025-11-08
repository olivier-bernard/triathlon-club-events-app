"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

const FormSchema = z.object({
    id: z.string().optional(),
    activity: z.string(),
    date: z.string(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM").optional().or(z.literal('')),
    type: z.string(),
    distanceOptions: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    eventLinks: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    description: z.string(),
    location: z.string(),
    attendeesLimit: z.coerce.number().int().min(0),
    seance: z.string().optional(),
});

const CreateEventSchema = FormSchema.omit({ id: true });
const UpdateEventSchema = FormSchema;

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.roles?.includes("admin")) {
        throw new Error("Unauthorized");
    }
}

export async function createEvent(prevState: { message: string }, formData: FormData) {
    try {
        await checkAdmin();
        const validatedFields = CreateEventSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return { message: "Invalid form data." };
        }

        const { date, time, ...data } = validatedFields.data;
        const eventDate = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        let eventTime: Date | null = null;
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            eventTime = new Date(date);
            eventTime.setUTCHours(hours, minutes, 0, 0);
        }


        await prisma.event.create({
            data: {
                ...data,
                date: eventDate,
                time: eventTime,
                attendees: 0,
                attendeesList: [],
            },
        });
    } catch (error) {
        console.error(error);
        return { message: "Failed to create event." };
    }

    revalidatePath("/events");
    redirect("/events");
}

export async function updateEvent(prevState: { message: string }, formData: FormData) {
    try {
        await checkAdmin();
        const validatedFields = UpdateEventSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return { message: "Invalid form data." };
        }

        const { id, date, time, ...data } = validatedFields.data;
        if (!id) {
            return { message: "Event ID is missing." };
        }

        const eventDate = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        let eventTime: Date | null = null;
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            eventTime = new Date(date);
            eventTime.setUTCHours(hours, minutes, 0, 0);
        }

        await prisma.event.update({
            where: { id },
            data: {
                ...data,
                date: eventDate,
                time: eventTime,
            },
        });
    } catch (error) {
        console.error(error);
        return { message: "Failed to update event." };
    }

    revalidatePath(`/events/${formData.get('id')}`);
    revalidatePath("/events");
    redirect(`/events/${formData.get('id')}`);
}