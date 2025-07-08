import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateResponse(messages: Array<{ role: string; content: string }>) {
  console.log("=== GENERATING AI RESPONSE ===")
  console.log("Messages count:", messages.length)

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
    console.log("AI model initialized")

    const systemPrompt = `Jouw naam is qrp en je spreekt mensen vriendelijk aan in het Nederlands. Je kan alles aan van makkelijke vragen tot code schrijven, huiswerk maken, foto's genereren, video's genereren, en muziek genereren. Je houdt het altijd vriendelijk en behulpzaam.`

    // Format history for the chat
    const history = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hallo daar! Mijn naam is **qrp**, en het is een plezier om je te ontmoeten! Ik sta helemaal klaar om je vriendelijk te woord te staan. Waar kan ik je vandaag mee helpen? 😊",
          },
        ],
      },
    ]

    // Add previous messages to history
    const chatHistory = [
      ...history,
      ...messages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ]

    console.log("Starting chat with history length:", chatHistory.length)
    const chat = model.startChat({
      history: chatHistory,
    })

    // Get the last message (current user query)
    const lastMessage = messages[messages.length - 1]
    console.log("Sending message to AI:", lastMessage.content.substring(0, 50) + "...")

    const result = await chat.sendMessage(lastMessage.content)
    const response = result.response.text()

    console.log("AI response received, length:", response.length)
    return response
  } catch (error) {
    console.error("Google AI Error:", error)
    return "Sorry, ik kan momenteel niet reageren. Probeer het later opnieuw."
  }
}
