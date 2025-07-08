import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await prisma.$queryRaw`
      SELECT * FROM notes 
      WHERE user_id = ${userId} 
      ORDER BY updated_at DESC
    `

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Notes fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, color } = await request.json()

    const result = await prisma.$queryRaw`
      INSERT INTO notes (user_id, title, content, color, updated_at)
      VALUES (${userId}, ${title}, ${content}, ${color}, CURRENT_TIMESTAMP)
      RETURNING *
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Note creation error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
