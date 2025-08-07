import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QRP Chat - AI Assistant",
  description: "Een vriendelijke Nederlandse AI-assistent voor al je vragen",
  manifest: "/manifest.json",
  themeColor: "#6750a4",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6750a4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QRP Chat" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
