<template>
  <div class="message-list" ref="messageListRef" :data-font-size="fontSize">
    <div v-if="messages.length === 0" class="empty-state">
      <span class="material-symbols-outlined">school</span>
      <p>開始與 AI 老師對話吧！</p>
      <div class="example-buttons">
        <button
          v-for="(example, index) in examples"
          :key="index"
          @click="handleExampleClick(example)"
          class="example-button"
          :disabled="isLoading"
        >
          {{ example }}
        </button>
      </div>
    </div>
    <TransitionGroup name="message" tag="div">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-avatar" :class="message.role">
          <span class="material-symbols-outlined">
            {{ message.role === 'assistant' ? 'robot_2' : 'person' }}
          </span>
        </div>
        <div class="message-content">
          <div class="message-text" :class="{ 'typing-effect': message.isStreaming }">{{ message.content }}</div>
        </div>
      </div>
    </TransitionGroup>
    <div v-if="isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && !messages[messages.length - 1]?.isStreaming" class="skeleton-loader">
      <div class="skeleton-message assistant">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-content">
          <div class="skeleton-line" style="width: 85%"></div>
          <div class="skeleton-line" style="width: 70%"></div>
          <div class="skeleton-line" style="width: 60%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: String,
    default: 'medium'
  }
})

const emit = defineEmits(['example-click'])

const messageListRef = ref(null)

const examples = [
  '解釋量子物理的基本概念',
  '如何學習程式設計？',
  '說明相對論的理論基礎',
  '推薦學習方法'
]

function handleExampleClick(example) {
  if (!props.isLoading) {
    emit('example-click', example)
  }
}

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
})

watch(() => props.isLoading, () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #F8FAFC;
}

@media (max-width: 768px) {
  .message-list {
    padding: 16px 12px;
    gap: 16px;
  }

  .message {
    margin-bottom: 16px;
  }

  .message-content {
    max-width: 85%;
    padding: 12px 16px;
  }

  .message-avatar {
    width: 36px;
    height: 36px;
  }

  .empty-state .material-symbols-outlined {
    font-size: 64px;
  }

  .empty-state p {
    font-size: calc(var(--base-font-size, 16px) * 1.13);
    margin: 0 0 32px 0;
  }

  .example-buttons {
    max-width: 100%;
    gap: 10px;
  }

  .example-button {
    padding: 12px 16px;
    font-size: calc(var(--base-font-size, 16px) * 0.94);
  }
}

@media (max-width: 480px) {
  .message-list {
    padding: 12px 8px;
    gap: 12px;
  }

  .message {
    margin-bottom: 12px;
    gap: 8px;
  }

  .message-content {
    max-width: 90%;
    padding: 10px 14px;
  }

  .message-avatar {
    width: 32px;
    height: 32px;
  }

  .empty-state .material-symbols-outlined {
    font-size: 56px;
  }

  .empty-state p {
    font-size: calc(var(--base-font-size, 16px) * 1.06);
    margin: 0 0 24px 0;
  }

  .example-button {
    padding: 10px 14px;
    font-size: calc(var(--base-font-size, 16px) * 0.88);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748B;
  animation: fadeIn 0.6s ease-in;
}

.empty-state .material-symbols-outlined {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
  color: #8B5CF6;
}

.empty-state p {
  font-size: calc(var(--base-font-size, 16px) * 1.29);
  font-weight: 500;
  margin: 0 0 40px 0;
  color: #475569;
}

.example-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  align-items: center;
}

.example-button {
  width: 100%;
  padding: 14px 20px;
  font-size: calc(var(--base-font-size, 16px) * 0.97);
  font-weight: 500;
  color: #7C3AED;
  border: 3px solid #8B5CF6;
  cursor: pointer;
  position: relative;
  background-color: transparent;
  text-decoration: none;
  overflow: hidden;
  z-index: 1;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  letter-spacing: 0.3px;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.example-button::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  background-color: #8B5CF6;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.3s;
  z-index: -1;
  border-radius: 10px;
}

.example-button:hover:not(:disabled)::before {
  transform: translate(-50%, -50%) scale(1);
}

.example-button:hover:not(:disabled) {
  color: #FFFFFF;
}

.example-button:active:not(:disabled) {
  outline: none;
  border: none;
}

.example-button:focus {
  outline: 0;
}

.example-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-end;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.message-avatar.assistant {
  background: #EEF2FF;
  color: #4C1D95;
  border: 1px solid rgba(76, 29, 149, 0.2);
}

.message-avatar.user {
  background: #E0F2FE;
  color: #0C4A6E;
  border: 1px solid rgba(14, 116, 144, 0.2);
}

.message-content {
  max-width: 70%;
  padding: 14px 18px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.message.assistant .message-content {
  background: #FFFFFF;
  color: #1E293B;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.user .message-content {
  background: #2563EB;
  color: #FFFFFF;
}

.message-text {
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  letter-spacing: 0.3px;
  font-size: 1em;
}

.message-text.typing-effect {
  position: relative;
}

.message-text.typing-effect::after {
  content: '▊';
  display: inline-block;
  animation: blink 1s infinite;
  color: currentColor;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.message-enter-active {
  animation: messageSlideIn 0.4s ease-out;
}

.message-leave-active {
  animation: messageSlideOut 0.3s ease-in;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.skeleton-message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}

.skeleton-line:last-child {
  width: 60% !important;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

</style>

