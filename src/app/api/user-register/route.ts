import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { email, password, username, displayName } = body;

    // --- Add this logic ---
    // If the email is an empty string, convert it to null
    // so the database's unique constraint is not violated.
    if (email === '') {
      email = null;
    }
    // --- End of added logic ---

    // Check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Check if email already exists (if it's not null)
    if (email) {
      const existingUserByEmail = await db.user.findFirst({
        where: { email: email },
      });
      if (existingUserByEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        displayName,
        email, // This will now correctly be `null` if the email was empty
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}