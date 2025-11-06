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
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "./lib/i18n";
import { AllIcon, BikeIcon, TrophyIcon } from "./components/icons/icons";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const lang = session?.user?.language || 'fr';
  const { homePage } = getTranslations(lang);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center h-full flex-grow">
      
      {/* Admin "Create Event" Button at the top */}
      {isAdmin && (
        <div className="w-full flex justify-center mb-12">
          <Link href="/admin/events/new" className="btn btn-ghost text-lg">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            {homePage.createEvent}
          </Link>
        </div>
      )}

      {/* Main Navigation Buttons */}
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-6 md:gap-10">
        <Link href="/events" className="btn btn-primary btn-lg text-xl h-20">
          <AllIcon className="h-8 w-8 mr-3" />
          {homePage.allEvents}
        </Link>
        <Link href="/events?activity=CYCLING" className="btn btn-secondary btn-lg text-xl h-20">
          <BikeIcon className="h-8 w-8 mr-3" />
          {homePage.cycling}
        </Link>
        <Link href="/events?type=COMPETITION" className="btn btn-accent btn-lg text-xl h-20">
          <TrophyIcon className="h-8 w-8 mr-3" />
          {homePage.competitions}
        </Link>
      </div>
    </div>
  );
}