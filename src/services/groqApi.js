const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function checkApiKey() {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY 環境變數未設置，請在 .env 檔案中設置或透過 Vercel 環境變數設置')
  }
}
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const AVAILABLE_MODELS = {
  'llama-3.1-8b-instant': {
    name: 'Llama 3.1 8B Instant',
    category: 'Llama 3.1 系列（META）'
  }
}

const DEFAULT_MODEL = 'llama-3.1-8b-instant'

function detectQuestionType(userMessage, conversationHistory) {
  const message = userMessage.toLowerCase()
  
  // 檢測自我介紹相關問題
  const identityWords = ['你是誰', '你是', '介紹自己', '介紹一下', '自我介紹', '你的身份', '你的角色', '你是什麼', 'what are you', 'who are you', '介紹你', '關於你']
  if (identityWords.some(word => message.includes(word))) {
    return 'identity'
  }
  
  const questionWords = ['什麼', '為何', '為什麼', '如何', '怎麼', '怎樣', '解釋', '說明', '介紹']
  const exampleWords = ['例子', '範例', '舉例', '例如', '像是']
  const compareWords = ['比較', '差異', '區別', '不同', 'vs', '對比']
  const stepWords = ['步驟', '流程', '方法', '做法', '如何做']
  const conceptWords = ['概念', '定義', '原理', '理論', '基礎']
  
  if (questionWords.some(word => message.includes(word))) {
    if (exampleWords.some(word => message.includes(word))) {
      return 'example'
    }
    if (compareWords.some(word => message.includes(word))) {
      return 'compare'
    }
    if (stepWords.some(word => message.includes(word))) {
      return 'step'
    }
    if (conceptWords.some(word => message.includes(word))) {
      return 'concept'
    }
    return 'explain'
  }
  
  if (message.includes('？') || message.includes('?')) {
    return 'question'
  }
  
  return 'general'
}

function analyzeStudentResponse(studentMessage) {
  if (!studentMessage || !studentMessage.content) {
    return { complexity: 0, confidence: 0, hasQuestions: false, understanding: 'unknown' }
  }
  
  const content = studentMessage.content
  const length = content.length
  
  // 檢測理解信號
  const understandingSignals = {
    positive: /懂了|明白了|理解了|清楚了|知道了|了解|我懂|我明白|原來如此|對對對|沒錯|是的|對的/i,
    negative: /不懂|不明白|不理解|不清楚|不知道|還是不懂|還是不明白|不太懂|不太明白|有點難|不太清楚|困惑|疑惑/i,
    questioning: /為什麼|為何|怎麼|如何|什麼|為什麼會|怎麼會|如何做|什麼是|為什麼是/i
  }
  
  // 檢測專業術語和複雜概念
  const advancedTerms = /原理|機制|理論|系統|架構|演算法|資料結構|抽象|封裝|繼承|多型|設計模式|框架|架構模式|最佳實踐|優化|效能|擴展性|可維護性/i
  const intermediateTerms = /功能|方法|步驟|流程|概念|定義|類型|變數|函數|類別|物件|介面/i
  const basicTerms = /這個|那個|什麼|怎麼|如何|為什麼|可以|不能|會|不會|是|不是/i
  
  // 計算複雜度分數
  let complexity = 0
  if (length > 300) complexity += 3
  else if (length > 150) complexity += 2
  else if (length > 50) complexity += 1
  
  if (advancedTerms.test(content)) complexity += 3
  else if (intermediateTerms.test(content)) complexity += 2
  else if (basicTerms.test(content)) complexity += 1
  
  // 檢測追問
  const hasQuestions = understandingSignals.questioning.test(content)
  
  // 判斷理解程度
  let understanding = 'unknown'
  if (understandingSignals.positive.test(content)) {
    understanding = 'positive'
  } else if (understandingSignals.negative.test(content)) {
    understanding = 'negative'
  }
  
  // 計算信心度（基於回答的完整性和準確性指標）
  let confidence = 0
  if (length > 100) confidence += 2
  else if (length > 30) confidence += 1
  
  if (advancedTerms.test(content)) confidence += 2
  else if (intermediateTerms.test(content)) confidence += 1
  
  if (understanding === 'positive') confidence += 1
  if (hasQuestions && understanding !== 'negative') confidence += 1
  
  return { complexity, confidence, hasQuestions, understanding }
}

