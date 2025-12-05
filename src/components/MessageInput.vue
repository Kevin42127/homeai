<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <input
        v-model="inputText"
        @keyup.enter="handleSend"
        @keyup.esc="handleClear"
        type="text"
        :placeholder="isListening ? '正在聆聽...' : '輸入您的問題...'"
        class="message-input"
        :disabled="isLoading"
      />
      <button
        v-if="!isLoading && isSpeechSupported"
        @click="toggleSpeechRecognition"
        :class="['voice-button', { active: isListening }]"
        :title="isListening ? '停止語音輸入' : '開始語音輸入'"
      >
        <span class="material-symbols-outlined">{{ isListening ? 'mic' : 'mic_none' }}</span>
      </button>
      <button
        v-if="!isLoading"
        @click="handleSend"
        class="send-button"
        :disabled="!inputText.trim()"
      >
        <span class="material-symbols-outlined">send</span>
      </button>
      <button
        v-else-if="canCancel"
        @click="handleCancel"
        class="cancel-button"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  canCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'clear', 'cancel'])

const inputText = ref('')
const isListening = ref(false)
const isSpeechSupported = ref(false)
let recognition = null

onMounted(() => {
  checkSpeechSupport()
})

onUnmounted(() => {
  stopRecognition()
})

function checkSpeechSupport() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (SpeechRecognition) {
    isSpeechSupported.value = true
    recognition = new SpeechRecognition()
    recognition.lang = 'zh-TW'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onstart = () => {
      isListening.value = true
    }
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (inputText.value) {
        inputText.value += ' ' + transcript
      } else {
        inputText.value = transcript
      }
    }
    
    recognition.onerror = (event) => {
      console.error('語音識別錯誤:', event.error)
      isListening.value = false
      if (event.error === 'no-speech') {
        stopRecognition()
      } else if (event.error === 'not-allowed') {
        alert('請允許使用麥克風權限')
        stopRecognition()
      }
    }
    
    recognition.onend = () => {
      isListening.value = false
    }
  }
}

function toggleSpeechRecognition() {
  if (isListening.value) {
    stopRecognition()
  } else {
    startRecognition()
  }
}

function startRecognition() {
  if (recognition && !isListening.value) {
    try {
      recognition.start()
    } catch (error) {
      console.error('啟動語音識別失敗:', error)
    }
  }
}

function stopRecognition() {
  if (recognition && isListening.value) {
    recognition.stop()
    isListening.value = false
  }
}

function handleSend() {
  if (inputText.value.trim() && !props.isLoading) {
    stopRecognition()
    emit('send', inputText.value.trim())
    inputText.value = ''
  }
}

function handleClear() {
  stopRecognition()
  inputText.value = ''
  emit('clear')
}

function handleCancel() {
  stopRecognition()
  emit('cancel')
}
</script>

<style scoped>
.message-input-container {
  padding: 20px 0;
  background: #FFFFFF;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  width: 100%;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 0 20px;
}

.message-input {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  background: #F8FAFC;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #1E293B;
  font-size: calc(var(--base-font-size, 16px) * 1.03);
  font-family: inherit;
  transition: all 0.3s ease;
  border-radius: 12px;
  text-align: left !important;
  direction: ltr;
  -webkit-appearance: none;
  appearance: none;
}

.message-input:focus {
  outline: none;
  border-color: #8B5CF6;
}


.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-input::placeholder {
  color: #94A3B8;
  text-align: left;
}

/* iOS Safari 特定樣式 */
@supports (-webkit-touch-callout: none) {
  .message-input {
    -webkit-appearance: none;
    -webkit-border-radius: 12px;
    font-size: 16px !important;
  }
  
  .message-input:focus {
    -webkit-appearance: none;
  }
}

.voice-button {
  padding: 14px 20px;
  background: #6B7280;
  border: 1px solid #4B5563;
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
  border-radius: 12px;
  min-width: 48px;
  min-height: 48px;
}

.voice-button:hover:not(:disabled) {
  background: #4B5563;
  border-color: #374151;
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.5);
  transform: translateY(-2px) scale(1.05);
}

.voice-button:active:not(:disabled) {
  background: #374151;
  transform: translateY(0) scale(0.95);
}

.voice-button.active {
  background: #EF4444;
  border-color: #DC2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  animation: pulse 1.5s ease-in-out infinite;
}

.voice-button.active:hover {
  background: #DC2626;
  border-color: #B91C1C;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.voice-button .material-symbols-outlined {
  font-size: 20px;
}

.send-button {
  padding: 14px 24px;
  background: #3B82F6;
  border: 1px solid #2563EB;
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  border-radius: 12px;
}

.send-button:hover:not(:disabled) {
  background: #2563EB;
  border-color: #1D4ED8;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-2px) scale(1.05);
}

.send-button:active:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(0) scale(0.95);
}

.send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-button .material-symbols-outlined {
  font-size: 20px;
}

.cancel-button {
  padding: 14px 24px;
  background: #EF4444;
  border: 1px solid #DC2626;
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  border-radius: 12px;
}

.cancel-button:hover:not(:disabled) {
  background: #DC2626;
  border-color: #B91C1C;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
  transform: translateY(-2px) scale(1.05);
}

.cancel-button:active:not(:disabled) {
  background: #B91C1C;
  transform: translateY(0) scale(0.95);
}

.cancel-button .material-symbols-outlined {
  font-size: 20px;
}

@media (max-width: 768px) {
  .message-input-container {
    padding: 12px 16px;
  }

  .input-wrapper {
    gap: 8px;
    padding: 0 16px;
  }

  .message-input {
    padding: 12px 16px;
    font-size: 16px;
    min-height: 44px;
    line-height: 1.5;
    min-width: 0;
    text-align: left !important;
    direction: ltr;
  }

  .voice-button {
    padding: 12px;
    min-width: 44px;
    max-width: 44px;
    min-height: 44px;
    flex-shrink: 0;
  }

  .voice-button .material-symbols-outlined {
    font-size: 20px;
  }

  .send-button,
  .cancel-button {
    padding: 12px;
    min-width: 44px;
    max-width: 44px;
    min-height: 44px;
    flex-shrink: 0;
  }

  .send-button .material-symbols-outlined,
  .cancel-button .material-symbols-outlined {
    font-size: 20px;
  }
  
  /* iOS Safari 移動端優化 */
  @supports (-webkit-touch-callout: none) {
    .message-input {
      -webkit-appearance: none;
      font-size: 16px !important;
    }
  }
}

@media (max-width: 480px) {
  .message-input-container {
    padding: 10px 12px;
  }

  .input-wrapper {
    gap: 8px;
    padding: 0 12px;
  }

  .message-input {
    padding: 12px 14px;
    font-size: 16px;
    min-height: 44px;
    line-height: 1.5;
    min-width: 0;
    text-align: left !important;
    direction: ltr;
    -webkit-appearance: none;
    appearance: none;
  }

  .voice-button {
    padding: 10px;
    min-width: 44px;
    max-width: 44px;
    min-height: 44px;
    flex-shrink: 0;
  }

  .voice-button .material-symbols-outlined {
    font-size: 20px;
  }

  .send-button,
  .cancel-button {
    padding: 10px;
    min-width: 44px;
    max-width: 44px;
    min-height: 44px;
    flex-shrink: 0;
  }

  .send-button .material-symbols-outlined,
  .cancel-button .material-symbols-outlined {
    font-size: 20px;
  }
  
  /* iOS Safari 小螢幕優化 */
  @supports (-webkit-touch-callout: none) {
    .message-input {
      -webkit-appearance: none;
      font-size: 16px !important;
    }
  }
}
</style>

