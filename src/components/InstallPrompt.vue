<template>
  <Transition name="dialog">
    <div v-if="show" class="install-prompt-overlay" @click.self="handleDismiss">
      <div class="install-prompt-dialog" @click.stop>
        <div class="install-prompt-header">
          <span class="material-symbols-outlined install-icon">download</span>
          <h3 class="install-prompt-title">安裝 AI 老師</h3>
        </div>
        <div class="install-prompt-content">
          <p class="install-prompt-message">
            將 AI 老師安裝到您的裝置，享受更快速、更方便的學習體驗。
          </p>
          <div class="install-prompt-features">
            <div class="install-feature-item">
              <span class="material-symbols-outlined feature-icon">speed</span>
              <span class="feature-text">快速啟動</span>
            </div>
            <div class="install-feature-item">
              <span class="material-symbols-outlined feature-icon">offline_pin</span>
              <span class="feature-text">離線使用</span>
            </div>
            <div class="install-feature-item">
              <span class="material-symbols-outlined feature-icon">home</span>
              <span class="feature-text">主畫面快捷方式</span>
            </div>
          </div>
        </div>
        <div class="install-prompt-actions">
          <button @click="handleDismiss" class="install-button cancel">
            <span>稍後再說</span>
          </button>
          <button @click="handleInstall" class="install-button install">
            <span class="material-symbols-outlined">download</span>
            <span>安裝</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  deferredPrompt: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'install'])

function handleInstall() {
  if (props.deferredPrompt) {
    props.deferredPrompt.prompt()
    props.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        emit('install')
      }
      emit('close')
    })
  } else {
    emit('close')
  }
}

function handleDismiss() {
  emit('close')
}
</script>

<style scoped>
.install-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20000;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.install-prompt-dialog {
  background: #FFFFFF;
  border: 1px solid rgba(139, 92, 246, 0.3);
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  animation: dialogSlideIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.install-prompt-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 20px;
  background: #8B5CF6;
  color: #FFFFFF;
}

.install-icon {
  font-size: 40px;
  color: #FFFFFF;
}

.install-prompt-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
}

.install-prompt-content {
  padding: 20px 24px;
}

.install-prompt-message {
  font-size: calc(var(--base-font-size, 16px) * 0.94);
  color: #1E293B;
  line-height: 1.6;
  margin: 0 0 20px 0;
  text-align: center;
}

.install-prompt-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.install-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #F8FAFC;
  border-radius: 8px;
}

.feature-icon {
  font-size: 20px;
  color: #8B5CF6;
}

.feature-text {
  font-size: calc(var(--base-font-size, 16px) * 0.88);
  color: #1E293B;
  flex: 1;
}

.install-prompt-actions {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.install-button {
  padding: 10px 20px;
  font-size: calc(var(--base-font-size, 16px) * 0.94);
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid;
}

.install-button.cancel {
  background: #F1F5F9;
  border-color: #E2E8F0;
  color: #64748B;
}

.install-button.cancel:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
  color: #475569;
}

.install-button.install {
  background: #8B5CF6;
  border-color: #7C3AED;
  color: #FFFFFF;
}

.install-button.install:hover {
  background: #7C3AED;
  border-color: #6D28D9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.install-button.install:active {
  background: #6D28D9;
  transform: translateY(0);
}

.install-button .material-symbols-outlined {
  font-size: 18px;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .install-prompt-dialog {
    width: 95%;
    margin: 20px;
  }

  .install-prompt-header {
    padding: 20px 20px 16px;
  }

  .install-icon {
    font-size: 36px;
  }

  .install-prompt-title {
    font-size: 18px;
  }

  .install-prompt-content {
    padding: 16px 20px;
  }

  .install-prompt-message {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
    margin-bottom: 16px;
  }

  .install-prompt-features {
    gap: 10px;
  }

  .install-feature-item {
    padding: 8px;
  }

  .feature-icon {
    font-size: 18px;
  }

  .feature-text {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }

  .install-prompt-actions {
    padding: 12px 20px 16px;
    flex-direction: column;
  }

  .install-button {
    width: 100%;
    padding: 12px 20px;
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }
}

@media (max-width: 480px) {
  .install-prompt-dialog {
    width: 95%;
    margin: 16px;
  }

  .install-prompt-header {
    padding: 16px 16px 12px;
  }

  .install-icon {
    font-size: 32px;
  }

  .install-prompt-title {
    font-size: 16px;
  }

  .install-prompt-content {
    padding: 12px 16px;
  }

  .install-prompt-message {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
    margin-bottom: 12px;
  }

  .install-prompt-actions {
    padding: 10px 16px 12px;
  }

  .install-button {
    padding: 10px 16px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}
</style>