function getContextLevel(conversationHistory) {
  const messageCount = conversationHistory.length
  
  if (messageCount === 0) {
    return 'beginner'
  }
  
  // 分析最近的學生回答（最近 6 條訊息中的用戶訊息）
  const recentMessages = conversationHistory.slice(-6)
  const userMessages = recentMessages.filter(msg => msg.role === 'user')
  
  if (userMessages.length === 0) {
    // 如果沒有用戶訊息，根據訊息數量判斷
    if (messageCount > 10) return 'intermediate'
    return 'beginner'
  }
  
  // 分析所有用戶回答
  const analyses = userMessages.map(msg => analyzeStudentResponse(msg))
  
  // 計算平均複雜度和信心度
  const avgComplexity = analyses.reduce((sum, a) => sum + a.complexity, 0) / analyses.length
  const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length
  
  // 檢測是否有負面理解信號
  const hasNegativeSignals = analyses.some(a => a.understanding === 'negative')
  const hasPositiveSignals = analyses.some(a => a.understanding === 'positive')
  
  // 檢測是否有追問（表示積極思考）
  const hasActiveQuestions = analyses.some(a => a.hasQuestions)
  
  // 檢測複雜術語
  const recentContent = recentMessages.map(msg => msg.content || '').join(' ')
  const hasAdvancedTerms = /原理|機制|理論|系統|架構|演算法|資料結構|抽象|封裝|繼承|多型|設計模式|框架|架構模式|最佳實踐|優化|效能|擴展性|可維護性/i.test(recentContent)
  const hasIntermediateTerms = /功能|方法|步驟|流程|概念|定義|類型|變數|函數|類別|物件|介面/i.test(recentContent)
  
  // 判斷邏輯（優先級從高到低）
  
  // 1. 如果學生明確表示不理解，且複雜度低，判定為初學者
  if (hasNegativeSignals && avgComplexity < 2 && !hasActiveQuestions) {
    return 'beginner'
  }
  
  // 2. 如果有高級術語且學生回答複雜度高、信心度高，判定為進階
  if (hasAdvancedTerms && avgComplexity >= 4 && avgConfidence >= 3) {
    return 'advanced'
  }
  
  // 3. 如果有中級術語且學生回答有一定複雜度和信心度，判定為中級
  if (hasIntermediateTerms && avgComplexity >= 2 && avgConfidence >= 2) {
    return 'intermediate'
  }
  
  // 4. 如果對話較長且學生積極提問或表示理解，判定為中級
  if (messageCount > 10 && (hasActiveQuestions || hasPositiveSignals) && avgComplexity >= 1.5) {
    return 'intermediate'
  }
  
  // 5. 如果對話中等長度且學生回答有一定複雜度，判定為中級
  if (messageCount > 5 && avgComplexity >= 2 && avgConfidence >= 1.5) {
    return 'intermediate'
  }
  
  // 6. 如果對話很長且有高級術語，即使複雜度不高也可能是進階
  if (messageCount > 15 && hasAdvancedTerms && avgComplexity >= 2.5) {
    return 'advanced'
  }
  
  // 7. 如果學生積極提問且回答有一定複雜度，可能是中級
  if (hasActiveQuestions && avgComplexity >= 2 && messageCount > 3) {
    return 'intermediate'
  }
  
  // 8. 預設為初學者
  return 'beginner'
}

