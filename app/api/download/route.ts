import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, filename, language } = await request.json()

    const fileExtension =
      language === "javascript" ? "js" : language === "typescript" ? "ts" : language === "python" ? "py" : "txt"

    const finalFilename = filename || `qrp-code.${fileExtension}`

    return new NextResponse(code, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
