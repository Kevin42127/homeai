<template>
  <Transition name="dialog">
    <div v-if="show" class="dialog-overlay" @click.self="handleCancel">
      <div class="dialog-container">
        <div class="dialog-header">
          <span class="material-symbols-outlined dialog-icon">warning</span>
          <h3 class="dialog-title">{{ title }}</h3>
        </div>
        <div class="dialog-content">
          <p>{{ message }}</p>
        </div>
        <div class="dialog-actions">
          <button @click="handleCancel" class="dialog-button cancel">
            <span class="material-symbols-outlined">close</span>
            <span>取消</span>
          </button>
          <button @click="handleConfirm" class="dialog-button confirm">
            <span class="material-symbols-outlined">check</span>
            <span>確認</span>
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
  },
  title: {
    type: String,
    default: '確認'
  },
  message: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
}

.dialog-container {
  background: #FFFFFF;
  border: 1px solid rgba(139, 92, 246, 0.3);
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(139, 92, 246, 0.15);
  border-radius: 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.dialog-icon {
  font-size: 28px;
  color: #F59E0B;
}

.dialog-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
}

.dialog-content {
  padding: 24px;
}

.dialog-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  justify-content: flex-end;
}

.dialog-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: #F8FAFC;
  color: #7C3AED;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.dialog-button:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.5);
  transform: translateY(-1px);
  color: #6D28D9;
}

.dialog-button.confirm {
  background: #EC4899;
  border-color: #BE185D;
  color: #FFFFFF;
}

.dialog-button.confirm:hover {
  background: #DB2777;
  border-color: #9F1239;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.dialog-button .material-symbols-outlined {
  font-size: 18px;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s;
}

.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition: transform 0.3s, opacity 0.3s;
}

.dialog-enter-from {
  opacity: 0;
}

.dialog-enter-from .dialog-container {
  transform: scale(0.9);
  opacity: 0;
}

.dialog-leave-to {
  opacity: 0;
}

.dialog-leave-to .dialog-container {
  transform: scale(0.9);
  opacity: 0;
}

@media (max-width: 768px) {
  .dialog-container {
    min-width: 90%;
    max-width: 90%;
    margin: 20px;
  }

  .dialog-header {
    padding: 18px 20px;
  }

  .dialog-icon {
    font-size: 24px;
  }

  .dialog-title {
    font-size: 18px;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-content p {
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }

  .dialog-actions {
    padding: 14px 20px;
    flex-direction: column;
    gap: 10px;
  }

  .dialog-button {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    min-height: 48px;
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }
}

@media (max-width: 480px) {
  .dialog-container {
    min-width: 95%;
    max-width: 95%;
    margin: 16px;
  }

  .dialog-header {
    padding: 16px 18px;
  }

  .dialog-title {
    font-size: 16px;
  }

  .dialog-content {
    padding: 18px;
  }

  .dialog-content p {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }

  .dialog-actions {
    padding: 12px 18px;
  }

  .dialog-button {
    padding: 10px 18px;
    min-height: 44px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}
</style>

