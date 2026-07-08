// ── DBX Timesheet Service Worker ──
// Strategy: network-first for HTML/navigation, cache-first for static assets.
// On deploy, Vite generates new content-hashed filenames so updates are always served.

const CACHE_NAME = "dbx-timesheet-v1";

// On install — skip waiting so new SW activates immediately
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// On activate — purge old caches and claim all clients
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle GET requests from our own origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Navigation (HTML pages) — network first, fallback to cache
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (JS, CSS, images) — cache first, then network
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
