import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== DOWNLOAD CODE API CALLED ===")

  try {
    const { code, filename, language } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Geen code ontvangen" }, { status: 400 })
    }

    console.log("Generating download for:", filename, language)

    // Determine file extension based on language
    let extension = "txt"
    let mimeType = "text/plain"

    switch (language?.toLowerCase()) {
      case "javascript":
      case "js":
        extension = "js"
        mimeType = "application/javascript"
        break
      case "typescript":
      case "ts":
        extension = "ts"
        mimeType = "application/typescript"
        break
      case "python":
      case "py":
        extension = "py"
        mimeType = "text/x-python"
        break
      case "html":
        extension = "html"
        mimeType = "text/html"
        break
      case "css":
        extension = "css"
        mimeType = "text/css"
        break
      case "json":
        extension = "json"
        mimeType = "application/json"
        break
      case "sql":
        extension = "sql"
        mimeType = "application/sql"
        break
      case "java":
        extension = "java"
        mimeType = "text/x-java-source"
        break
      case "cpp":
      case "c++":
        extension = "cpp"
        mimeType = "text/x-c++src"
        break
      case "c":
        extension = "c"
        mimeType = "text/x-csrc"
        break
      default:
        extension = "txt"
        mimeType = "text/plain"
    }

    const finalFilename = filename || `qrp-code.${extension}`

    console.log("Download prepared:", finalFilename, mimeType)

    return new NextResponse(code, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Download code error:", error)
    return NextResponse.json({ error: "Download mislukt" }, { status: 500 })
  }
}
