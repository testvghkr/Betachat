import { type NextRequest, NextResponse } from "next/server"
import { SecurityService } from "@/lib/security"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  console.log("=== SECURITY STATUS API CALLED ===")

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    if (!userId || isGuest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has security question
    const hasSecurityQuestion = await SecurityService.hasSecurityQuestion(userId)
    const securityQuestion = hasSecurityQuestion ? await SecurityService.getSecurityQuestion(userId) : null

    return NextResponse.json({
      success: true,
      hasSecurityQuestion,
      securityQuestion,
    })
  } catch (error) {
    console.error("Security status error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
