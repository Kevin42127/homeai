<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <input
        v-model="inputText"
        @keyup.enter="handleSend"
        @keyup.esc="handleClear"
        type="text"
        placeholder="輸入您的問題..."
        class="message-input"
        :disabled="isLoading"
      />
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
import { ref } from 'vue'

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

function handleSend() {
  if (inputText.value.trim() && !props.isLoading) {
    emit('send', inputText.value.trim())
    inputText.value = ''
  }
}

function handleClear() {
  inputText.value = ''
  emit('clear')
}

function handleCancel() {
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
  padding: 14px 18px;
  background: #F8FAFC;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #1E293B;
  font-size: calc(var(--base-font-size, 16px) * 1.03);
  font-family: inherit;
  transition: all 0.3s ease;
  border-radius: 12px;
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
}

.send-button {
  padding: 14px 24px;
  background: #EC4899;
  border: 1px solid #BE185D;
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.send-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.send-button:active:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.send-button:hover:not(:disabled) {
  background: #DB2777;
  border-color: #9F1239;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
  transform: translateY(-2px) scale(1.05);
}

.send-button:active:not(:disabled) {
  background: #BE185D;
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
  position: relative;
  overflow: hidden;
}

.cancel-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cancel-button:active:not(:disabled)::before {
  width: 300px;
  height: 300px;
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
    gap: 10px;
  }

  .message-input {
    padding: 12px 16px;
    font-size: calc(var(--base-font-size, 16px) * 1);
  }

  .send-button,
  .cancel-button {
    padding: 12px 20px;
    min-width: 48px;
    min-height: 48px;
  }

  .send-button .material-symbols-outlined,
  .cancel-button .material-symbols-outlined {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .message-input-container {
    padding: 10px 12px;
  }

  .input-wrapper {
    gap: 8px;
  }

  .message-input {
    padding: 10px 14px;
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }

  .send-button,
  .cancel-button {
    padding: 10px 16px;
    min-width: 44px;
    min-height: 44px;
  }
}
</style>

