"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Palette, Bell, Shield, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

interface AppSettings {
  theme: string
  language: string
  notifications: boolean
  autoSave: boolean
  animations: boolean
  soundEffects: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    language: "nl",
    notifications: true,
    autoSave: true,
    animations: true,
    soundEffects: false,
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user && !user.isGuest) {
      loadSettingsFromDB()
    } else {
      loadSettingsFromLocal()
    }
  }, [user])

  const loadSettingsFromDB = async () => {
    try {
      const response = await fetch("/api/app-settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const loadSettingsFromLocal = () => {
    const savedSettings = localStorage.getItem("qrp-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    if (user?.isGuest) {
      localStorage.setItem("qrp-settings", JSON.stringify(newSettings))
    } else {
      try {
        await fetch("/api/app-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSettings),
        })
      } catch (error) {
        console.error("Failed to save settings:", error)
      }
    }
  }

  const resetSettings = () => {
    if (confirm("Weet je zeker dat je alle instellingen wilt resetten?")) {
      const defaultSettings: AppSettings = {
        theme: "dark",
        language: "nl",
        notifications: true,
        autoSave: true,
        animations: true,
        soundEffects: false,
      }
      setSettings(defaultSettings)
      localStorage.setItem("qrp-settings", JSON.stringify(defaultSettings))
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center mr-3">
                <span className="text-white text-lg">⚙️</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Instellingen</h1>
                <p className="text-gray-400 text-sm">App voorkeuren en configuratie</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Appearance */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Uiterlijk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Thema</label>
                    <p className="text-gray-400 text-sm">Kies je favoriete kleurenschema</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="dark" className="text-white">
                        🌙 Donker
                      </SelectItem>
                      <SelectItem value="light" className="text-white">
                        ☀️ Licht
                      </SelectItem>
                      <SelectItem value="auto" className="text-white">
                        🔄 Auto
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Animaties</label>
                    <p className="text-gray-400 text-sm">Schakel interface animaties in/uit</p>
                  </div>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => updateSetting("animations", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">🌍 Taal & Regio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Taal</label>
                    <p className="text-gray-400 text-sm">Interface taal instellen</p>
                  </div>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="nl" className="text-white">
                        🇳🇱 Nederlands
                      </SelectItem>
                      <SelectItem value="en" className="text-white">
                        🇺🇸 English
                      </SelectItem>
                      <SelectItem value="de" className="text-white">
                        🇩🇪 Deutsch
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Meldingen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Push Meldingen</label>
                    <p className="text-gray-400 text-sm">Ontvang meldingen van QRP</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Geluidseffecten</label>
                    <p className="text-gray-400 text-sm">Speel geluid bij acties</p>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => updateSetting("soundEffects", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy & Beveiliging
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Automatisch Opslaan</label>
                    <p className="text-gray-400 text-sm">Sla wijzigingen automatisch op</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                  />
                </div>

                <div className="bg-blue-900/20 border border-blue-700 p-3 rounded">
                  <p className="text-blue-200 text-sm">
                    🔒 <strong>Privacy:</strong> Al je gegevens worden lokaal opgeslagen op je apparaat. QRP deelt geen
                    persoonlijke informatie met derden.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Over QRP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image src="/qrp-logo.png" alt="QRP Logo" width={60} height={40} className="object-contain" />
                  <div>
                    <h3 className="text-white font-medium">QRP v2.0</h3>
                    <p className="text-gray-400 text-sm">AI-powered App Suite</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Versie:</span>
                    <span className="text-white">2.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Build:</span>
                    <span className="text-white">2025.01.09</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Apps:</span>
                    <span className="text-white">8 geïnstalleerd</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500/30 p-3 rounded">
                  <p className="text-orange-200 text-sm">
                    🚀 <strong>Nieuw in v2.0:</strong> Complete app suite, verbeterde AI, Nederlandse ondersteuning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reset Settings */}
            <Card className="bg-red-900/20 border-red-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-red-400 font-medium">Instellingen Resetten</h3>
                    <p className="text-gray-400 text-sm">Herstel alle instellingen naar standaardwaarden</p>
                  </div>
                  <Button onClick={resetSettings} variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
