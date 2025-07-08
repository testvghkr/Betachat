import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("=== UPDATE PROFILE API CALLED ===")

  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value
    const isGuest = cookieStore.get("is-guest")?.value === "true"

    if (!userId || isGuest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Naam en email zijn verplicht" }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email adres is al in gebruik" }, { status: 400 })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    })

    return NextResponse.json({
      success: true,
      message: "Profiel bijgewerkt",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
