import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function generateResponse(messages: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
    
    const lastMessage = messages[messages.length - 1]
    
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    })
    
    const result = await chat.sendMessageStream(lastMessage.content)
    
    return result.stream
  } catch (error) {
    console.error('Google AI Error:', error)
    throw error
  }
}
