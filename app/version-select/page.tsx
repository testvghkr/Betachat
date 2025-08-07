"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageCircle, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function VersionSelect() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleVersionSelect = async (version: "beta" | "original") => {
    setIsLoading(true)

    try {
      if (version === "beta") {
        // Save beta preference
        await fetch("/api/beta-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ betaEnabled: true }),
        })
        router.push("/beta/chats")
      } else {
        // Save original preference
        await fetch("/api/beta-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ betaEnabled: false }),
        })
        router.push("/chat")
      }
    } catch (error) {
      console.error("Error saving version preference:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header with Home Button */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-purple-200/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100/50"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <h1 className="text-lg font-semibold text-purple-900">Kies je versie</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">Welkom bij AI Chat</h2>
          <p className="text-purple-600 text-lg">Kies de versie die het beste bij je past</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Original Version */}
          <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  Origineel
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  Stabiel
                </Badge>
              </div>
              <CardDescription className="text-purple-600">De vertrouwde AI Chat ervaring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-purple-900">Functies:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Betrouwbare AI gesprekken</li>
                  <li>• Bewezen interface</li>
                  <li>• Alle basis functies</li>
                  <li>• Stabiele prestaties</li>
                </ul>
              </div>

              <Button
                onClick={() => handleVersionSelect("original")}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Laden..." : "Kies Origineel"}
              </Button>
            </CardContent>
          </Card>

          {/* Beta Version */}
          <Card className="relative overflow-hidden border-2 border-purple-400 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/50 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-bl-3xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Beta
                </CardTitle>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Nieuw!</Badge>
              </div>
              <CardDescription className="text-purple-600">
                Material 3 Expressive design met nieuwe functies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-purple-900">Nieuwe functies:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Material 3 Expressive design</li>
                  <li>• Verbeterde chat kaarten</li>
                  <li>• Bestand upload/download</li>
                  <li>• AI-gegenereerde beschrijvingen</li>
                  <li>• Geavanceerde instellingen</li>
                </ul>
              </div>

              <Button
                onClick={() => handleVersionSelect("beta")}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Laden..." : "Probeer Beta"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-purple-600">Je kunt altijd wisselen tussen versies in de instellingen</p>
        </div>
      </div>
    </div>
  )
}
