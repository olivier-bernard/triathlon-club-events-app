'use client';
import { useEffect } from 'react';
import { saveSubscription } from '@/app/lib/actions/notifications';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function NotificationManager() {
    useEffect(() => {
        const setupPushNotifications = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.register('/service-worker.js');

                // Check if already subscribed
                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) return;

                // Ask for permission and subscribe
                const permission = await window.Notification.requestPermission();
                if (permission !== 'granted') return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
                });

                // Send the subscription to your server to save it
                await saveSubscription(subscription);
            }
        };
        setupPushNotifications();
    }, []);

    return null; 
}