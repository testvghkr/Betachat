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

    const scores = await prisma.$queryRaw`
      SELECT game_name, MAX(score) as best_score, COUNT(*) as games_played
      FROM game_scores 
      WHERE user_id = ${userId} 
      GROUP BY game_name
      ORDER BY best_score DESC
    `

    return NextResponse.json(scores)
  } catch (error) {
    console.error("Game scores fetch error:", error)
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

    const { game_name, score, game_data } = await request.json()

    await prisma.$executeRaw`
      INSERT INTO game_scores (user_id, game_name, score, game_data)
      VALUES (${userId}, ${game_name}, ${score}, ${JSON.stringify(game_data)})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Game score save error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
