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
      SELECT settings FROM app_settings 
      WHERE user_id = ${userId}
    `

    if (Array.isArray(settings) && settings.length > 0) {
      return NextResponse.json(settings[0].settings)
    }

    // Return default settings
    const defaultSettings = {
      theme: "dark",
      language: "nl",
      notifications: true,
      autoSave: true,
      animations: true,
      soundEffects: false,
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error("App settings fetch error:", error)
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

    const settings = await request.json()

    await prisma.$executeRaw`
      INSERT INTO app_settings (user_id, settings, updated_at)
      VALUES (${userId}, ${JSON.stringify(settings)}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET settings = ${JSON.stringify(settings)}, updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("App settings save error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
