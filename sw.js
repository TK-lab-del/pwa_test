const VERSION = "v1.0.3";
const CACHE_NAME = `period-tracker-${VERSION}`;
const BASE_PATH = "/pwa_test";

const APP_STATIC_RESOURCES = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/style.css`,
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/cycletracker.json`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/icons/circle.svg`,
  `${BASE_PATH}/icons/tire.svg`,
  `${BASE_PATH}/icons/wheel.svg`,
  `${BASE_PATH}/icons/web-app-manifest-192x192.png`,
  `${BASE_PATH}/icons/web-app-manifest-512x512.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return undefined;
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(`${BASE_PATH}/`) || cache.match(`${BASE_PATH}/index.html`);
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })()
  );
});
