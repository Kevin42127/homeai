import { createApp } from 'vue'
import App from './App.vue'
import './styles/blackboard.css'

createApp(App).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js'
    navigator.serviceWorker.register(swUrl, { scope: '/' })
      .then((registration) => {
        console.log('Service Worker 註冊成功:', registration.scope)
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('新的 Service Worker 已安裝')
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('Service Worker 註冊失敗:', error)
      })
  })
}

