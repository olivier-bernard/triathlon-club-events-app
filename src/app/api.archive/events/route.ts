import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/queries/events';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.error();
  }
}