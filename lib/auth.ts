import bcrypt from "bcryptjs"
import { prisma } from "./db"

export async function hashPassword(password: string): Promise<string> {
  try {
    console.log("🔄 Hashing password...")
    const hash = await bcrypt.hash(password, 12)
    console.log("✅ Password hashed successfully")
    return hash
  } catch (error) {
    console.error("❌ Password hashing failed:", error)
    throw new Error("Password hashing failed")
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    console.log("🔄 Verifying password...")
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log(isValid ? "✅ Password verified" : "❌ Password invalid")
    return isValid
  } catch (error) {
    console.error("❌ Password verification error:", error)
    return false
  }
}

export async function createUser(email: string, name: string, password: string) {
  console.log("🔄 Creating user:", email, name)

  try {
    // Check if user already exists
    console.log("🔄 Checking if user exists...")
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("❌ User already exists")
      throw new Error("User already exists")
    }

    console.log("🔄 Hashing password...")
    const hashedPassword = await hashPassword(password)

    console.log("🔄 Creating user in database...")
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    console.log("✅ User created successfully:", user.id)
    return user
  } catch (error) {
    console.error("❌ User creation error:", error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string) {
  console.log("🔄 Authenticating user:", email)

  try {
    console.log("🔄 Finding user in database...")
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("❌ User not found")
      return null
    }

    console.log("✅ User found, verifying password...")
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.log("❌ Invalid password")
      return null
    }

    console.log("✅ Authentication successful")
    return user
  } catch (error) {
    console.error("❌ Authentication error:", error)
    return null
  }
}
