// This is a placeholder service worker.
// For a full PWA, you would implement caching strategies here.
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // event.waitUntil(
  //   caches.open('v1').then((cache) => {
  //     return cache.addAll([
  //       '/',
  //       '/index.html',
  //       '/styles/main.css',
  //       '/scripts/main.js'
  //     ]);
  //   })
  // );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  // event.waitUntil(
  //   caches.keys().then((cacheNames) => {
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         if (cacheName !== 'v1') {
  //           return caches.delete(cacheName);
  //         }
  //       })
  //     );
  //   })
  // );
});

self.addEventListener('fetch', (event) => {
  // console.log('Fetching:', event.request.url);
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
