"use client";

export default function ChatLocalTime({ date, timeFormat }: { date: string, timeFormat: boolean }) {
  const options: Intl.DateTimeFormatOptions = timeFormat
    ? { hour: '2-digit', minute: '2-digit', hour12: false }
    : { hour: '2-digit', minute: '2-digit', hour12: true };
  const localTime = new Date(date).toLocaleTimeString([], options);
  return <time className="text-xs opacity-50">{localTime}</time>;
}