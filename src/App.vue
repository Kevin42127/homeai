<template>
  <div class="app-container" :data-font-size="fontSize">
    <ChatRoom :fontSize="fontSize" @font-size-change="handleFontSizeChange" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import ChatRoom from './components/ChatRoom.vue'
import { loadFontSize, saveFontSize } from './utils/storage.js'

const fontSize = ref(loadFontSize())

function handleFontSizeChange(size) {
  fontSize.value = size
  saveFontSize(size)
}

provide('fontSize', fontSize)
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>

