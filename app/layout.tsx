import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QRP Chatbot",
  description: "Jouw vriendelijke AI-assistent",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
  themeColor: "#6750A4",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
