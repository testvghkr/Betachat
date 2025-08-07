"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Home, ArrowLeft, Settings, Sparkles, Save, Bell, Palette, Globe, Keyboard } from "lucide-react"
import Link from "next/link"

interface UserSettings {
  beta_enabled: boolean
  enter_to_send: boolean
  theme: string
  language: string
  notifications_enabled: boolean
}

export default function BetaSettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    beta_enabled: false,
    enter_to_send: true,
    theme: "system",
    language: "nl",
    notifications_enabled: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/beta-settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/beta-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        setSaveMessage("Instellingen opgeslagen!")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveMessage("Fout bij opslaan")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveSettings({ [key]: value })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Instellingen laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <Link href="/beta/chats">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Terug</span>
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 border-purple-400/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              <h1 className="text-xl font-bold text-white">Instellingen</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <Save className="h-4 w-4 text-green-300" />
              <span className="text-green-100">{saveMessage}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {/* Beta Features */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
                Beta Functies
              </CardTitle>
              <CardDescription className="text-white/60">
                Experimentele functies en nieuwe mogelijkheden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white font-medium">Beta Modus</Label>
                  <p className="text-sm text-white/60">Krijg toegang tot de nieuwste functies en verbeteringen</p>
                </div>
                <Switch
                  checked={settings.beta_enabled}
                  onCheckedChange={(checked) => updateSetting("beta_enabled", checked)}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chat Settings */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Keyboard className="h-5 w-5 mr-2 text-purple-300" />
                Chat Instellingen
              </CardTitle>
              <CardDescription className="text-white/60">Pas je chat ervaring aan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white font-medium">Enter om te verzenden</Label>
                  <p className="text-sm text-white/60">
                    Druk op Enter om berichten te verzenden (Shift+Enter voor nieuwe regel)
                  </p>
                </div>
                <Switch
                  checked={settings.enter_to_send}
                  onCheckedChange={(checked) => updateSetting("enter_to_send", checked)}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="h-5 w-5 mr-2 text-purple-300" />
                Uiterlijk
              </CardTitle>
              <CardDescription className="text-white/60">Personaliseer het uiterlijk van de app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white font-medium">Thema</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => updateSetting("theme", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="light" className="text-white hover:bg-gray-800">
                      Licht
                    </SelectItem>
                    <SelectItem value="dark" className="text-white hover:bg-gray-800">
                      Donker
                    </SelectItem>
                    <SelectItem value="system" className="text-white hover:bg-gray-800">
                      Systeem
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-300" />
                Taal & Regio
              </CardTitle>
              <CardDescription className="text-white/60">
                Kies je voorkeurstaal en regionale instellingen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white font-medium">Taal</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting("language", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="nl" className="text-white hover:bg-gray-800">
                      Nederlands
                    </SelectItem>
                    <SelectItem value="en" className="text-white hover:bg-gray-800">
                      English
                    </SelectItem>
                    <SelectItem value="de" className="text-white hover:bg-gray-800">
                      Deutsch
                    </SelectItem>
                    <SelectItem value="fr" className="text-white hover:bg-gray-800">
                      Français
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-purple-300" />
                Notificaties
              </CardTitle>
              <CardDescription className="text-white/60">Beheer je notificatie voorkeuren</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white font-medium">Push Notificaties</Label>
                  <p className="text-sm text-white/60">Ontvang meldingen voor nieuwe berichten en updates</p>
                </div>
                <Switch
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => updateSetting("notifications_enabled", checked)}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-300" />
                Over QRP Beta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white/80">
                <p>QRP Beta v2.0 - Je vriendelijke AI-assistent met Material 3 Expressive design</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 border-purple-400/30">
                    Material 3
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                    Glassmorphism
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30">
                    Responsive
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-100 border-orange-400/30">
                    PWA Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
