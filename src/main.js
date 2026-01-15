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
              if (newWorker.state === 'activated') {
                window.location.reload()
              }
            })
          }
        })

        setInterval(() => {
          registration.update()
        }, 60000)
      })
      .catch((error) => {
        console.error('Service Worker 註冊失敗:', error)
      })
  })
}

