'use client';

import { useEffect } from 'react';
import { saveSubscription } from '@/app/lib/actions/notifications';

// This function is used to convert the VAPID public key to a Uint8Array
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
            // Check if Service Worker and Push API are supported
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    // Register the service worker
                    const registration = await navigator.serviceWorker.register('/service-worker.js');
                    
                    // Wait for the worker to be active
                    await navigator.serviceWorker.ready;

                    // Check if a subscription already exists
                    const existingSubscription = await registration.pushManager.getSubscription();
                    if (existingSubscription) {
                        // Already subscribed, do nothing.
                        return;
                    }

                    // If not subscribed, ask for permission
                    const permission = await window.Notification.requestPermission();
                    if (permission !== 'granted') {
                        // User denied permission.
                        return;
                    }

                    // Subscribe the user
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
                    });

                    // Convert the subscription to a plain JSON object before sending
                    const subscriptionJSON = subscription.toJSON();

                    // Send the plain JSON object to your server to save it
                    await saveSubscription(subscriptionJSON);

                } catch (error) {
                    console.error('Error setting up push notifications:', error);
                }
            }
        };

        // We only want to run this for logged-in users.
        // A simple way is to check if a session-related element exists,
        // or rely on the server action to fail gracefully if not logged in.
        setupPushNotifications();
    }, []);

    // This component renders nothing.
    return null; 
}