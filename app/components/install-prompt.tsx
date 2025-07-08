"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from "lucide-react"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem("qrp-install-prompt-seen")
        if (!hasSeenPrompt) {
          setShowPrompt(true)
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
    } catch (error) {
      console.error("Error during installation:", error)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
    localStorage.setItem("qrp-install-prompt-seen", "true")
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("qrp-install-prompt-seen", "true")
  }

  const handleManualInstall = () => {
    setShowPrompt(true)
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  return (
    <>
      {/* Install button in header (always visible) */}
      <Button
        onClick={handleManualInstall}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-gray-700 hidden md:flex"
        title="Installeer QRP als app"
      >
        <Download className="w-4 h-4 mr-2" />
        App Installeren
      </Button>

      {/* Install prompt modal */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full relative">
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <Image
                src="/qrp-logo.png"
                alt="QRP Logo"
                width={80}
                height={50}
                className="object-contain mx-auto mb-4"
              />

              <h3 className="text-white text-xl font-bold mb-2">📱 Installeer QRP als App</h3>
              <p className="text-gray-300 text-sm mb-6">
                Krijg de beste ervaring met QRP door het te installeren als app op je apparaat!
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <Smartphone className="w-4 h-4 mr-2 text-orange-400" />
                  <span>Snellere toegang vanaf je startscherm</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Smartphone className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Werkt offline (na eerste login)</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Smartphone className="w-4 h-4 mr-2 text-orange-400" />
                  <span>Geen browser balk - meer ruimte</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Smartphone className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Native app ervaring</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Misschien Later
                </Button>
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Installeren
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">Gratis • Geen extra downloads • Werkt op alle apparaten</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
