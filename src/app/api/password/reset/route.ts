import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Hash the incoming token to match the one in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in the database
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    // Check if the token is valid and not expired
    if (!passwordResetToken || new Date() > new Date(passwordResetToken.expires)) {
      return NextResponse.json({ error: "Invalid or expired password reset token." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction to update the user's password and delete the token
    await db.$transaction([
      db.user.update({
        where: { id: passwordResetToken.userId },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { id: passwordResetToken.id },
      }),
    ]);

    return NextResponse.json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}