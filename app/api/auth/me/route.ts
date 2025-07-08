import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  console.log("=== ME API CALLED ===")

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    console.log("Auth token:", userId)
    console.log("Is guest:", isGuest)

    if (!userId) {
      console.log("No auth token found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (isGuest) {
      console.log("Returning guest user")
      return NextResponse.json({
        id: "guest",
        name: "Gast",
        email: "guest@qrp.com",
        isGuest: true,
      })
    }

    // Get real user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      console.log("User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Returning real user:", user.id)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isGuest: false,
    })
  } catch (error) {
    console.error("Me API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
