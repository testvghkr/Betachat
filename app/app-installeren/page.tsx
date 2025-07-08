"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  Smartphone,
  Monitor,
  Chrome,
  AppleIcon as Safari,
  ChromeIcon as Firefox,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function AppInstallerenPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [browserType, setBrowserType] = useState<string>("")
  const [deviceType, setDeviceType] = useState<string>("")

  useEffect(() => {
    // Detect browser and device
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes("chrome")) setBrowserType("chrome")
    else if (userAgent.includes("firefox")) setBrowserType("firefox")
    else if (userAgent.includes("safari")) setBrowserType("safari")
    else setBrowserType("other")

    if (userAgent.includes("mobile") || userAgent.includes("android")) setDeviceType("mobile")
    else if (userAgent.includes("ipad") || userAgent.includes("iphone")) setDeviceType("ios")
    else setDeviceType("desktop")

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  const handleInstallNow = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstalled(true)
      }
    } catch (error) {
      console.error("Installation failed:", error)
    }

    setDeferredPrompt(null)
  }

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/chat">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-white text-2xl font-bold">App Geïnstalleerd! 🎉</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Image
                src="/qrp-logo.png"
                alt="QRP Logo"
                width={100}
                height={60}
                className="object-contain mx-auto mb-6"
              />

              <h2 className="text-white text-xl font-bold mb-4">QRP is succesvol geïnstalleerd!</h2>
              <p className="text-gray-300 mb-6">
                Je kunt QRP nu vinden op je startscherm en gebruiken als een native app.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-green-400">✅ Snellere laadtijden</div>
                <div className="flex items-center justify-center text-green-400">✅ Offline functionaliteit</div>
                <div className="flex items-center justify-center text-green-400">✅ Native app ervaring</div>
                <div className="flex items-center justify-center text-green-400">✅ Geen browser balk</div>
              </div>

              <Link href="/chat">
                <Button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
                  Terug naar Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
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
          <div>
            <h1 className="text-white text-2xl font-bold">📱 QRP als App Installeren</h1>
            <p className="text-gray-400">Krijg de beste ervaring met QRP op je apparaat</p>
          </div>
        </div>

        {/* Quick Install Button */}
        {deferredPrompt && (
          <Card className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 border-orange-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold mb-2">🚀 Snelle Installatie Beschikbaar!</h3>
                  <p className="text-gray-300 text-sm">Je browser ondersteunt directe app installatie</p>
                </div>
                <Button
                  onClick={handleInstallNow}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Nu Installeren
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">✨ Voordelen van de QRP App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-orange-400">
                  <Smartphone className="w-5 h-5 mr-3" />
                  <span>Snellere toegang vanaf startscherm</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Monitor className="w-5 h-5 mr-3" />
                  <span>Native app ervaring</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-orange-400">
                  <Download className="w-5 h-5 mr-3" />
                  <span>Werkt offline (beperkt)</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Chrome className="w-5 h-5 mr-3" />
                  <span>Geen browser balk - meer ruimte</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <Tabs defaultValue={deviceType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="desktop" className="data-[state=active]:bg-gray-700">
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="data-[state=active]:bg-gray-700">
              <Smartphone className="w-4 h-4 mr-2" />
              Android
            </TabsTrigger>
            <TabsTrigger value="ios" className="data-[state=active]:bg-gray-700">
              <Safari className="w-4 h-4 mr-2" />
              iPhone/iPad
            </TabsTrigger>
          </TabsList>

          {/* Desktop Instructions */}
          <TabsContent value="desktop" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Chrome className="w-5 h-5 mr-2" />
                  Google Chrome (Aanbevolen)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Zoek naar het installatie icoon</p>
                      <p className="text-gray-400 text-sm">In de adresbalk zie je een download/installatie icoon</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Klik op "Installeren"</p>
                      <p className="text-gray-400 text-sm">Of gebruik Ctrl+Shift+A (Windows) / Cmd+Shift+A (Mac)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Bevestig installatie</p>
                      <p className="text-gray-400 text-sm">QRP wordt toegevoegd aan je apps en startmenu</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 p-3 rounded">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Tip:</strong> Je kunt QRP ook installeren via Chrome menu → "QRP installeren"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Firefox className="w-5 h-5 mr-2" />
                  Firefox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Menu → "Deze site installeren"</p>
                      <p className="text-gray-400 text-sm">Klik op het hamburger menu (☰) rechtsboven</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Selecteer "Installeren"</p>
                      <p className="text-gray-400 text-sm">Bevestig de installatie in het popup venster</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Android Instructions */}
          <TabsContent value="mobile" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Chrome className="w-5 h-5 mr-2" />
                  Chrome (Android)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Tik op de drie puntjes (⋮)</p>
                      <p className="text-gray-400 text-sm">Rechtsboven in je browser</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Selecteer "App installeren"</p>
                      <p className="text-gray-400 text-sm">Of "Toevoegen aan startscherm"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Tik op "Installeren"</p>
                      <p className="text-gray-400 text-sm">QRP verschijnt nu op je startscherm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-700 p-3 rounded">
                  <p className="text-green-200 text-sm">
                    ✅ <strong>Automatisch:</strong> Je krijgt mogelijk ook een installatie banner onderaan je scherm
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* iOS Instructions */}
          <TabsContent value="ios" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Safari className="w-5 h-5 mr-2" />
                  Safari (iPhone/iPad)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Tik op het deel icoon</p>
                      <p className="text-gray-400 text-sm">Het vierkantje met pijl omhoog onderaan je scherm</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Scroll naar "Zet op beginscherm"</p>
                      <p className="text-gray-400 text-sm">In het deel menu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Tik op "Voeg toe"</p>
                      <p className="text-gray-400 text-sm">QRP wordt toegevoegd aan je beginscherm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700 p-3 rounded">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ <strong>Let op:</strong> Gebruik Safari voor de beste ervaring op iOS apparaten
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Troubleshooting */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">🔧 Problemen met installeren?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-gray-300">
              <p className="font-medium mb-2">Veelvoorkomende oplossingen:</p>
              <ul className="space-y-1 text-sm">
                <li>• Zorg dat je de nieuwste versie van je browser gebruikt</li>
                <li>• Probeer de pagina te verversen (F5 of Ctrl+R)</li>
                <li>• Controleer of je voldoende opslagruimte hebt</li>
                <li>• Sommige browsers ondersteunen PWA installatie niet in incognito modus</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <p className="text-white text-sm">
                <strong>Nog steeds problemen?</strong> Je kunt QRP altijd gebruiken via je browser. Voeg een bladwijzer
                toe voor snelle toegang!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Chat */}
        <div className="text-center mt-8">
          <Link href="/chat">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Terug naar Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
