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

import EventViewSwitcher from "./components/EventViewSwitcher";
import { getEvents } from "./lib/queries/events";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-2 py-4 md:px-4">
      <h1 className="text-2xl font-bold mb-4">Triathlon & Training Events</h1>
      <EventViewSwitcher events={events} />
    </div>
  );
}