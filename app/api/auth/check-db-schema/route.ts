import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  console.log("=== CHECK DB SCHEMA API CALLED ===")

  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connected")

    // Check if security question columns exist
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND table_schema = 'public'
      AND column_name IN ('securityQuestion', 'securityAnswer')
      ORDER BY column_name;
    `

    // Check if we can create a test user with security question
    let testUserResult = null
    try {
      const testEmail = `test_schema_${Date.now()}@example.com`
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: "Test Schema User",
          password: "test_password_hash",
          securityQuestion: "Test Question",
          securityAnswer: "Test Answer",
        },
      })

      // Delete the test user immediately
      await prisma.user.delete({
        where: { id: testUser.id },
      })

      testUserResult = "✅ Test user creation successful"
    } catch (error) {
      testUserResult = `❌ Test user creation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    }

    return NextResponse.json({
      success: true,
      message: "Database schema check completed",
      securityColumns: result,
      testUserResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database schema check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database schema check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
