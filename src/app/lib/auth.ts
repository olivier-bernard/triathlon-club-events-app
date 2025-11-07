import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

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
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        try {
          const user = await db.user.findUnique({
            where: { username: credentials.username },
          });
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) return null;
          if (!user.active) return null;
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
      if (isNewUser && user) {
        try {
          const acceptLanguage = headers().get("accept-language");
          const preferredLang = acceptLanguage?.split(',')[0].split('-')[0];
          const supportedLangs = ['en', 'fr'];
          const langToSet = supportedLangs.includes(preferredLang || '') ? preferredLang : 'en';
          await db.user.update({
            where: { id: user.id },
            data: { language: langToSet },
          });
          token.language = langToSet;
        } catch (error) {
          console.error("Failed to set initial language:", error);
          token.language = 'fr';
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.displayName;
        token.email = user.email;
        token.roles = user.roles;
        token.calendarView = user.calendarView;
        token.language = user.language;
      }

      if (trigger === "update" && session) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as number },
        });
        if (dbUser) {
          token.name = dbUser.displayName;
          token.email = dbUser.email;
          token.calendarView = dbUser.calendarView;
          token.language = dbUser.language; 
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.roles = token.roles as string[];
        session.user.calendarView = token.calendarView as boolean;
        session.user.language = token.language as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  }
};