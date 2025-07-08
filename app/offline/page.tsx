"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
        <CardHeader className="text-center">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={80} height={50} className="object-contain mx-auto mb-4" />
          <CardTitle className="text-white flex items-center justify-center">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 mr-2 text-green-500" />
                Verbinding Hersteld
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 mr-2 text-red-500" />
                Geen Internetverbinding
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isOnline ? (
            <>
              <p className="text-green-300">
                Je internetverbinding is hersteld! Je kunt nu weer volledig gebruik maken van QRP.
              </p>
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Opnieuw Laden
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-300 mb-4">QRP werkt beperkt offline. Je kunt:</p>

              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Bestaande chats bekijken
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Account instellingen wijzigen
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Code downloaden uit eerdere chats
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 p-3 rounded mt-4">
                <p className="text-yellow-200 text-sm">⚠️ Nieuwe berichten versturen vereist een internetverbinding</p>
              </div>

              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Verbinding Controleren
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
