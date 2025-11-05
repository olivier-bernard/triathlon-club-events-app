import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

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
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.name = user.displayName || user.username ;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.user.calendarView = token.calendarView;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.calendarView = user.calendarView;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };