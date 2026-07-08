importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAvxBheNrUBMnze2V70qe7tYqSyPjEzlNk",
  authDomain: "cargodx-dispatch.firebaseapp.com",
  projectId: "cargodx-dispatch",
  storageBucket: "cargodx-dispatch.firebasestorage.app",
  messagingSenderId: "311558979095",
  appId: "1:311558979095:web:5bd697113aa48b91b06652"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
    actions: [
      { action: 'view', title: 'View Order' }
    ]
  });
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://timesheets.cargodx.ca')
  );
});
