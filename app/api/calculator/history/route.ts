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

    const history = await prisma.$queryRaw`
      SELECT * FROM calculator_history 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    return NextResponse.json(history)
  } catch (error) {
    console.error("Calculator history fetch error:", error)
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

    const { calculation, result } = await request.json()

    await prisma.$executeRaw`
      INSERT INTO calculator_history (user_id, calculation, result)
      VALUES (${userId}, ${calculation}, ${result})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Calculator history save error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
