"use client";

export default function ChatLocalTime({ date }: { date: string }) {
  const localTime = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <time className="text-xs opacity-50" title={localTime}>
      {localTime}
    </time>
  );
}