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

    const snippets = await prisma.$queryRaw`
      SELECT * FROM code_snippets 
      WHERE user_id = ${userId} 
      ORDER BY updated_at DESC
    `

    return NextResponse.json(snippets)
  } catch (error) {
    console.error("Code snippets fetch error:", error)
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

    const { title, code, language } = await request.json()

    const result = await prisma.$queryRaw`
      INSERT INTO code_snippets (user_id, title, code, language, updated_at)
      VALUES (${userId}, ${title}, ${code}, ${language}, CURRENT_TIMESTAMP)
      RETURNING *
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Code snippet creation error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
