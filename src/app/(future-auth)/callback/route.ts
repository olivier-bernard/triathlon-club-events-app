import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Placeholder for Keycloak authentication callback handling
  return NextResponse.json({ message: 'Keycloak callback endpoint' });
}