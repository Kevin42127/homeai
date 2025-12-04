<template>
  <Transition name="toast">
    <div v-if="show" class="toast" :class="type">
      <span class="material-symbols-outlined">{{ icon }}</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info'
  }
})

const icon = computed(() => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  }
  return icons[props.type] || 'info'
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  background: #FFFFFF;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  min-width: 280px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(139, 92, 246, 0.15);
  border-radius: 12px;
}

.toast.success {
  border-color: rgba(34, 197, 94, 0.5);
  background: #FFFFFF;
}

.toast.error {
  border-color: rgba(239, 68, 68, 0.5);
  background: #FFFFFF;
}

.toast.info {
  border-color: rgba(59, 130, 246, 0.5);
  background: #FFFFFF;
}

.toast .material-symbols-outlined {
  font-size: 24px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.toast-enter-active {
  animation: toastSlideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: toastSlideOut 0.3s ease-in;
}

@keyframes toastSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastSlideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .toast {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    padding: 14px 20px;
  }

  .toast .material-symbols-outlined {
    font-size: 22px;
  }

  .toast-message {
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}

@media (max-width: 480px) {
  .toast {
    top: 12px;
    right: 12px;
    left: 12px;
    padding: 12px 16px;
  }

  .toast .material-symbols-outlined {
    font-size: 20px;
  }

  .toast-message {
    font-size: calc(var(--base-font-size, 16px) * 0.81);
  }
}
</style>

