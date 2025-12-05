<template>
  <Transition name="dialog">
    <div v-if="show" class="welcome-overlay" @click.self="handleClose">
      <div class="welcome-dialog" @click.stop>
        <div class="welcome-header">
          <span class="material-symbols-outlined welcome-icon">school</span>
          <h2 class="welcome-title">歡迎使用 AI 老師！</h2>
        </div>
        <div class="welcome-content">
          <p class="welcome-message">
            我是你的 AI 老師，採用引導式教學方式，<br>會先了解您的想法，再提供適當的解釋和補充。
          </p>
          <div class="welcome-features">
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">lightbulb</span>
              <span class="feature-text">引導式教學，幫助您思考</span>
            </div>
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">mic</span>
              <span class="feature-text">支援語音輸入，更方便</span>
            </div>
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">settings</span>
              <span class="feature-text">可調整字體大小，閱讀更舒適</span>
            </div>
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">download</span>
              <span class="feature-text">可安裝到手機，隨時使用</span>
            </div>
          </div>
          <div class="welcome-install-section">
            <h4 class="install-section-title">
              <span class="material-symbols-outlined">phone_android</span>
              手機安裝方法
            </h4>
            <div class="install-instructions">
              <div class="install-instruction-item">
                <div class="instruction-platform">iOS (Safari)</div>
                <div class="instruction-steps">
                  <div class="instruction-step">1. 點擊底部工具列的「分享」按鈕</div>
                  <div class="instruction-step">2. 選擇「加入主畫面」</div>
                  <div class="instruction-step">3. 點擊「加入」完成安裝</div>
                </div>
              </div>
              <div class="install-instruction-item">
                <div class="instruction-platform">Android (Chrome)</div>
                <div class="instruction-steps">
                  <div class="instruction-step">1. 點擊瀏覽器選單（三個點）</div>
                  <div class="instruction-step">2. 選擇「安裝應用程式」或「加到主畫面」</div>
                  <div class="instruction-step">3. 確認安裝即可</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="welcome-actions">
          <button @click="handleClose" class="welcome-button">
            <span>開始使用</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.welcome-overlay {
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

.welcome-dialog {
  background: #FFFFFF;
  border: 1px solid rgba(139, 92, 246, 0.3);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  animation: dialogSlideIn 0.3s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.welcome-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px 24px;
  background: #8B5CF6;
  color: #FFFFFF;
}

.welcome-icon {
  font-size: 48px;
  color: #FFFFFF;
}

.welcome-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
}

.welcome-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.welcome-message {
  font-size: calc(var(--base-font-size, 16px) * 1);
  color: #1E293B;
  line-height: 1.6;
  margin: 0 0 24px 0;
  text-align: center;
}

.welcome-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
}

.feature-icon {
  font-size: 24px;
  color: #8B5CF6;
}

.feature-text {
  font-size: calc(var(--base-font-size, 16px) * 0.94);
  color: #1E293B;
  flex: 1;
}

.welcome-install-section {
  margin-top: 24px;
  padding: 16px;
  background: #F8FAFC;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
}

.install-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: calc(var(--base-font-size, 16px) * 1);
  font-weight: 600;
  color: #1E293B;
}

.install-section-title .material-symbols-outlined {
  font-size: 20px;
  color: #8B5CF6;
}

.install-instructions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.install-instruction-item {
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
}

.instruction-platform {
  font-size: calc(var(--base-font-size, 16px) * 0.88);
  font-weight: 600;
  color: #8B5CF6;
  margin-bottom: 8px;
}

.instruction-steps {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.instruction-step {
  font-size: calc(var(--base-font-size, 16px) * 0.81);
  color: #475569;
  line-height: 1.5;
  padding-left: 8px;
}

.welcome-actions {
  padding: 20px 24px 24px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  justify-content: center;
}

.welcome-button {
  padding: 12px 32px;
  background: #8B5CF6;
  border: 1px solid #7C3AED;
  color: #FFFFFF;
  font-size: calc(var(--base-font-size, 16px) * 1);
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  min-width: 120px;
  min-height: 44px;
}

.welcome-button:hover {
  background: #7C3AED;
  border-color: #6D28D9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.welcome-button:active {
  background: #6D28D9;
  transform: translateY(0);
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
  .welcome-dialog {
    width: 95%;
    max-width: 95%;
    margin: 20px;
    max-height: 85vh;
  }

  .welcome-header {
    padding: 28px 20px 20px;
  }

  .welcome-icon {
    font-size: 40px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-content {
    padding: 20px;
  }

  .welcome-message {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
    margin-bottom: 20px;
  }

  .feature-item {
    padding: 10px;
  }

  .feature-icon {
    font-size: 22px;
  }

  .feature-text {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }

  .welcome-actions {
    padding: 16px 20px 20px;
  }

  .welcome-button {
    padding: 12px 28px;
    min-width: 100px;
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }
}

@media (max-width: 480px) {
  .welcome-dialog {
    width: 95%;
    max-width: 95%;
    margin: 16px;
    max-height: 85vh;
  }

  .welcome-header {
    padding: 24px 16px 16px;
  }

  .welcome-icon {
    font-size: 36px;
  }

  .welcome-title {
    font-size: 18px;
  }

  .welcome-content {
    padding: 16px;
  }

  .welcome-message {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
    margin-bottom: 16px;
  }

  .welcome-features {
    gap: 12px;
  }

  .welcome-install-section {
    margin-top: 20px;
    padding: 14px;
  }

  .install-section-title {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
    margin-bottom: 12px;
  }

  .install-instructions {
    gap: 12px;
  }

  .install-instruction-item {
    padding: 10px;
  }

  .instruction-platform {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
    margin-bottom: 6px;
  }

  .instruction-step {
    font-size: calc(var(--base-font-size, 16px) * 0.75);
  }

  .feature-item {
    padding: 8px;
  }

  .feature-icon {
    font-size: 20px;
  }

  .feature-text {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }

  .welcome-actions {
    padding: 12px 16px 16px;
  }

  .welcome-button {
    padding: 10px 24px;
    min-width: 90px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}
</style>

