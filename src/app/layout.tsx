// Copyright 2025 Olivier BERNARD - Novoptic Labs - VCT
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar"; // Import the NavBar
import NextAuthProvider from "./components/NextAuthProvider";
import NotificationManager from "./components/NotificationManager"; // <-- Import the new component
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { NotificationProvider } from './components/NotificationContext'; // <-- Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cycling Events",
  description: "A platform to view and register for cycling training events",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang={session?.user?.language || 'fr'}>
      <body>
        <NextAuthProvider>
          <NotificationProvider> 
            <NavBar />
            {session && <NotificationManager />}
            <main className="p-4">{children}</main>
          </NotificationProvider> 
        </NextAuthProvider>
      </body>
    </html>
  );
}