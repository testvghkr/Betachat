import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

// Update chat details
export async function PATCH(request: NextRequest, { params }: { params: { chatId: string } }) {
  console.log("=== UPDATE CHAT API CALLED ===")
  console.log("Chat ID:", params.chatId)

  try {
    const body = await request.json()
    console.log("Update chat body:", body)

    const { title, description } = body

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
      console.log("Guest user cannot update chats")
      return NextResponse.json({ error: "Guest users cannot update chats" }, { status: 403 })
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

    // Update chat
    console.log("Updating chat:", params.chatId)
    const updatedChat = await prisma.chat.update({
      where: { id: params.chatId },
      data: {
        title: title || chat.title,
        description: description !== undefined ? description : chat.description,
        updatedAt: new Date(),
      },
    })

    console.log("Chat updated:", updatedChat.id)
    return NextResponse.json(updatedChat)
  } catch (error) {
    console.error("Update chat error:", error)
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 })
  }
}

// Delete chat
export async function DELETE(request: NextRequest, { params }: { params: { chatId: string } }) {
  console.log("=== DELETE CHAT API CALLED ===")
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
      console.log("Guest user cannot delete chats")
      return NextResponse.json({ error: "Guest users cannot delete chats" }, { status: 403 })
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

    // Delete chat (will cascade delete messages)
    console.log("Deleting chat:", params.chatId)
    await prisma.chat.delete({
      where: { id: params.chatId },
    })

    console.log("Chat deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete chat error:", error)
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
  }
}
