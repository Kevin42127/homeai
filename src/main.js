import { createApp } from 'vue'
import App from './App.vue'
import './styles/blackboard.css'

createApp(App).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js'
    
    navigator.serviceWorker.register(swUrl, { scope: '/' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                window.location.reload()
              }
            })
          }
        })

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }

        setInterval(() => {
          registration.update()
        }, 10000)

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      })
      .catch((error) => {
        console.error('Service Worker 註冊失敗:', error)
      })
  })
}

