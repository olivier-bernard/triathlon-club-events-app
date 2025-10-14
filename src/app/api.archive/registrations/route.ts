import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { registrationSchema } from '@/lib/validations/registration';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = registrationSchema.parse(body);

    const registration = await db.registration.create({
      data: {
        eventId: parsedData.eventId,
        userId: parsedData.userId,
        name: parsedData.name,
        email: parsedData.email,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}