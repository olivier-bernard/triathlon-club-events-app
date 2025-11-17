'use client';

import { useEffect } from 'react';
import { useNotifications, UINotification } from './NotificationContext';
import { getUnreadNotifications, markNotificationsAsRead } from '@/app/lib/actions/notifications';
import Link from 'next/link';
import { usePolling } from "@/app/hooks/usePolling";
import { useRouter } from 'next/navigation';

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

export default function NotificationBell() {
  const { notifications, setNotifications } = useNotifications();
  const router = useRouter();

  usePolling(() => {
    getUnreadNotifications().then(fetched => setNotifications(fetched as UINotification[]));
  }, 60000);

  // Remove handleDropdownOpen, and instead handle per-message click
  const handleNotificationClick = async (notif: UINotification) => {
    // Mark only this notification as read
    await markNotificationsAsRead([notif.id]);
    // Remove it from the context
    setNotifications(notifications.filter(n => n.id !== notif.id));
    // Navigate to the event
    router.push(`/events/${notif.message.event.id}`);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <BellIcon count={notifications.length} />
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <li key={notif.id}>
              <button
                className="whitespace-normal w-full text-left"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="font-bold">{notif.message.event.activity}</div>
                <div className="text-sm opacity-80">{notif.message.user.displayName}: "{notif.message.content.substring(0, 40)}..."</div>
              </button>
            </li>
          ))
        ) : (
          <li className="p-2">No new notifications</li>
        )}
      </ul>
    </div>
  );
}