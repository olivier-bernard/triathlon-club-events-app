import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { headers } from "next/headers"; // Import headers

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 24 * 60 * 60, // 8 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- Authorize Function Start ---");
        console.log("Credentials received:", credentials);

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Find user in the database
        try {
          const user = await db.user.findUnique({
            where: { username: credentials.username },
          });

          if (!user) {
            console.log("User not found", credentials.username);
            return null;
          }

          // Compare password
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            console.log("Invalid password for user:", credentials.username);
            return null;
          }

          if (!user.active) {
            console.log("User inactive:", credentials.username);
            return null;
          }
          // Return user object (id, name, email)
          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session, isNewUser }) {
      // --- This is the new logic for setting language ---
      // On the very first sign-in for a new user
      if (isNewUser && user) {
        try {
          // Read the 'Accept-Language' header from the browser request
          const acceptLanguage = headers().get("accept-language");
          const preferredLang = acceptLanguage?.split(',')[0].split('-')[0];
          const supportedLangs = ['en', 'fr'];
          const langToSet = supportedLangs.includes(preferredLang || '') ? preferredLang : 'en';

          // Save the detected language to the database
          await db.user.update({
            where: { id: user.id },
            data: { language: langToSet },
          });
          // Also update the token immediately
          token.language = langToSet;
        } catch (error) {
          console.error("Failed to set initial language:", error);
          // Default to 'fr' if header detection fails
          token.language = 'fr';
        }
      }

      // On subsequent sign-ins, populate the token with user data
      if (user) {
        token.id = user.id;
        token.name = user.displayName; // Use displayName from your DB model
        token.email = user.email;
        token.roles = user.roles;
        token.calendarView = user.calendarView;
        token.language = user.language; // Ensure language is loaded into token
      }

      // When the session is updated (e.g., by calling `useSession().update()`),
      // fetch the latest user data from the DB and update the token.
      if (trigger === "update" && session) {
        if (typeof session.calendarView === 'boolean') {
          await db.user.update({
            where: { id: token.id as string },
            data: { calendarView: session.calendarView },
          });
        }

        // This is your existing logic to keep the token fresh. It now runs after the potential update.
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.name = dbUser.displayName; // Use displayName from DB model
          token.email = dbUser.email;
          token.calendarView = dbUser.calendarView;
          token.language = dbUser.language; 
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.roles = token.roles as string[];
        session.user.calendarView = token.calendarView as boolean;
        session.user.language = token.language as string; // Pass language to session
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };