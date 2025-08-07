import { type NextRequest, NextResponse } from "next/server"
import { prisma, sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  console.log("=== DATABASE ADMIN API CALLED ===")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connected")

    // Example: Get table names
    const tables = await sql`
      SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
    `;

    // Get comprehensive stats
    const [userCount, chatCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.chat.count(),
      prisma.message.count(),
    ])

    // Get recent users (without passwords)
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            chats: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get recent chats
    const recentChats = await prisma.chat.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      message: "Database is working perfectly!",
      stats: {
        users: userCount,
        chats: chatCount,
        messages: messageCount,
      },
      recentUsers,
      recentChats,
      tables: tables.map(t => t.tablename),
      database_url: process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database admin error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
        database_url: process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  console.log("=== DATABASE RESET API CALLED ===")

  try {
    const { action } = await request.json()

    if (action === "reset") {
      console.log("🔄 Resetting database...")

      // Delete all data in correct order (due to foreign keys)
      await prisma.message.deleteMany()
      await prisma.chat.deleteMany()
      await prisma.user.deleteMany()

      console.log("✅ Database reset complete")

      return NextResponse.json({
        success: true,
        message: "Database reset successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("❌ Database reset error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Reset failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
