import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  console.log("=== DATABASE TEST API CALLED ===")

  try {
    // Test database connection
    console.log("Testing database connection...")
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // Test user table
    console.log("Testing User table...")
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible, ${userCount} users found`)

    // Test chat table
    console.log("Testing Chat table...")
    const chatCount = await prisma.chat.count()
    console.log(`✅ Chat table accessible, ${chatCount} chats found`)

    // Test message table
    console.log("Testing Message table...")
    const messageCount = await prisma.message.count()
    console.log(`✅ Message table accessible, ${messageCount} messages found`)

    return NextResponse.json({
      success: true,
      message: "Database is working correctly!",
      stats: {
        users: userCount,
        chats: chatCount,
        messages: messageCount,
      },
      database_url: process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing",
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        database_url: process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing",
      },
      { status: 500 },
    )
  }
}
