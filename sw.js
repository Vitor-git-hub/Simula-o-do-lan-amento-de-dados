const CACHE_NAME = 'platonic-dice-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy: Cache First for CDNs (Tailwind, ESM, Fonts)
  // These libraries are versioned or static, so we can aggressively cache them.
  if (
    url.hostname.includes('esm.sh') || 
    url.hostname.includes('tailwindcss.com') || 
    url.hostname.includes('googleapis.com') || 
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('githubusercontent.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          // Check for valid response. Note: Opaque responses (type 'opaque') 
          // are common with CDNs and no-cors mode, we cache them too.
          if (!response || (response.status !== 200 && response.type !== 'opaque')) {
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
    return;
  }

  // Strategy: Network First for local app files (HTML, JS) to ensure updates are seen
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});