import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  console.log("=== UPLOAD API CALLED ===")

  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      console.log("No file received")
      return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 })
    }

    console.log("File received:", file.name, file.type, file.size)

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large:", file.size)
      return NextResponse.json({ error: "Bestand is te groot (max 10MB)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create safe filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${safeName}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadsDir)) {
      console.log("Creating uploads directory...")
      await mkdir(uploadsDir, { recursive: true })
    }

    const filePath = join(uploadsDir, filename)
    console.log("Writing file to:", filePath)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${filename}`
    console.log("File saved successfully, URL:", publicUrl)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload mislukt",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
