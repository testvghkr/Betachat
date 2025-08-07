import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client';
import { generateResponse } from "@/lib/google-ai"
import { cookies } from "next/headers"
import { getMessagesByChatId, createMessage } from '@/lib/db';

const prisma = new PrismaClient();

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
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    console.log("User ID:", userId)
    console.log("Is Guest:", isGuest)

    if (!userId) {
      console.log("Unauthorized: No auth token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (isGuest) {
      console.log("Guest user, returning empty messages")
      return NextResponse.json([])
    }

    // Check if chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        userId,
      },
    })

    if (!chat) {
      console.log("Chat not found or doesn't belong to user")
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    console.log("Fetching messages for chat:", params.chatId)
    const messages = await getMessagesByChatId(params.chatId);

    console.log("Messages found:", messages.length)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  } finally {
    await prisma.$disconnect();
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
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    console.log("User ID:", userId)
    console.log("Is Guest:", isGuest)
    console.log("File URL:", fileUrl)
    console.log("File Name:", fileName)
    console.log("Role:", role)

    if (!userId) {
      console.log("Unauthorized: No auth token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (isGuest) {
      console.log("Guest user, generating response without saving")

      const userMessage = {
        id: `guest_user_${Date.now()}`,
        content,
        role: "user",
        createdAt: new Date().toISOString(),
        fileUrl,
        fileName,
      }

      console.log("Generating AI response for guest")

      // Prepare context for AI with file information
      let aiContext = content
      if (fileUrl && fileName) {
        aiContext += `\n\n[Gebruiker heeft een bestand gedeeld: ${fileName}]`
      }

      let aiResponse = await generateResponse([{ role: "user", content: aiContext }])

      // If there's a file, mention it in the response
      if (fileUrl && fileName) {
        const fileType = fileName.split(".").pop()?.toLowerCase()
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileType || "")) {
          aiResponse = `Ik zie dat je een afbeelding hebt gedeeld: ${fileName}. ${aiResponse}`
        } else {
          aiResponse = `Ik zie dat je een bestand hebt gedeeld: ${fileName}. ${aiResponse}`
        }
      }

      const aiMessage = {
        id: `guest_ai_${Date.now()}`,
        content: aiResponse,
        role: "assistant",
        createdAt: new Date().toISOString(),
      }

      console.log("AI response generated for guest")
      return NextResponse.json({ userMessage, aiMessage })
    }

    // Check if chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        userId,
      },
    })

    if (!chat) {
      console.log("Chat not found or doesn't belong to user")
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    console.log("Creating user message in database")
    const userMessage = await createMessage(params.chatId, role, content);

    console.log("User message created:", userMessage.id)

    // Check if this is the first message in the chat (excluding welcome messages)
    const messageCount = await prisma.message.count({
      where: {
        chat_id: params.chatId,
        role: "user", // Only count user messages
      },
    })

    // If this is the first user message, update the chat title
    if (messageCount === 1) {
      console.log("Generating chat title from first message")
      const newTitle = generateChatTitle(content)

      await prisma.chat.update({
        where: { id: params.chatId },
        data: { title: newTitle },
      })

      console.log("Chat title updated to:", newTitle)
    }

    console.log("Fetching all messages for context")
    const messages = await getMessagesByChatId(params.chatId);

    console.log("Generating AI response")

    // Prepare context for AI including file information
    const contextMessages = messages.map((m: any) => {
      let messageContent = m.content
      if (m.fileUrl && m.fileName) {
        messageContent += `\n\n[${m.role === "user" ? "Gebruiker" : "Assistent"} heeft een bestand gedeeld: ${m.fileName}]`
      }
      return {
        role: m.role,
        content: messageContent,
      }
    })

    const aiResponse = await generateResponse(contextMessages)

    console.log("Creating AI message in database")
    const aiMessage = await createMessage(params.chatId, "assistant", aiResponse);

    console.log("AI message created:", aiMessage.id)

    console.log("Updating chat timestamp")
    await prisma.chat.update({
      where: { id: params.chatId },
      data: { updatedAt: new Date() },
    })

    console.log("Message handling complete")
    return NextResponse.json({ userMessage, aiMessage }, { status: 201 });
  } catch (error) {
    console.error("Post message error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create message',
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect();
  }
}
