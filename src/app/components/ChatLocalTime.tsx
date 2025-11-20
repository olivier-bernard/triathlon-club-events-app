"use client";

import { useState, useEffect } from 'react';

export default function ChatLocalTime({ date, timeFormat, lang = "fr", }: { date: string, timeFormat: boolean, lang?: string; }) {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    const d = new Date(date);
    // This effect runs only on the client, after the initial render.
    const options: Intl.DateTimeFormatOptions = timeFormat
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : { hour: '2-digit', minute: '2-digit', hour12: true };

    const localTime = d.toLocaleTimeString(lang, options);
    const dayOfWeek = d.toLocaleDateString(lang, { weekday: 'short' });
    const dayOfMonth = d.getDate();

    const monthName = d.toLocaleDateString(lang, { month: 'short' });
    setDisplayTime(`${dayOfWeek} ${dayOfMonth} ${monthName}, ${localTime}`);
  }, [date, timeFormat, lang]);

  return <time className="text-xs opacity-50">{displayTime || '--:--'}</time>;
}