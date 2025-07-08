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

    const events = await prisma.$queryRaw`
      SELECT * FROM calendar_events 
      WHERE user_id = ${userId} 
      ORDER BY event_date ASC, event_time ASC
    `

    return NextResponse.json(events)
  } catch (error) {
    console.error("Calendar events fetch error:", error)
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

    const { title, description, event_date, event_time, color } = await request.json()

    const result = await prisma.$queryRaw`
      INSERT INTO calendar_events (user_id, title, description, event_date, event_time, color, updated_at)
      VALUES (${userId}, ${title}, ${description}, ${event_date}, ${event_time}, ${color}, CURRENT_TIMESTAMP)
      RETURNING *
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Calendar event creation error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
