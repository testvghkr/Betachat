import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  console.log("=== GET CHATS API CALLED ===")

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
      console.log("Guest user, returning dummy chat")
      return NextResponse.json([
        {
          id: "guest_chat",
          title: "Gast Chat",
          description: "Tijdelijke chat",
        },
      ])
    }

    console.log("Fetching chats for user:", userId)
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    console.log("Chats found:", chats.length)
    return NextResponse.json(chats)
  } catch (error) {
    console.error("Get chats error:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("=== CREATE CHAT API CALLED ===")

  try {
    const body = await request.json()
    console.log("Create chat body:", body)

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
      console.log("Guest user, returning dummy chat")
      return NextResponse.json({
        id: `guest_${Date.now()}`,
        title: "Gast Chat",
        description: "Tijdelijke chat",
      })
    }

    console.log("Creating chat for user:", userId)
    const chat = await prisma.chat.create({
      data: {
        title,
        description,
        userId,
      },
    })

    console.log("Chat created:", chat.id)
    return NextResponse.json(chat)
  } catch (error) {
    console.error("Create chat error:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
