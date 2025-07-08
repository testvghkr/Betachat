"use client"

import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [saveChats, setSaveChats] = useState(true)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isLogin) {
        // Login
        console.log("Attempting login...")
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        console.log("Login response status:", response.status)
        const data = await response.json()
        console.log("Login response data:", data)

        if (response.ok && data.success) {
          setSuccess("Succesvol ingelogd! Doorverwijzen...")
          console.log("Login successful, redirecting...")

          // Korte timeout voor betere UX
          setTimeout(() => {
            window.location.href = "/chat"
          }, 1000)
        } else {
          setError(data.error || "Login failed")
        }
      } else {
        // Register
        if (password !== confirmPassword) {
          setError("Wachtwoorden komen niet overeen")
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError("Wachtwoord moet minimaal 6 karakters zijn")
          setLoading(false)
          return
        }

        console.log("Attempting registration...")
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            password,
          }),
        })

        console.log("Register response status:", response.status)
        const data = await response.json()
        console.log("Register response data:", data)

        if (response.ok && data.success) {
          setSuccess("Account succesvol aangemaakt! Doorverwijzen...")
          console.log("Registration successful, redirecting...")

          // Korte timeout voor betere UX
          setTimeout(() => {
            window.location.href = "/chat"
          }, 1000)
        } else {
          if (data.details) {
            setError(`${data.error}: ${data.details}`)
          } else {
            setError(data.error || "Registratie mislukt")
          }
        }
      }
    } catch (error) {
      console.error("Request error:", error)
      setError("Er is een netwerkfout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    console.log("Attempting guest login...")

    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      console.log("Guest response status:", response.status)
      const data = await response.json()
      console.log("Guest response data:", data)

      if (response.ok && data.success) {
        setSuccess("Gastmodus geactiveerd! Doorverwijzen...")
        console.log("Guest login successful, redirecting...")

        // Korte timeout voor betere UX
        setTimeout(() => {
          window.location.href = "/chat"
        }, 1000)
      } else {
        setError("Gastmodus mislukt")
      }
    } catch (error) {
      console.error("Guest error:", error)
      setError("Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="text-center mb-6">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">Welkom bij QRP</h1>
          <p className="text-orange-400 text-sm mt-2">🚀 v2.0 is nu live!</p>
        </div>

        {/* Tab buttons */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l transition-colors ${
              isLogin
                ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Inloggen
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r transition-colors ${
              !isLogin
                ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Registreren
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">{error}</div>}
        {success && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email adres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Volledige naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
            />
          )}

          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Bevestig wachtwoord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
            />
          )}

          {/* Chat opslaan keuze */}
          <div className="bg-gray-700 p-3 rounded border border-gray-600">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={saveChats}
                onChange={(e) => setSaveChats(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
              />
              <span className="text-white text-sm">💾 Chats opslaan en synchroniseren tussen apparaten</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              {saveChats
                ? "Je chats worden veilig opgeslagen en zijn beschikbaar op al je apparaten"
                : "Je chats worden alleen lokaal opgeslagen en niet gesynchroniseerd"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 rounded text-white font-medium disabled:opacity-50 transition-all"
          >
            {loading ? "Bezig..." : isLogin ? "Inloggen" : "Account aanmaken"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full p-3 bg-transparent border border-gray-600 hover:border-orange-500 rounded text-gray-300 hover:text-white font-medium disabled:opacity-50 transition-all"
          >
            🚀 Zonder account verdergaan (tijdelijk)
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Chats worden niet opgeslagen en verdwijnen na sluiten browser
          </p>
        </div>

        <div className="mt-4 text-xs text-center">
          <p className="text-orange-400">🎉 QRP v2.0 Launch Special</p>
          <p className="text-gray-500">Geen email verificatie nodig • Direct aan de slag</p>
        </div>
      </div>
    </div>
  )
}
