import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("=== GUEST API CALLED ===")

  try {
    const cookieStore = await cookies()
    const guestId = `guest_${Date.now()}`

    cookieStore.set("auth-token", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    cookieStore.set("is-guest", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    console.log("Guest cookies set successfully")

    const response = NextResponse.json({
      success: true,
      message: "Guest mode activated",
      user: {
        id: guestId,
        name: "Gast",
        email: "guest@qrp.com",
        isGuest: true,
      },
    })

    console.log("Guest response created successfully")
    return response
  } catch (error) {
    console.error("Guest API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
