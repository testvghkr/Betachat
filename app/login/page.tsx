"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register form
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        router.push("/")
      } else {
        setError(data.error || "Inloggen mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (registerPassword !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      setIsLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters zijn")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Account succesvol aangemaakt!")
        login(data.user)
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setError(data.error || "Registratie mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        router.push("/")
      } else {
        setError("Gastmodus mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md md-card">
        <CardHeader className="text-center">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="mx-auto mb-4" />
          <CardTitle className="md-headline-small">Welkom bij QRP Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Inloggen</TabsTrigger>
              <TabsTrigger value="register">Registreren</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="md-input"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wachtwoord"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="md-input pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button type="submit" className="w-full md-filled-button" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Inloggen
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Naam"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="md-input"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="md-input"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wachtwoord"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="md-input pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Bevestig wachtwoord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="md-input"
                  />
                </div>
                <Button type="submit" className="w-full md-filled-button" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Registreren
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Of</span>
              </div>
            </div>
            
            <Button 
              onClick={handleGuestLogin} 
              variant="outline" 
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Doorgaan als gast
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
