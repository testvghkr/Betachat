"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Zap, MessageCircle, Palette, FileText, Settings, Gamepad2 } from "lucide-react"

export default function VersionSelectPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleVersionSelect = async (isBeta: boolean) => {
    setLoading(true)

    try {
      // Save beta preference
      await fetch("/api/beta-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beta_enabled: isBeta }),
      })

      if (isBeta) {
        router.push("/beta/chats")
      } else {
        router.push("/chat")
      }
    } catch (error) {
      console.error("Failed to save version preference:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-purple-900 mb-4">Welkom bij AI Chat</h1>
            <p className="text-xl text-purple-600 mb-2">Hallo {user?.name}!</p>
            <p className="text-purple-500">Kies je ervaring</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Original Version */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-purple-900">Origineel</CardTitle>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full">
                    Stabiel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-purple-600">De vertrouwde AI Chat ervaring met alle basis functionaliteiten.</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    <span className="text-purple-700">Klassieke chat interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <span className="text-purple-700">Notities en documenten</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Gamepad2 className="w-5 h-5 text-purple-500" />
                    <span className="text-purple-700">Mini games</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-purple-500" />
                    <span className="text-purple-700">Basis instellingen</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleVersionSelect(false)}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl font-medium shadow-lg"
                >
                  Kies Origineel
                </Button>
              </CardContent>
            </Card>

            {/* Beta Version */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white">Beta</CardTitle>
                  <Badge className="bg-white/20 text-white rounded-full border-white/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nieuw
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-purple-100">
                  Ervaar de toekomst van AI Chat met Material 3 Expressive design en geavanceerde functies.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-purple-200" />
                    <span className="text-purple-100">Material 3 Expressive UI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-200" />
                    <span className="text-purple-100">Geavanceerde AI functies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-200" />
                    <span className="text-purple-100">Bestand upload & download</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-200" />
                    <span className="text-purple-100">Slimme chat organisatie</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleVersionSelect(true)}
                  disabled={loading}
                  className="w-full h-12 bg-white text-purple-600 hover:bg-purple-50 rounded-2xl font-medium shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Probeer Beta
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-purple-500 text-sm">Je kunt altijd wisselen tussen versies in de instellingen</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </AuthGuard>
  )
}
