const CACHE_NAME = "qrp-chatbot-v2"
const urlsToCache = [
  "/",
  "/login",
  "/chat",
  "/account",
  "/qrp-logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json",
]

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

  // Skip API calls for real-time functionality
  if (event.request.url.includes("/api/")) {
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
        .catch(() => {
          // If network fails, try to serve a fallback page
          if (event.request.destination === "document") {
            return caches.match("/login")
          }
        })
    }),
  )
})

// Background sync for offline messages (future enhancement)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered")
    // Here we could sync offline messages when connection is restored
  }
})

// Push notifications (future enhancement)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")
  // Handle push notifications here
})
