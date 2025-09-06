const CACHE_NAME = 'manus-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png'
];

// Instalace Service Workeru: cache soubory
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Aktivace Service Workeru: případně smaž staré cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: obsluha požadavků z cache, jinak z internetu
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Pokud máme v cache, vrať ji
      if (response) {
        return response;
      }
      // Jinak stáhni z internetu
      return fetch(event.request);
    })
  );
});