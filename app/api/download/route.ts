import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get("fileUrl")
  const fileName = searchParams.get("fileName")

  if (!fileUrl || !fileName) {
    return NextResponse.json({ error: "Missing fileUrl or fileName" }, { status: 400 })
  }

  try {
    // Direct fetch without getBlobUrl since it doesn't exist
    const response = await fetch(fileUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", blob.type)
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`)
    headers.set("Content-Length", blob.size.toString())

    return new NextResponse(blob, { headers })
  } catch (error: any) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: error.message || "Failed to download file" }, { status: 500 })
  }
}
