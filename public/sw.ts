/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />

const CACHE_NAME = 'jp-converter-v1';
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/japanese.png'
];

self.addEventListener('install', (event) => {
  const e = event as unknown as ExtendableEvent;
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const e = event as unknown as FetchEvent;
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const e = event as unknown as ExtendableEvent;
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
}); 