'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a notification for the UI
export type UINotification = {
  id: string;
  message: {
    id: string;
    content: string;
    user: {
      displayName: string | null;
    };
    event: {
      id: string;
      activity: string;
    };
  };
};

interface NotificationContextType {
  notifications: UINotification[];
  unreadCount: number;
  setNotifications: (notifications: UINotification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const unreadCount = notifications.length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}