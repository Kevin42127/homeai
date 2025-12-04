<template>
  <div class="chatroom-container" :data-font-size="currentFontSize">
    <div class="chatroom-header">
      <div class="header-content">
        <h1 class="title">
          <span class="material-symbols-outlined">school</span>
          AI老師
        </h1>
        <div class="header-actions">
          <button @click="handleShowSettings" class="action-button settings-button" title="設定">
            <span class="material-symbols-outlined">settings</span>
          </button>
          <button @click="handleClear" class="action-button" title="清除對話">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
    <MessageList :messages="messages" :isLoading="isLoading" :fontSize="currentFontSize" @example-click="handleExampleClick" />
    <MessageInput @send="handleSend" @clear="handleInputClear" :isLoading="isLoading" :canCancel="isLoading && abortController" @cancel="handleCancelRequest" />
    <div v-if="loadingProgress.show" class="loading-progress">
      <div class="progress-content">
        <span class="material-symbols-outlined progress-icon">auto_awesome</span>
        <div class="progress-text">
          <div class="progress-main">{{ loadingProgress.text }}</div>
          <div v-if="loadingProgress.estimatedTime" class="progress-time">{{ loadingProgress.estimatedTime }}</div>
        </div>
      </div>
    </div>
    <Toast :show="notification.show" :message="notification.message" :type="notification.type" />
    <ConfirmDialog
      :show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      @confirm="handleConfirmDialog"
      @cancel="handleCancelDialog"
    />
    <SettingsDialog :show="showSettings" :fontSize="currentFontSize" @close="handleSettingsClose" @font-size-change="handleFontSizeChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import Toast from './Toast.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import SettingsDialog from './SettingsDialog.vue'
import { sendMessageStream, getDefaultModel } from '../services/groqApi.js'
import {
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
  saveFontSize,
  loadFontSize
} from '../utils/storage.js'

const props = defineProps({
  fontSize: {
    type: String,
    default: () => loadFontSize()
  }
})

const emit = defineEmits(['font-size-change'])

const messages = ref([])
const isLoading = ref(false)
const loadingProgress = ref({ show: false, text: 'AI 正在思考...', estimatedTime: null })
const selectedModel = ref(getDefaultModel())
const notification = ref({ show: false, message: '', type: 'info' })
const confirmDialog = ref({ show: false, title: '', message: '', callback: null })
const abortController = ref(null)
const showSettings = ref(false)

const currentFontSize = computed(() => props.fontSize || loadFontSize())

function showNotification(message, type = 'info') {
  notification.value = {
    show: true,
    message,
    type
  }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

function showConfirmDialog(title, message, callback) {
  confirmDialog.value = {
    show: true,
    title,
    message,
    callback
  }
}

function handleConfirmDialog() {
  if (confirmDialog.value.callback) {
    confirmDialog.value.callback()
  }
  confirmDialog.value.show = false
  confirmDialog.value.callback = null
}

function handleCancelDialog() {
  confirmDialog.value.show = false
  confirmDialog.value.callback = null
}

async function handleSend(text) {
  if (!text.trim()) return

  if (isLoading.value && abortController.value) {
    abortController.value.abort()
  }

  const userMessage = {
    role: 'user',
    content: text
  }

  messages.value.push(userMessage)
  saveChatHistory(messages.value)

  const assistantMessage = {
    role: 'assistant',
    content: '',
    isStreaming: true
  }

  messages.value.push(assistantMessage)
  isLoading.value = true
  loadingProgress.value = { show: true, text: 'AI 正在思考...', estimatedTime: '約 3-5 秒' }

  abortController.value = new AbortController()
  const startTime = Date.now()

  try {
    const conversationMessages = messages.value
      .filter(msg => !msg.isStreaming)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    let fullContent = ''

    await sendMessageStream(
      conversationMessages,
      selectedModel.value,
      (chunk) => {
        fullContent += chunk
        const assistantIndex = messages.value.length - 1
        if (messages.value[assistantIndex] && messages.value[assistantIndex].isStreaming) {
          messages.value[assistantIndex].content = fullContent
        }
      },
      abortController.value.signal
    )

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1)
    loadingProgress.value = { show: false, text: '', estimatedTime: null }

    const assistantIndex = messages.value.length - 1
    if (messages.value[assistantIndex]) {
      messages.value[assistantIndex].isStreaming = false
      messages.value[assistantIndex].content = fullContent
    }

    saveChatHistory(messages.value)
  } catch (error) {
    if (error.message !== '請求已取消') {
      showNotification(`錯誤: ${error.message}`, 'error')
      console.error('發送訊息失敗:', error)
    }
    
    const assistantIndex = messages.value.length - 1
    if (messages.value[assistantIndex] && messages.value[assistantIndex].isStreaming) {
      messages.value.splice(assistantIndex, 1)
    }
  } finally {
    isLoading.value = false
    loadingProgress.value = { show: false, text: '', estimatedTime: null }
    abortController.value = null
  }
}

