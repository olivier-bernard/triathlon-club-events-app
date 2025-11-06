"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";
import { Activity, EventType } from "@prisma/client";
import { getTranslations } from "../lib/i18n";
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';


type EventFiltersProps = {
  lang: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function EventFilters({ lang, isOpen, setIsOpen }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { activityTranslations, eventTypeTranslations, filterLabels } = getTranslations(lang);
  const activityOptions = Object.keys(activityTranslations) as Activity[];
  const typeOptions = Object.keys(eventTypeTranslations) as EventType[];

  // Close dropdown when clicking outside on desktop
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth < 768) return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, setIsOpen]);

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

  // Conditionally set width: full width only when open on mobile
  const containerWidthClass = isOpen ? 'w-full md:w-auto' : 'w-auto';

  return (
    <div className={`md:relative ${containerWidthClass}`} ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="btn btn-sm btn-ghost">
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
        {isOpen ? filterLabels.hideFilters : filterLabels.displayFilters}
      </button>

      {isOpen && (
        <div className="mt-2 md:absolute md:top-full md:left-0 md:mt-2 z-20 w-full md:w-80">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4">
              <div className="space-y-4">
                {/* Activity */}
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

                {/* Type */}
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

                {/* Dates */}
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
      )}
    </div>
  );
}