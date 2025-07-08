import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { verifyPassword, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("=== UPDATE PASSWORD API CALLED ===")

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    if (!userId || isGuest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Huidig en nieuw wachtwoord zijn verplicht" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Huidig wachtwoord is onjuist" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Wachtwoord succesvol gewijzigd",
    })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
