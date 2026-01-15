const CACHE_VERSION = 'v' + Date.now()
const CACHE_NAME = 'ai-teacher-' + CACHE_VERSION

self.addEventListener('install', (event) => {
  self.skipWaiting()
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
    }).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)
  const requestUrl = event.request.url
  
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(requestUrl, { cache: 'no-store' })
        .then((response) => {
          return response
        })
        .catch(() => {
          return caches.match('/index.html')
        })
    )
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(
      fetch(requestUrl, { cache: 'no-cache' })
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
