const CACHE_NAME = 'ai-teacher-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/index.html'
        ]).catch((error) => {
          console.log('快取失敗:', error)
        })
      })
  )
  self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200) {
              return response
            }
            if (event.request.url.startsWith('http') && !event.request.url.includes('chrome-extension')) {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
            }
            return response
          }
        ).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html')
          }
        })
      )
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

