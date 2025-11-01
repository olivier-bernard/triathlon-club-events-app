import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { username, password, email, displayName } = await request.json();

  if (!username || !password || !displayName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  await db.user.create({
    data: {
      username,
      password: hashed,
      email,
      displayName: displayName || username
    },
  });

  return NextResponse.json({ success: true });
}