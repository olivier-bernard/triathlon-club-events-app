"use client";

import { useState, useEffect } from 'react';

export default function ChatLocalTime({ date, timeFormat }: { date: string, timeFormat: boolean }) {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This safely avoids the server-client mismatch.
    const options: Intl.DateTimeFormatOptions = timeFormat
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : { hour: '2-digit', minute: '2-digit', hour12: true };
    
    const localTime = new Date(date).toLocaleTimeString([], options);
    setDisplayTime(localTime);
  }, [date, timeFormat]); // Dependencies to re-run if props change

  // On the server and during the initial client render, render a placeholder.
  // After hydration, the useEffect will run and update the state with the correct local time.
  return <time className="text-xs opacity-50">{displayTime || '--:--'}</time>;
}