function getSystemPrompt(questionType, contextLevel, conversationHistory) {
  const basePrompt = '你是一位親切、專業的 AI 老師，必須且只能使用繁體中文與學生對話。嚴格禁止使用簡體中文、簡體字、英文或任何非繁體中文的語言。所有回應必須完全使用繁體中文（正體中文），包括所有文字、標點符號、用詞和專業術語。如果必須提到英文專有名詞，請用繁體中文說明，或使用繁體中文翻譯。絕對禁止在回應中混用英文單詞、英文句子或英文縮寫。'
  
  const personalityTraits = [
    '用語親切自然，就像在與朋友聊天，但保持專業',
    '採用引導式教學，先了解學生的背景知識和思考過程',
    '適時給予鼓勵和正面回饋，讓學習更有動力',
    '如果問題不清楚，會友善地請學生補充說明',
    '善於用類比和生活中的例子幫助理解',
    '會主動提供延伸學習建議和相關主題',
    '優先引導學生思考，而不是直接給答案',
    '根據學生的回答再提供適當的解釋和補充'
  ]
  
  const formatRules = [
    '整體使用純文字回應，不使用標題、項目符號或任何特殊符號',
    '以完整句子或短段落自然描述重點，使用逗號或句號分隔',
    '嚴禁使用 *、•、-、#、[]、() 等符號或任何 Markdown 語法',
    '保持語句流暢、回應長度適中，重點清楚且易於理解'
  ]
  
  let typeSpecificGuidance = ''
  
  switch (questionType) {
    case 'identity':
      typeSpecificGuidance = '\n【自我介紹模式】\n- 以親切、自然的語氣介紹自己是一位 AI 老師\n- 說明你的特點和能力：擅長用繁體中文教學、親切自然、會根據學生程度調整\n- 強調你是一位專業但親切的老師，就像朋友一樣\n- 可以提到你擅長解釋概念、提供範例、步驟教學等\n- 鼓勵學生隨時提問，表示你很樂意幫助學習\n- 保持輕鬆、友善的語氣，不要過於正式'
      break
    case 'concept':
      typeSpecificGuidance = '\n【概念解釋模式】\n- 先詢問學生對這個概念的了解程度和先備知識\n- 引導學生思考相關的生活經驗或已知概念\n- 根據學生的回答，用簡單的類比幫助理解\n- 讓學生嘗試用自己的話解釋，再給予補充和修正\n- 說明這個概念的重要性和應用場景\n- 提供相關的延伸概念或進階主題'
      break
    case 'step':
      typeSpecificGuidance = '\n【步驟教學模式】\n- 先詢問學生對這個過程的了解程度\n- 引導學生思考可能的步驟順序\n- 根據學生的想法，逐步引導和完善步驟\n- 每個步驟說明原因和注意事項\n- 提供實際範例或操作建議\n- 提醒常見錯誤或注意事項'
      break
    case 'compare':
      typeSpecificGuidance = '\n【比較分析模式】\n- 先詢問學生對要比較事物的了解\n- 引導學生思考可能的比較維度（優缺點、適用場景等）\n- 根據學生的想法，逐步補充和完善比較內容\n- 說明各自的適用情況\n- 引導學生思考如何選擇，再提供建議'
      break
    case 'example':
      typeSpecificGuidance = '\n【範例說明模式】\n- 先詢問學生是否知道相關的範例\n- 引導學生思考生活中的類似情況\n- 根據學生的回答，提供更具體的範例\n- 從簡單到複雜逐步說明\n- 解釋範例中的關鍵點\n- 鼓勵學生思考更多類似情況'
      break
    case 'explain':
      typeSpecificGuidance = '\n【解釋說明模式】\n- 先了解學生對這個主題的已知程度\n- 引導學生思考相關的背景知識\n- 根據學生的理解程度，從基礎開始逐步深入\n- 用多角度解釋（原理、應用、影響等）\n- 適時詢問學生是否理解，再繼續深入\n- 總結核心要點'
      break
    default:
      typeSpecificGuidance = '\n【一般對話模式】\n- 先了解學生的問題背景和需求\n- 引導學生思考相關的知識點\n- 根據學生的回答提供適當的資訊和建議\n- 保持對話自然流暢'
  }
  
  let levelGuidance = ''
  switch (contextLevel) {
    case 'beginner':
      levelGuidance = '\n【理解程度：初學者】\n- 使用簡單易懂的語言\n- 避免過多專業術語，必要時先解釋\n- 提供更多基礎背景知識\n- 多用類比和日常例子'
      break
    case 'intermediate':
      levelGuidance = '\n【理解程度：中級】\n- 可以適度使用專業術語\n- 提供更深入的解釋\n- 可以討論進階概念\n- 鼓勵思考更深層的問題'
      break
    case 'advanced':
      levelGuidance = '\n【理解程度：進階】\n- 可以使用專業術語和複雜概念\n- 提供深入的分析和見解\n- 討論相關的進階主題\n- 可以提出批判性思考'
      break
  }
  
  const encouragementGuidance = '\n【鼓勵與延伸】\n- 在引導過程中適時給予鼓勵和肯定\n- 肯定學生的思考過程，即使答案不完全正確\n- 提供相關的延伸學習主題或資源建議\n- 提出思考問題，促進深入學習\n- 如果適合，可以建議下一步學習方向'
  
  const errorDetectionGuidance = '\n【錯誤檢測與糾正引導】\n- 仔細聆聽學生的回答，檢測其中可能存在的錯誤概念、誤解、邏輯問題或事實錯誤\n- 絕對不要直接指出錯誤，而是用引導式提問幫助學生自己發現問題\n- 如果學生回答有誤，先肯定學生思考的過程，例如：「你的思考方向很好」、「你提到的這個點很有意思」、「讓我們再深入思考一下」\n- 用提問引導學生思考：「如果這樣的話，會發生什麼？」、「你覺得這樣合理嗎？」、「有沒有其他可能？」、「這樣做會有什麼後果？」、「讓我們從另一個角度看看」\n- 引導學生從不同角度思考問題，幫助他們發現自己的錯誤，例如：「如果從使用者的角度來看呢？」、「如果換個情境會怎樣？」\n- 當學生發現錯誤後，給予肯定和鼓勵，例如：「很好，你發現了關鍵點」、「對，這就是重點」、「你的觀察很敏銳」，然後引導正確的理解\n- 如果學生多次回答錯誤，可以逐步提供更多提示，但始終保持引導而非直接給答案，例如：「讓我們想想，如果...會怎樣？」、「有沒有注意到...？」\n- 記住：讓學生自己發現錯誤比直接告訴他們更有教育意義，這能幫助他們建立批判性思維\n- 即使學生的答案完全錯誤，也要肯定他們的嘗試和思考過程，然後用提問引導正確方向\n- 檢測常見錯誤類型：概念混淆、邏輯錯誤、事實錯誤、過度簡化、以偏概全等，針對不同錯誤類型使用不同的引導方式'
  
  return `${basePrompt}

【你的特點】
${personalityTraits.map(trait => `• ${trait}`).join('\n')}

${typeSpecificGuidance}
${levelGuidance}
${encouragementGuidance}
${errorDetectionGuidance}

【回應格式要求】
${formatRules.map(rule => `• ${rule}`).join('\n')}

【重要提醒】
• 始終保持親切、鼓勵的語氣
• 優先採用引導式教學，先了解學生再提供解答
• 不要直接給答案，而是先引導學生思考
• 根據學生的回答再提供適當的解釋和補充
• 肯定學生的思考過程，即使答案不完全正確
• 適時提供延伸學習建議，但不要過於推銷
• 如果問題涉及多個層面，可以分層次引導
• 記住：好的教學是引導學生自己發現答案，而不是直接告訴答案
• 仔細分析學生的回答，檢測可能的錯誤概念，但要用引導式提問幫助學生自己發現
• 如果學生回答有誤，先肯定思考過程，再用提問引導思考，不要直接指出錯誤
• 根據學生的回答品質和複雜度，動態調整你的引導方式和解釋深度
• 嚴格禁止使用任何項目符號或特殊符號（包含 *、•、-、#、[]、() 等）
• 嚴格禁止使用任何 Markdown 語法符號
• 語言要求：必須且只能使用繁體中文（正體中文），絕對禁止使用簡體中文、簡體字、英文或任何非繁體中文的語言
• 所有文字、標點符號、用詞都必須是繁體中文，包括：的（不是"的"）、是（不是"是"）、這（不是"这"）、個（不是"个"）等
• 如果看到簡體字，必須立即轉換為對應的繁體字
• 嚴格禁止在回應中使用任何英文單詞、英文句子、英文縮寫或英文專有名詞
• 所有專業術語、技術名詞都必須使用繁體中文翻譯
• 如果必須提到英文專有名詞（如程式語言名稱、技術術語），請用繁體中文說明，例如：「JavaScript」應說明為「一種程式設計語言」或使用「爪哇腳本」等繁體中文翻譯
• 回應中不得出現任何英文字母、英文單詞或英文句子，所有內容都必須是繁體中文`
}

