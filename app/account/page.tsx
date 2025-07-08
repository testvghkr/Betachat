"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Lock, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Loading states
  const [updateLoading, setUpdateLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setName(userData.name || "")
        setEmail(userData.email || "")

        if (userData.isGuest) {
          window.location.href = "/login"
          return
        }
      } else {
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Auth check error:", error)
      window.location.href = "/login"
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Profiel succesvol bijgewerkt!")
        setUser({ ...user, name, email })
      } else {
        setError(data.error || "Profiel update mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setUpdateLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen")
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Nieuw wachtwoord moet minimaal 6 karakters zijn")
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Wachtwoord succesvol gewijzigd!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(data.error || "Wachtwoord wijziging mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setPasswordLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
      return
    }

    if (!confirm("Dit zal al je chats en gegevens permanent verwijderen. Weet je het zeker?")) {
      return
    }

    setDeleteLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Account succesvol verwijderd")
        window.location.href = "/login"
      } else {
        const data = await response.json()
        setError(data.error || "Account verwijdering mislukt")
      }
    } catch (error) {
      setError("Er is een fout opgetreden")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
          <div className="text-white text-lg">Laden...</div>
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Image src="/qrp-logo.png" alt="QRP Logo" width={60} height={40} className="object-contain mr-4" />
          <div>
            <h1 className="text-white text-2xl font-bold">Account Instellingen</h1>
            <p className="text-gray-400">Beheer je QRP v2.0 account</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">{error}</div>}
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg text-green-200">{success}</div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profiel Informatie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Naam</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                >
                  {updateLoading ? "Bijwerken..." : "Profiel Bijwerken"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Statistieken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account aangemaakt:</span>
                  <span className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("nl-NL") : "Onbekend"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Laatste login:</span>
                  <span className="text-white">Vandaag</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account type:</span>
                  <span className="text-orange-400">QRP v2.0 Gebruiker</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">✅ Actief</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-gray-800 border-gray-700 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Wachtwoord Wijzigen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Huidig Wachtwoord</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nieuw Wachtwoord</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bevestig Nieuw Wachtwoord</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <Button type="submit" disabled={passwordLoading} className="bg-blue-600 hover:bg-blue-700">
                  {passwordLoading ? "Wijzigen..." : "Wachtwoord Wijzigen"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="bg-red-900/20 border-red-700 mt-6">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Gevaarlijke Acties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt. Al je chats en gegevens
                zullen verloren gaan.
              </p>
              <Button
                onClick={deleteAccount}
                disabled={deleteLoading}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteLoading ? "Verwijderen..." : "Account Verwijderen"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
