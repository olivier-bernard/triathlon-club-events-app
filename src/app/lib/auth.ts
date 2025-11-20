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
          if (!user || !user.password) return null; 
          console.log("Authorizing user:", user.username);
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) return null;
          if (!user.active) return null;
          return {
            ...user,
            id: String(user.id), // Convert id to string
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // For OAuth providers, check if it's a new user
      if (account?.provider === "google") {
        const userExists = await db.user.findUnique({
          where: { email: user.email ?? undefined },
        });

        // If the user doesn't exist, it's their first time signing in.
        // We need to create the user with the required fields.
        if (!userExists) {
          if (!user.email) {
            // This should not happen with Google, but as a safeguard
            return false;
          }

          // Generate a unique username from the email
          let username = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
          let usernameExists = await db.user.findUnique({ where: { username } });
          while (usernameExists) {
            const randomSuffix = Math.floor(Math.random() * 1000);
            username = `${username}${randomSuffix}`;
            usernameExists = await db.user.findUnique({ where: { username } });
          }

          // Map Google name to displayName and remove name property
          user.username = username;
          user.displayName = user.name ?? username;
          delete user.name; 
          user.roles = ['user']; // Assign a default role
          user.active = true; // Activate the user by default
        }
      }

      // Get language from login page (pass it as a query param or in session)
      const loginLang = typeof credentials?.lang === "string" ? credentials.lang : "fr"; // Ensure string

      // Fetch user from DB
      let dbUser: any = null;
      if (typeof user.email === "string" && user.email) {
        dbUser = await db.user.findUnique({ where: { email: user.email } });
      } else if (typeof user.username === "string" && user.username) {
        dbUser = await db.user.findUnique({ where: { username: user.username } });
      } else if (typeof user.id === "string" && user.id) {
        dbUser = await db.user.findUnique({ where: { id: user.id } });
      }

      if (!dbUser) {
        // First login: set language
        await db.user.create({
          data: {
            ...user,
            language: loginLang,
            displayName: typeof user.displayName === "string" ? user.displayName : (user.username ?? "user"),
          },
        });
      } 
      return true; 
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = String(user.id);
        token.name = user.displayName;
        token.email = user.email;
        token.roles = user.roles;
        token.calendarView = user.calendarView;
        token.language = user.language;
        token.timeFormat = user.timeFormat; 
      }

      // Handle session updates (e.g., from useSession().update())
      if (trigger === "update" && session) {
        try {
          // Prepare the data object for database update
          const updateData: any = {};
          
          // Check which fields are being updated
          if (session.calendarView !== undefined) {
            updateData.calendarView = session.calendarView;
            token.calendarView = session.calendarView;
          }
          
          // Only update the database if there are changes
          if (Object.keys(updateData).length > 0) {
            await db.user.update({
              where: { id: token.id as string },
              data: updateData,
            });
          }
          
          // Fetch the latest user data to ensure token is in sync
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
          });
          
          if (dbUser) {
            token.name = dbUser.displayName;
            token.email = dbUser.email;
            token.calendarView = dbUser.calendarView;
            token.language = dbUser.language;
            token.timeFormat = dbUser.timeFormat;
          }
        } catch (error) {
          console.error("Failed to update user session:", error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email ?? null;
        session.user.roles = token.roles as string[];
        session.user.calendarView = token.calendarView as boolean;
        session.user.language = token.language as string;
        session.user.timeFormat = token.timeFormat as boolean;
      }

      // Attach language from DB to session
      let dbUser: any = null;
      if (typeof session.user.email === "string" && session.user.email) {
        dbUser = await db.user.findUnique({ where: { email: session.user.email } });
      } else if (typeof session.user.username === "string" && session.user.username) {
        dbUser = await db.user.findUnique({ where: { username: session.user.username } });
      } else if (typeof session.user.id === "string" && session.user.id) {
        dbUser = await db.user.findUnique({ where: { id: session.user.id } });
      }

      session.user.language = dbUser?.language || "fr";

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  }
};