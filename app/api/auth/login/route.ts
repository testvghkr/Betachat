import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("=== LOGIN API CALLED ===")

  try {
    // Test database connection first
    console.log("🔄 Testing database connection...")
    await prisma.$connect()
    console.log("✅ Database connected")

    const body = await request.json()
    console.log("📝 Login request:", { email: body.email, hasPassword: !!body.password })

    const { email, password } = body

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json({ error: "Email en wachtwoord zijn verplicht" }, { status: 400 })
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log("❌ DATABASE_URL not configured")
      return NextResponse.json(
        {
          error: "Database niet geconfigureerd",
          details: "DATABASE_URL environment variable is missing",
        },
        { status: 500 },
      )
    }

    console.log("🔄 Attempting authentication...")
    const user = await authenticateUser(email, password)

    if (!user) {
      console.log("❌ Authentication failed")
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id)

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Remove guest cookie if exists
    cookieStore.delete("is-guest")

    console.log("✅ Login successful")

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isGuest: false,
      },
    })
  } catch (error) {
    console.error("❌ Login API error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json(
          {
            error: "Database verbinding mislukt",
            details: "Kan geen verbinding maken met de database",
            suggestion: "Controleer of DATABASE_URL correct is ingesteld",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
