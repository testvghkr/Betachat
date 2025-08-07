const CACHE_NAME = "qrp-v2.0.0"
const urlsToCache = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files")
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log("Service Worker: Installed successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.log("Service Worker: Cache failed", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated successfully")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip API calls and external resources
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("chrome-extension://") ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        console.log("Service Worker: Serving from cache:", event.request.url)
        return response
      }

      // Otherwise fetch from network
      console.log("Service Worker: Fetching from network:", event.request.url)
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Add to cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.log("Service Worker: Fetch failed:", error)
          // Return a basic offline page if available
          return caches.match("/")
        })
    }),
  )
})
