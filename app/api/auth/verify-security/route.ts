import { type NextRequest, NextResponse } from "next/server"
import { SecurityService } from "@/lib/security"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("=== VERIFY SECURITY API CALLED ===")

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is verplicht" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({ error: "Geen account gevonden met dit email adres" }, { status: 404 })
    }

    // Get security question using the new SecurityService
    const securityQuestion = await SecurityService.getSecurityQuestion(user.id)

    if (!securityQuestion) {
      return NextResponse.json(
        {
          error: "Dit account heeft geen beveiligingsvraag ingesteld. Neem contact op met support.",
        },
        { status: 400 },
      )
    }

    console.log("Security question found for user:", user.id)

    return NextResponse.json({
      success: true,
      securityQuestion,
      userEmail: user.email,
      userName: user.name,
    })
  } catch (error) {
    console.error("Verify security error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
