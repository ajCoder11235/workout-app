// A new cache name to force an update.
const CACHE_NAME = 'workout-planner-v2';

// The full paths to the files, including the repository name.
const urlsToCache = [
  '/workout-app/',
  '/workout-app/index.html',
  '/workout-app/manifest.json',
  '/workout-app/icons/icon-192x192.png',
  '/workout-app/icons/icon-512x512.png'
];

// Install event: opens the cache and adds the core files.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching new files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force the new service worker to become active.
});

// Fetch event: serves cached content when offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache.
        if (response) {
          return response;
        }
        // Not in cache - fetch from network.
        return fetch(event.request);
      })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Keep the new cache.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
