import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

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
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, populate the token with user data
      if (user) {
        token.id = user.id;
        token.name = user.displayName; // Use displayName from your DB model
        token.email = user.email;
        token.roles = user.roles;
        token.calendarView = user.calendarView;
      }

      // When the session is updated (e.g., by calling `useSession().update()`),
      // fetch the latest user data from the DB and update the token.
      if (trigger === "update") {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.name = dbUser.displayName; // Use displayName from your DB model
          token.email = dbUser.email;
          token.calendarView = dbUser.calendarView;
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