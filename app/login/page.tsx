"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Sparkles, Shield, Zap } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/version-select")
      } else {
        setError("Ongeldige inloggegevens")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      })

      if (response.ok) {
        const success = await login(email, password)
        if (success) {
          router.push("/version-select")
        }
      } else {
        const data = await response.json()
        setError(data.error || "Registratie mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/guest", { method: "POST" })
      if (response.ok) {
        router.push("/version-select")
      }
    } catch (error) {
      setError("Gastmodus mislukt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-purple-900 mb-2">AI Chat</h1>
          <p className="text-purple-600">Welkom bij de toekomst van conversatie</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-purple-900">Aan de slag</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-2xl p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Inloggen
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Registreren
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email adres"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Wachtwoord"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl font-medium shadow-lg"
                  >
                    {loading ? "Bezig..." : "Inloggen"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Volledige naam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email adres"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Bevestig wachtwoord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-2xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl font-medium shadow-lg"
                  >
                    {loading ? "Bezig..." : "Account aanmaken"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-purple-100">
              <Button
                onClick={handleGuest}
                disabled={loading}
                variant="outline"
                className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-2xl font-medium bg-transparent"
              >
                <Zap className="w-4 h-4 mr-2" />
                Gastmodus (tijdelijk)
              </Button>
            </div>

            {/* Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-purple-600">
                <Sparkles className="w-4 h-4" />
                <span>AI-powered conversaties</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-purple-600">
                <Shield className="w-4 h-4" />
                <span>Veilig en privé</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-purple-600">
                <MessageCircle className="w-4 h-4" />
                <span>Material 3 Expressive design</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
