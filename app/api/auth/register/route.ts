import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  console.log("=== REGISTER API CALLED ===")

  try {
    // Test database connection first
    console.log("🔄 Testing database connection...")
    await prisma.$connect()
    console.log("✅ Database connected")

    const body = await request.json()
    console.log("📝 Register request:", {
      email: body.email,
      name: body.name,
      hasPassword: !!body.password,
    })

    const { email, name, password } = body

    if (!email || !name || !password) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ error: "Wachtwoord moet minimaal 6 karakters zijn" }, { status: 400 })
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("❌ User already exists")
      return NextResponse.json({ error: "Email adres is al in gebruik" }, { status: 400 })
    }

    // Hash password
    console.log("🔄 Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("🔄 Creating user...")
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    console.log("✅ User created:", user.id)

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

    console.log("✅ Registration successful")

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isGuest: false,
      },
    })
  } catch (error) {
    console.error("❌ Register API error:", error)

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

      return NextResponse.json(
        {
          error: "Server error",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Server error",
        details: "Unknown error during registration",
      },
      { status: 500 },
    )
  }
}
