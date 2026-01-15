const CACHE_NAME = 'ai-teacher-v' + Date.now()

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)
  
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response
        })
        .catch(() => {
          return caches.match('/index.html')
        })
    )
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
    return
  }

  event.respondWith(fetch(event.request))
})
