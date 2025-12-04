<template>
  <div v-if="show" class="settings-overlay" @click="handleOverlayClick">
    <div class="settings-dialog" @click.stop>
      <div class="settings-header">
        <h2 class="settings-title">
          <span class="material-symbols-outlined">settings</span>
          設定
        </h2>
        <button @click="handleClose" class="settings-close" title="關閉">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="settings-content">
        <div class="settings-section">
          <h3 class="settings-section-title">字體大小</h3>
          <div class="font-size-selector">
            <button 
              v-for="size in fontSizes" 
              :key="size.value"
              @click="handleFontSizeChange(size.value)"
              :class="['font-size-button', { active: fontSize === size.value }]"
              :title="size.label"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: String,
    default: 'medium'
  }
})

const emit = defineEmits(['close', 'font-size-change'])

const fontSizes = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' }
]

function handleFontSizeChange(size) {
  emit('font-size-change', size)
}

function handleClose() {
  emit('close')
}

function handleOverlayClick() {
  handleClose()
}
</script>

<style scoped>
.settings-overlay {
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

.settings-dialog {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
}

.settings-title .material-symbols-outlined {
  font-size: 24px;
  color: #8B5CF6;
}

.settings-close {
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

.settings-close:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.settings-close .material-symbols-outlined {
  font-size: 20px;
}

.settings-content {
  padding: 24px;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 16px 0;
}

.font-size-selector {
  display: flex;
  gap: 8px;
  background: #F1F5F9;
  border-radius: 8px;
  padding: 4px;
}

.font-size-button {
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: inherit;
}

.font-size-button:hover {
  background: #E2E8F0;
  color: #475569;
}

.font-size-button.active {
  background: #FFFFFF;
  color: #1E293B;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .settings-dialog {
    width: 90%;
    max-width: 90%;
    margin: 20px;
  }

  .settings-header {
    padding: 18px 20px;
  }

  .settings-title {
    font-size: 18px;
  }

  .settings-title .material-symbols-outlined {
    font-size: 22px;
  }

  .settings-content {
    padding: 20px;
  }

  .settings-section-title {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }

  .font-size-button {
    padding: 12px 14px;
    min-height: 48px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}

@media (max-width: 480px) {
  .settings-dialog {
    width: 95%;
    max-width: 95%;
    margin: 16px;
  }

  .settings-header {
    padding: 16px 18px;
  }

  .settings-title {
    font-size: 16px;
  }

  .settings-content {
    padding: 18px;
  }

  .font-size-selector {
    gap: 6px;
    padding: 3px;
  }

  .font-size-button {
    padding: 10px 12px;
    min-height: 44px;
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }
}
</style>

