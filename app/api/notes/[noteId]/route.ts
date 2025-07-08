import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, color } = await request.json()
    const noteId = params.noteId

    const result = await prisma.$queryRaw`
      UPDATE notes 
      SET title = ${title}, content = ${content}, color = ${color}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(noteId)} AND user_id = ${userId}
      RETURNING *
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Note update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth-token")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const noteId = params.noteId

    await prisma.$executeRaw`
      DELETE FROM notes 
      WHERE id = ${Number.parseInt(noteId)} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Note deletion error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
