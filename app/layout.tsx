import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QRP Chatbot",
  description: "Je vriendelijke AI-assistent",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
  themeColor: "#6750a4", // QRP Purple
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className={cn(inter.className, "antialiased")}>
        {children}
      </body>
    </html>
  )
}