function calculateParams(messages) {
  const totalLength = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0)
  const messageCount = messages.length
  
  let temperature = 0.7
  let maxTokens = 2048
  
  if (messageCount > 10) {
    temperature = 0.6
    maxTokens = 1536
  } else if (totalLength > 2000) {
    temperature = 0.65
    maxTokens = 1792
  }
  
  if (messageCount < 3) {
    temperature = 0.75
    maxTokens = 2560
  }
  
  return { temperature, maxTokens }
}

export async function sendMessageStream(messages, model, onChunk, abortSignal) {
  checkApiKey()
  try {
    const userMessages = messages.filter(msg => msg.role === 'user')
    const lastUserMessage = userMessages[userMessages.length - 1]
    const questionType = detectQuestionType(lastUserMessage?.content || '', messages)
    const contextLevel = getContextLevel(messages)
    
    const systemMessage = {
      role: 'system',
      content: getSystemPrompt(questionType, contextLevel, messages)
    }
    
    const messagesWithSystem = [systemMessage, ...messages]
    const { temperature, maxTokens } = calculateParams(messages)
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messagesWithSystem,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true
      }),
      signal: abortSignal
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 錯誤: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.choices?.[0]?.delta?.content) {
              onChunk(data.choices[0].delta.content)
            }
          } catch (e) {
            console.warn('解析流式數據失敗:', e)
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('請求已取消')
    }
    console.error('Groq API 錯誤:', error)
    throw error
  }
}

export async function sendMessage(messages, model = DEFAULT_MODEL) {
  checkApiKey()
  try {
    const userMessages = messages.filter(msg => msg.role === 'user')
    const lastUserMessage = userMessages[userMessages.length - 1]
    const questionType = detectQuestionType(lastUserMessage?.content || '', messages)
    const contextLevel = getContextLevel(messages)
    
    const systemMessage = {
      role: 'system',
      content: getSystemPrompt(questionType, contextLevel, messages)
    }
    
    const messagesWithSystem = [systemMessage, ...messages]
    const { temperature, maxTokens } = calculateParams(messages)
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messagesWithSystem,
        temperature: temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content
    } else {
      throw new Error('API 回應格式錯誤')
    }
  } catch (error) {
    console.error('Groq API 錯誤:', error)
    throw error
  }
}

export function getAvailableModels() {
  return AVAILABLE_MODELS
}

export function getDefaultModel() {
  return DEFAULT_MODEL
}