function handleClear() {
  showConfirmDialog('確認清除', '確定要清除所有對話記錄嗎？', () => {
    messages.value = []
    clearChatHistory()
    showNotification('對話記錄已清除', 'success')
  })
}

function handleInputClear() {
}

function handleCancelRequest() {
  if (abortController.value) {
    abortController.value.abort()
    isLoading.value = false
    loadingProgress.value = { show: false, text: '', estimatedTime: null }
    const assistantIndex = messages.value.length - 1
    if (messages.value[assistantIndex] && messages.value[assistantIndex].isStreaming) {
      messages.value.splice(assistantIndex, 1)
    }
    showNotification('請求已取消', 'info')
  }
}

async function handleExampleClick(example) {
  await handleSend(example)
}

function handleShowSettings() {
  showSettings.value = true
}

function handleSettingsClose() {
  showSettings.value = false
}

function handleFontSizeChange(size) {
  saveFontSize(size)
  emit('font-size-change', size)
}

onMounted(() => {
  const savedHistory = loadChatHistory()
  if (savedHistory && savedHistory.length > 0) {
    messages.value = savedHistory.map(msg => ({
      ...msg,
      isStreaming: false
    }))
  }
})
</script>

<style scoped>
.chatroom-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chatroom-header {
  background: #FFFFFF;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  padding: 16px 0;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.header-content {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-weight: 600;
  color: #1E293B;
}

.chatroom-container[data-font-size="small"] .title {
  font-size: 22px;
}

.chatroom-container[data-font-size="medium"] .title {
  font-size: 24px;
}

.chatroom-container[data-font-size="large"] .title {
  font-size: 26px;
}

.title .material-symbols-outlined {
  font-size: 28px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-button {
  padding: 8px 12px;
  background: #D1FAE5;
  border: 1px solid #6EE7B7;
  color: #059669;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #A7F3D0;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-button:active::before {
  width: 200px;
  height: 200px;
}

.action-button:hover {
  background: #059669;
  border-color: #047857;
  color: #FFFFFF;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);
}

.action-button:hover .material-symbols-outlined {
  color: #FFFFFF;
}

.action-button:active {
  transform: translateY(0) scale(0.95);
}

.action-button .material-symbols-outlined {
  font-size: 20px;
}

.action-button.settings-button {
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  color: #D97706;
}

.action-button.settings-button::before {
  background: #FDE68A;
}

.action-button.settings-button:hover {
  background: #F59E0B;
  border-color: #D97706;
  color: #FFFFFF;
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.25);
}

.action-button.settings-button:hover .material-symbols-outlined {
  color: #FFFFFF;
}

.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
  pointer-events: none;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.progress-icon {
  font-size: 24px;
  color: #8B5CF6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.progress-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-main {
  font-size: calc(var(--base-font-size, 16px) * 0.97);
  font-weight: 500;
  color: #1E293B;
}

.progress-time {
  font-size: calc(var(--base-font-size, 16px) * 0.77);
  color: #64748B;
}

@media (max-width: 768px) {
  .chatroom-header {
    padding: 12px 0;
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .title {
    font-size: 18px;
  }

  .title .material-symbols-outlined {
    font-size: 22px;
  }

  .header-actions {
    position: absolute;
    top: 12px;
    right: 16px;
    gap: 8px;
  }

  .action-button {
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
  }

  .action-button .material-symbols-outlined {
    font-size: 22px;
  }

  .progress-content {
    padding: 12px 20px;
    max-width: 90%;
  }

  .progress-main {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }

  .title {
    font-size: 16px;
  }

  .title .material-symbols-outlined {
    font-size: 20px;
  }

  .header-actions {
    top: 10px;
    right: 12px;
    gap: 6px;
  }

  .action-button {
    padding: 8px;
    min-width: 40px;
    min-height: 40px;
  }
}
</style>

