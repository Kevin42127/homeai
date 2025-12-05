import { createApp } from 'vue'
import App from './App.vue'
import './styles/blackboard.css'

createApp(App).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker 註冊成功:', registration.scope)
      })
      .catch((error) => {
        console.log('Service Worker 註冊失敗:', error)
      })
  })
}

