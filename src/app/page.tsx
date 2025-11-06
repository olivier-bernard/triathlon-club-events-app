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

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getUpcomingEvents } from "./lib/queries/events";
import EventsContainer from "./components/EventsContainer";

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const events = await getUpcomingEvents();

  const userPrefersCalendar = session?.user?.calendarView ?? false;

  const safeEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    time: event.time?.toISOString() ?? null,
  }));

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Événements à venir</h1>
      <EventsContainer
        initialEvents={safeEvents}
        isAdmin={isAdmin}
        initialView={userPrefersCalendar ? 'calendar' : 'list'}
      />
    </div>
  );
}