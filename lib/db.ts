import { PrismaClient } from "@prisma/client"

// Voorkom meerdere instanties in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Test database connection
async function testConnection() {
  try {
    console.log("🔄 Testing database connection...")
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Test if tables exist
    try {
      await prisma.user.findFirst()
      console.log("✅ User table accessible")
    } catch (error) {
      console.error("❌ User table not accessible:", error)
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.log("💡 Make sure your DATABASE_URL is set correctly")
    console.log("💡 Run the database setup script first")
  }
}

// Run test in development
if (process.env.NODE_ENV === "development") {
  testConnection()
}
