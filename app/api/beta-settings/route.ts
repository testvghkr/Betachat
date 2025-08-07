import { type NextRequest, NextResponse } from "next/server"
import { getUserSettings, updateUserSettings, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Ongeldig token" }, { status: 401 })
    }

    const settings = await getUserSettings(decoded.userId)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error getting beta settings:", error)
    return NextResponse.json({ error: "Server fout" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Ongeldig token" }, { status: 401 })
    }

    const body = await request.json()
    const success = await updateUserSettings(decoded.userId, body)

    if (success) {
      const updatedSettings = await getUserSettings(decoded.userId)
      return NextResponse.json(updatedSettings)
    } else {
      return NextResponse.json({ error: "Kon instellingen niet opslaan" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating beta settings:", error)
    return NextResponse.json({ error: "Server fout" }, { status: 500 })
  }
}
