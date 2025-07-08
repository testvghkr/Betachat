import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const chatId = formData.get("chatId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filepath = join(uploadDir, filename)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Save file info to database
    const fileRecord = await prisma.$queryRaw`
      INSERT INTO chat_files (user_id, chat_id, filename, file_path, file_type, file_size)
      VALUES (${userId}, ${chatId}, ${file.name}, ${`/uploads/${filename}`}, ${file.type}, ${file.size})
      RETURNING id, filename, file_path, file_type, file_size
    `

    return NextResponse.json({
      success: true,
      file: Array.isArray(fileRecord) ? fileRecord[0] : fileRecord,
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
