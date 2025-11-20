'use client';

import { useEffect } from 'react';
import { saveSubscription } from '@/app/lib/actions/notifications';

// This function is used to convert the VAPID public key to a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    // Fix padding
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);

    // Convert URL-safe base64 → normal base64
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Decode base64 using browser-safe atob()
    const raw = window.atob(base64);

    // Convert binary string to Uint8Array
    const output = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        output[i] = raw.charCodeAt(i);
    }

    return output;
}

export default function NotificationManager() {
    useEffect(() => {
        const setupPushNotifications = async () => {
            // Check if Service Worker and Push API are supported
            console.log('Setting up push notifications...');
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    // Register the service worker
                    console.log('Registering service worker...');
                    const registration = await navigator.serviceWorker.register('/service-worker.js');
                    console.log('Service Worker registered:', registration);
                    // Wait for the worker to be active
                    await navigator.serviceWorker.ready;
                    console.log('Service Worker is ready.');

                    // Check if a subscription already exists
                    const existingSubscription = await registration.pushManager.getSubscription();
                    if (existingSubscription) {
                        console.log('Push notifications are already set up for this user.');
                        // You could also send the subscription to your server if needed:
                        // await saveSubscription(existingSubscription);
                        return;
                    }

                    // If not subscribed, ask for permission
                    const permission = await window.Notification.requestPermission();
                    if (permission !== 'granted') {
                        // User denied permission.
                        return;
                    }

                    // Subscribe the user
                    const applicationServerKey = new Uint8Array(urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!));
                    console.log('Application Server Key:', applicationServerKey);
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: applicationServerKey,
                    });

                    // Convert the subscription to a plain JSON object before sending
                    const subscriptionJSON = subscription.toJSON();

                    if (
                        subscriptionJSON.endpoint &&
                        subscriptionJSON.keys &&
                        subscriptionJSON.keys.p256dh &&
                        subscriptionJSON.keys.auth
                    ) {
                        await saveSubscription({
                            endpoint: subscriptionJSON.endpoint,
                            keys: {
                                p256dh: subscriptionJSON.keys.p256dh,
                                auth: subscriptionJSON.keys.auth,
                            },
                        });
                    } else {
                        console.error('PushSubscription JSON is missing required fields:', subscriptionJSON);
                    }

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