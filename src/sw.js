// Service worker

// Cache name, increase during updates
const PRECACHE = 'v2';

// Pre cached URLS
const PRECACHE_URLS = [
  'index.html',
  './', // Alias index.html
  'info.html',
  'mvp.css',
  'crop-and-resize.js',
  'favicon.ico'
];

// Preload when istall is done
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// Delete old ones if needed
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Return from cache if we have cached files
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Got hit
        if (response) {
          return response;
        }

        // Fetch from internet
        return fetch(event.request);
      }
    )
  );
});