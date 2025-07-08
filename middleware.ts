import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // Sta directe toegang tot chat toe, auth check gebeurt in de component
  if (pathname === "/" || pathname === "/chat") {
    return NextResponse.next()
  }

  if (pathname.startsWith("/chat") && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|qrp-logo.png|icon-192.png|icon-512.png|manifest.json|sw.js).*)",
  ],
}
