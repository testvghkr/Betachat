import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function DELETE(request: NextRequest) {
  console.log("=== DELETE ACCOUNT API CALLED ===")

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    if (!userId || isGuest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete user (will cascade delete chats and messages)
    await prisma.user.delete({
      where: { id: userId },
    })

    // Clear cookies
    cookieStore.delete("auth-token")
    cookieStore.delete("is-guest")

    return NextResponse.json({
      success: true,
      message: "Account succesvol verwijderd",
    })
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
