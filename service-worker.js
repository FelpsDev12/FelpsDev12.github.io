self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  const title = data.title || 'Nova mensagem 💌';
  const options = {
    body: data.body || 'Você recebeu uma nova mensagem no Loveable 💖',
    icon: '/assets/icon.png',
    badge: '/assets/icon.png',
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || '/'));
});
