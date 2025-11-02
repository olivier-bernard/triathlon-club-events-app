import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import crypto from "crypto";

const brevoApiUrl = process.env.BREVO_EMAIL_API_URL;
const brevoApiKey = process.env.BREVO_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const appName = process.env.APP_NAME;

export async function POST(request: Request) {

  if (!brevoApiUrl || !brevoApiKey || !emailFrom) {
    console.error("Email service is not configured. Check BREVO_EMAIL_API_URL, BREVO_API_KEY, and EMAIL_FROM in .env");
    return NextResponse.json({ error: "Server is not configured to send emails." }, { status: 500 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      console.log("No email provided in password reset request.");
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    // IMPORTANT: Always return a success message, even if the user is not found.
    // This prevents attackers from checking which emails are registered.
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    // 1. Generate a secure, random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 2. Set an expiry date (e.g., 1 hour from now)
    const tokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    // 3. Store the hashed token and expiry in the database
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expires: tokenExpiry,
      },
    });

    // 4. Create the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 5. Send the email using Brevo API
    const emailPayload = {
      sender: { email: emailFrom, name: appName }, // Change this
      to: [{ email: user.email! }],
      subject: `Reset Your Password for ${appName}`,
      htmlContent: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because a password reset was requested for your account.</p>
        <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    const response = await fetch(brevoApiUrl, {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      throw new Error("Failed to send email.");
    }

    // --- DEBUGGING: Log the full response from Brevo ---
    const responseData = await response.json();
    console.log("Brevo API Response:", JSON.stringify(responseData, null, 2));
    return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });

  } catch (error) {
    console.error("Password reset request failed:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}