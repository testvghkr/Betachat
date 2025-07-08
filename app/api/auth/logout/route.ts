import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("=== LOGOUT API CALLED ===")

  try {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")
    cookieStore.delete("is-guest")

    console.log("Cookies deleted successfully")

    return NextResponse.json({ success: true, message: "Logged out" })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
