// Simple service worker registration for PWA
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Register inline service worker
      const swCode = `
        const CACHE_NAME = 'workout-app-v1';

        self.addEventListener('install', (event) => {
          self.skipWaiting();
        });

        self.addEventListener('activate', (event) => {
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
          return self.clients.claim();
        });

        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request).then((response) => {
              return response || fetch(event.request).then((response) => {
                // Don't cache non-GET requests or non-ok responses
                if (event.request.method !== 'GET' || !response || response.status !== 200) {
                  return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseToCache);
                });

                return response;
              });
            })
          );
        });
      `;

      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
