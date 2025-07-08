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

    const settings = await prisma.$queryRaw`
      SELECT beta_enabled, enter_to_send FROM beta_settings 
      WHERE user_id = ${userId}
    `

    if (Array.isArray(settings) && settings.length > 0) {
      return NextResponse.json(settings[0])
    }

    // Return default settings
    return NextResponse.json({
      beta_enabled: false,
      enter_to_send: true,
    })
  } catch (error) {
    console.error("Beta settings fetch error:", error)
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

    const { beta_enabled, enter_to_send } = await request.json()

    await prisma.$executeRaw`
      INSERT INTO beta_settings (user_id, beta_enabled, enter_to_send, updated_at)
      VALUES (${userId}, ${beta_enabled}, ${enter_to_send}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        beta_enabled = ${beta_enabled}, 
        enter_to_send = ${enter_to_send}, 
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Beta settings save error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
