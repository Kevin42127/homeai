const STORAGE_KEY = 'ai-teacher-chat-history'
const MODEL_STORAGE_KEY = 'ai-teacher-selected-model'
const TOUR_COMPLETED_KEY = 'ai-teacher-tour-completed'
const FONT_SIZE_KEY = 'ai-teacher-font-size'

export function saveChatHistory(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error('儲存對話歷史失敗:', error)
  }
}

export function loadChatHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('載入對話歷史失敗:', error)
  }
  return []
}

export function clearChatHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清除對話歷史失敗:', error)
  }
}

export function saveSelectedModel(model) {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, model)
  } catch (error) {
    console.error('儲存模型選擇失敗:', error)
  }
}

export function loadSelectedModel() {
  try {
    return localStorage.getItem(MODEL_STORAGE_KEY)
  } catch (error) {
    console.error('載入模型選擇失敗:', error)
  }
  return null
}

export function exportChatHistory() {
  try {
    const history = loadChatHistory()
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('匯出對話歷史失敗:', error)
    throw error
  }
}

export function checkFirstVisit() {
  try {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY)
    return !completed
  } catch (error) {
    console.error('檢查首次訪問失敗:', error)
    return true
  }
}

export function markTourCompleted() {
  try {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
  } catch (error) {
    console.error('標記教學完成失敗:', error)
  }
}

export function resetTour() {
  try {
    localStorage.removeItem(TOUR_COMPLETED_KEY)
  } catch (error) {
    console.error('重置教學失敗:', error)
  }
}

export function saveFontSize(size) {
  try {
    localStorage.setItem(FONT_SIZE_KEY, size)
  } catch (error) {
    console.error('儲存字體大小失敗:', error)
  }
}

export function loadFontSize() {
  try {
    return localStorage.getItem(FONT_SIZE_KEY) || 'medium'
  } catch (error) {
    console.error('載入字體大小失敗:', error)
    return 'medium'
  }
}

