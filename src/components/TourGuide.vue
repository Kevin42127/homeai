<template>
  <div v-if="showTour" class="tour-overlay" @click="handleOverlayClick">
    <div class="tour-dialog" @click.stop>
      <div class="tour-header">
        <h2 class="tour-title">
          <span class="material-symbols-outlined">school</span>
          使用教學
        </h2>
        <button @click="closeTour" class="tour-close" title="關閉">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="tour-content">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          v-show="currentStep === index"
          class="tour-step"
        >
          <h3 class="tour-step-title">{{ step.title }}</h3>
          <p class="tour-description">{{ step.description }}</p>
        </div>
      </div>
      <div class="tour-footer">
        <div class="tour-progress">
          <span>{{ currentStep + 1 }} / {{ steps.length }}</span>
        </div>
        <div class="tour-actions">
          <button v-if="currentStep > 0" @click="prevStep" class="tour-button tour-button-secondary">
            上一步
          </button>
          <button v-if="currentStep < steps.length - 1" @click="nextStep" class="tour-button tour-button-primary">
            下一步
          </button>
          <button v-else @click="closeTour" class="tour-button tour-button-primary">
            開始使用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { markTourCompleted } from '../utils/storage.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const showTour = ref(false)
const currentStep = ref(0)

const steps = [
  {
    title: '歡迎使用 AI 老師！',
    description: '這是一個引導式教學的 AI 學習平台，我會先了解你的背景知識，然後引導你思考，而不是直接給答案。讓我們開始探索吧！'
  },
  {
    title: '輸入你的問題',
    description: '在這裡輸入任何學習相關的問題，我會根據你的理解程度提供適合的引導。你可以按 Enter 發送，或點擊發送按鈕。'
  },
  {
    title: '使用範例快速開始',
    description: '如果不確定要問什麼，可以點擊這些範例按鈕快速開始。這些範例涵蓋了各種學習主題，點擊後我會立即回應。'
  },
  {
    title: '設定功能',
    description: '點擊設定按鈕可以開啟設定面板，在這裡你可以調整字體大小（小、中、大），讓閱讀更舒適。'
  },
  {
    title: '清除對話記錄',
    description: '點擊清除按鈕可以清除所有對話記錄，重新開始新的學習對話。你的對話會自動保存在本地，不用擔心遺失。'
  },
  {
    title: '開始學習吧！',
    description: '現在你已經了解基本功能了。記住，我會用引導式教學幫助你學習，先了解你的想法，再提供適當的解釋。隨時可以提問！'
  }
]


function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function closeTour() {
  showTour.value = false
  markTourCompleted()
  emit('close')
}

function handleOverlayClick() {
  // 點擊遮罩層不關閉，必須點擊按鈕
}

const finalPosition = ref(null)


watch(() => props.show, (newVal) => {
  showTour.value = newVal
  if (newVal) {
    currentStep.value = 0
  }
})
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
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

.tour-dialog {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: dialogSlideIn 0.3s ease-out;
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

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
}

.tour-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  flex: 1;
}

.tour-title .material-symbols-outlined {
  font-size: 24px;
  color: #8B5CF6;
}

.tour-close {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.tour-close:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.tour-close .material-symbols-outlined {
  font-size: 20px;
}

.tour-content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
}

.tour-step {
  animation: stepFadeIn 0.3s ease-out;
}

@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tour-step-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 12px 0;
}

.tour-description {
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #E2E8F0;
}

.tour-progress {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

.tour-actions {
  display: flex;
  gap: 8px;
}

.tour-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tour-button-primary {
  background: #8B5CF6;
  color: #FFFFFF;
}

.tour-button-primary:hover {
  background: #7C3AED;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.tour-button-secondary {
  background: #F1F5F9;
  color: #475569;
}

.tour-button-secondary:hover {
  background: #E2E8F0;
}

@media (max-width: 768px) {
  .tour-dialog {
    width: 90%;
    max-width: 90%;
    margin: 20px;
  }

  .tour-header {
    padding: 18px 20px;
  }

  .tour-title {
    font-size: 18px;
  }

  .tour-title .material-symbols-outlined {
    font-size: 22px;
  }

  .tour-content {
    padding: 20px;
  }

  .tour-step-title {
    font-size: calc(var(--base-font-size, 16px) * 1.13);
  }

  .tour-description {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }

  .tour-footer {
    padding: 16px 20px;
  }

  .tour-button {
    padding: 10px 16px;
    min-height: 48px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}

@media (max-width: 480px) {
  .tour-dialog {
    width: 95%;
    max-width: 95%;
    margin: 16px;
  }

  .tour-header {
    padding: 16px 18px;
  }

  .tour-title {
    font-size: 16px;
  }

  .tour-title .material-symbols-outlined {
    font-size: 20px;
  }

  .tour-content {
    padding: 18px;
  }

  .tour-step-title {
    font-size: calc(var(--base-font-size, 16px) * 1.06);
  }

  .tour-description {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }

  .tour-footer {
    padding: 14px 18px;
    flex-direction: column;
    gap: 12px;
  }

  .tour-progress {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }

  .tour-actions {
    width: 100%;
    display: flex;
    gap: 8px;
  }

  .tour-button {
    flex: 1;
    padding: 8px 14px;
    min-height: 44px;
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }
}
</style>

