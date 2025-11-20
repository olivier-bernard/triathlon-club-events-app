'use client';

import { useEffect, useRef, useState } from "react";
import { useNotifications, UINotification } from './NotificationContext';
import { getNotifications, markNotificationsAsRead } from '@/app/lib/actions/notifications';
import { useRouter } from 'next/navigation';
import { getTranslations } from "@/app/lib/i18n";

const lang = typeof window !== "undefined" ? window.navigator.language.slice(0, 2) : "en";

// A simple Bell icon component
function BellIcon({ count }: { count: number }) {
  return (
    <div className="indicator">
      {count > 0 && <span className="indicator-item badge badge-secondary">{count > 9 ? '9+' : count}</span>}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
  );
}

export default function NotificationBell({ lang, onMessageClick }: { lang?: string, onMessageClick?: () => void }) {
  const { notifications, setNotifications } = useNotifications();
  const router = useRouter();
  const t = getTranslations(lang ?? "fr");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    getNotifications().then(fetched => setNotifications(fetched as UINotification[]));
  }, []);

  // Polling logic with visibility control
  useEffect(() => {
    function startPolling() {
      // Fetch immediately
      getNotifications().then(fetched => setNotifications(fetched as UINotification[]));
      // Start interval
      pollingRef.current = setInterval(() => {
        getNotifications().then(fetched => setNotifications(fetched as UINotification[]));
      }, 20000);
    }
    function stopPolling() {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Start polling if visible
    if (document.visibilityState === "visible") startPolling();

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Remove handleDropdownOpen, and instead handle per-message click
  const handleNotificationClick = async (notif: UINotification) => {
    // Mark only this notification as read
    await markNotificationsAsRead([notif.id]);
    // Remove it from the context
    setNotifications(notifications.filter(n => n.id !== notif.id));
    // Navigate to the event
    if (onMessageClick) onMessageClick(); 
    router.push(`/events/${notif.message.event.id}`);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((prev) => !prev)}
      >
        <BellIcon count={notifications.filter(n => n.isRead === false).length} />
      </div>
      {open && (
        <ul tabIndex={0} className="mt-3 z-dropdown p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80">
          {notifications.length > 0 ? (
            notifications.map(notif => {
              // Light green for unread notifications
              const isUnread = notif.isRead === false;
              return (
                <li key={notif.id}>
                  <button
                    className={`whitespace-normal w-full text-left ${isUnread
                      ? "bg-green-50"
                      : "bg-white text-black dark:bg-gray-900 dark:text-white"
                      }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="font-bold">{notif.message.event.activity}</div>
                    <div className="text-sm opacity-80">{notif.message.user.displayName}: "{notif.message.content.substring(0, 40)}..."</div>
                  </button>
                </li>
              );
            })
          ) : (
            <li className="p-2">{t.homePage.noNotifications || "No new notifications"}</li>
          )}
        </ul>
      )}
    </div>
  );
}