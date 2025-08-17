import { type NextRequest, NextResponse } from "next/server"
import { generateResponse } from "@/lib/google-ai"
import { cookies } from "next/headers"
import { getMessagesByChatId, createMessage, getChatById, sql } from '@/lib/db'; // Added sql import

function generateChatTitle(firstMessage: string): string {
  // Haal de eerste zin eruit (tot de eerste punt, vraagteken of uitroepteken)
  const firstSentence = firstMessage.split(/[.!?]/)[0].trim()

  // Beperk tot maximaal 50 karakters
  let title = firstSentence.length > 50 ? firstSentence.substring(0, 47) + "..." : firstSentence

  // Als de titel te kort is, gebruik de hele eerste zin
  if (title.length < 10) {
    title = firstMessage.substring(0, 50).trim()
    if (firstMessage.length > 50) title += "..."
  }

  // Zorg ervoor dat de titel begint met een hoofdletter
  title = title.charAt(0).toUpperCase() + title.slice(1)

  return title || "Nieuwe Chat"
}

export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
  console.log("=== GET MESSAGES API CALLED ===")
  console.log("Chat ID:", params.chatId)

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value // This will be 'qrp_guest_user'
    const isGuest = cookieStore.get("is-guest")?.value === "true" // This will be 'true'

    console.log("User ID:", userId)
    console.log("Is Guest:", isGuest)

    if (!userId) {
      console.log("Unauthorized: No auth token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In this version, all users are effectively guests, so we always fetch from DB
    console.log("Fetching messages for chat:", params.chatId)
    const messages = await getMessagesByChatId(params.chatId);

    console.log("Messages found:", messages.length)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  console.log("=== POST MESSAGE API CALLED ===")
  console.log("Chat ID:", params.chatId)

  try {
    const body = await request.json()
    console.log("Message body:", body)

    const { content, fileUrl, fileName, role } = body

    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value // This will be 'qrp_guest_user'
    const isGuest = cookieStore.get("is-guest")?.value === "true" // This will be 'true'

    console.log("User ID:", userId)
    console.log("Is Guest:", isGuest)
    console.log("File URL:", fileUrl)
    console.log("File Name:", fileName)
    console.log("Role:", role)

    if (!userId) {
      console.log("Unauthorized: No auth token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // All users are treated as guests in this version, so messages are saved to DB
    // and AI response is generated.

    // Check if chat exists
    const chat = await getChatById(params.chatId);

    if (!chat) {
      console.log("Chat not found")
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    console.log("Creating user message in database")
    const userMessage = await createMessage(params.chatId, role, content);

    console.log("User message created:", userMessage.id)

    // Check if this is the first message in the chat (excluding welcome messages)
    const existingMessages = await getMessagesByChatId(params.chatId);
    const userMessageCount = existingMessages.filter(m => m.role === 'user').length;

    // If this is the first user message, update the chat title
    if (userMessageCount === 1) {
      console.log("Generating chat title from first message")
      const newTitle = generateChatTitle(content)

      await sql`UPDATE "Chat" SET title = ${newTitle}, updated_at = NOW() WHERE id = ${params.chatId};`;

      console.log("Chat title updated to:", newTitle)
    }

    console.log("Fetching all messages for context")
    const messages = await getMessagesByChatId(params.chatId);

    console.log("Generating AI response")

    // Prepare context for AI including file information
    const contextMessages = messages.map((m: any) => {
      let messageContent = m.content
      // Note: fileUrl and fileName are not stored in the Message table in this raw SQL setup.
      // If you need them for AI context, you'd need to pass them separately or store them.
      // For now, assuming AI only needs text content.
      return {
        role: m.role,
        content: messageContent,
      }
    })

    const aiResponse = await generateResponse(content, contextMessages) // Pass current message and full history

    console.log("Creating AI message in database")
    const aiMessage = await createMessage(params.chatId, "assistant", aiResponse);

    console.log("AI message created:", aiMessage.id)

    console.log("Updating chat timestamp")
    await sql`UPDATE "Chat" SET updated_at = NOW() WHERE id = ${params.chatId};`;

    console.log("Message handling complete")
    return NextResponse.json({ userMessage, aiMessage }, { status: 201 });
  } catch (error) {
    console.error("Post message error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 },
    )
  }
}
