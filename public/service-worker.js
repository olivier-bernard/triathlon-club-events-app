self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/bell.png', // Add an icon to your public folder
    badge: '/bell-notification.png', // A smaller icon for the notification bar
    data: {
      url: data.url // URL to open when notification is clicked
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});