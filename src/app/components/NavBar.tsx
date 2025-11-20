import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import ClientNavBar from "./ClientNavBar";

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  if (!session) return null;
  return <ClientNavBar session={session} />;
}