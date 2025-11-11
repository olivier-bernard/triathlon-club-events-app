import { DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  /**
   * The `user` object in the session includes all fields from your Prisma `User` model,
   * plus your custom `roles`, `language`, and `calendarView` properties.
   */
  interface Session {
    user: {
      roles: string[];
      language?: string;
      calendarView?: boolean;
      timeFormat?: boolean;
      displayName?: string | null; 
    } & PrismaUser & // Combines Prisma User fields
      DefaultSession["user"]; // Adds default fields like name, email, image
  }

  interface User extends PrismaUser {
    roles: string[];
    calendarView?: boolean;
    language?: string;
    timeFormat?: boolean;
    displayName?: string | null; 
  }
}