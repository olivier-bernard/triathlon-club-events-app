"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Activity, EventType } from "@prisma/client";
import { getTranslations } from "../lib/i18n";

type EventFiltersProps = {
  lang: string;
};

// This component is now just the filter panel.
export default function EventFilters({ lang }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activityTranslations, eventTypeTranslations, filterLabels } = getTranslations(lang);
  const activityOptions = Object.keys(activityTranslations) as Activity[];
  const typeOptions = Object.keys(eventTypeTranslations) as EventType[];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  return (
    <div className="mt-2 w-full">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="form-control">
              <label className="label py-1"><span className="label-text">{filterLabels.activity}</span></label>
              <select
                className="select select-bordered select-sm"
                value={searchParams.get("activity") || ""}
                onChange={(e) => handleFilterChange("activity", e.target.value)}
              >
                <option value="">{filterLabels.all}</option>
                {activityOptions.map(opt => (
                  <option key={opt} value={opt}>{activityTranslations[opt]}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text">{filterLabels.type}</span></label>
              <select
                className="select select-bordered select-sm"
                value={searchParams.get("type") || ""}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">{filterLabels.all}</option>
                {typeOptions.map(opt => (
                  <option key={opt} value={opt}>{eventTypeTranslations[opt]}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text">{filterLabels.from}</span></label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={searchParams.get("fromDate") || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text">{filterLabels.to}</span></label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={searchParams.get("toDate") || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
              />
            </div>
          </div>
          <div className="divider my-2"></div>
          <div className="flex justify-center gap-2">
              <button
                className={`btn btn-sm ${!searchParams.get("showPast") ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleFilterChange("showPast", "")}
              >
                {filterLabels.upcomingEvents}
              </button>
              <button
                className={`btn btn-sm ${searchParams.get("showPast") ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleFilterChange("showPast", "true")}
              >
                {filterLabels.allEvents}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}