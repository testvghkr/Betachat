"use client"

import { useState } from "react"

import { useEffect } from "react"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { Clock, Settings, Calculator, Calendar, FileText, Gamepad2, Palette, Code } from "lucide-react"

interface App {
  id: string
  name: string
  icon: React.ReactNode
  href?: string
  comingSoon?: boolean
  color: string
  description: string
}

export default function PhoneHomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/version-select")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }))
      setCurrentDate(
        now.toLocaleDateString("nl-NL", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const apps: App[] = [
    {
      id: "qrp",
      name: "QRP v2.0",
      icon: <Image src="/qrp-logo.png" alt="QRP" width={40} height={40} className="object-contain" />,
      href: "/chat",
      color: "from-orange-500 to-blue-500",
      description: "AI Chatbot met Nederlandse ondersteuning",
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <Calculator className="w-8 h-8 text-white" />,
      href: "/apps/calculator",
      color: "from-gray-600 to-gray-800",
      description: "Geavanceerde rekenmachine met AI-hulp",
    },
    {
      id: "calendar",
      name: "Kalender",
      icon: <Calendar className="w-8 h-8 text-white" />,
      href: "/apps/calendar",
      color: "from-blue-600 to-indigo-600",
      description: "Persoonlijke agenda en planning",
    },
    {
      id: "notes",
      name: "Notities",
      icon: <FileText className="w-8 h-8 text-white" />,
      href: "/apps/notes",
      color: "from-yellow-500 to-orange-500",
      description: "Slimme notities met AI-ondersteuning",
    },
    {
      id: "code-editor",
      name: "Code Editor",
      icon: <Code className="w-8 h-8 text-white" />,
      href: "/apps/code-editor",
      color: "from-green-500 to-teal-500",
      description: "Code schrijven en testen",
    },
    {
      id: "color-palette",
      name: "Kleuren",
      icon: <Palette className="w-8 h-8 text-white" />,
      href: "/apps/color-palette",
      color: "from-pink-500 to-purple-500",
      description: "Kleurenpalet generator",
    },
    {
      id: "games",
      name: "Games",
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      href: "/apps/games",
      color: "from-red-500 to-pink-500",
      description: "Mini games en puzzels",
    },
    {
      id: "settings",
      name: "Instellingen",
      icon: <Settings className="w-8 h-8 text-white" />,
      href: "/apps/settings",
      color: "from-gray-500 to-gray-700",
      description: "App instellingen en voorkeuren",
    },
  ]

  const handleAppClick = (app: App) => {
    if (app.comingSoon) {
      // Show coming soon animation
      const appElement = document.getElementById(`app-${app.id}`)
      if (appElement) {
        appElement.classList.add("animate-pulse")
        setTimeout(() => {
          appElement.classList.remove("animate-pulse")
        }, 1000)
      }
      return
    }

    if (app.href) {
      // Add click animation
      const appElement = document.getElementById(`app-${app.id}`)
      if (appElement) {
        appElement.style.transform = "scale(0.95)"
        setTimeout(() => {
          appElement.style.transform = "scale(1)"
          window.location.href = app.href!
        }, 150)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        {isLoading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
              <div className="absolute bottom-32 left-20 w-28 h-28 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-20 h-20 bg-pink-500 rounded-full blur-2xl"></div>
            </div>

            {/* Phone Container */}
            <div className="min-h-screen max-w-sm mx-auto bg-black relative">
              {/* Status Bar */}
              <div className="bg-black text-white px-6 py-2 flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="ml-2 text-xs">QRP OS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{currentTime}</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-white rounded-sm"></div>
                    <div className="w-1 h-3 bg-white rounded-sm"></div>
                    <div className="w-1 h-3 bg-white rounded-sm"></div>
                    <div className="w-1 h-3 bg-gray-500 rounded-sm"></div>
                  </div>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-4 h-1 bg-green-500 rounded-sm mt-0.5 ml-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen relative">
                {/* Time and Date */}
                <div className="text-center pt-16 pb-8">
                  <div className="text-white text-6xl font-light mb-2">{currentTime}</div>
                  <div className="text-gray-300 text-lg capitalize">{currentDate}</div>
                </div>

                {/* Apps Grid */}
                <div className="px-8 pb-8">
                  <div className="grid grid-cols-4 gap-6">
                    {apps.map((app) => (
                      <div key={app.id} className="flex flex-col items-center space-y-2">
                        <div
                          id={`app-${app.id}`}
                          onClick={() => handleAppClick(app)}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative shadow-lg`}
                          style={{ transition: "transform 0.15s ease" }}
                        >
                          {app.icon}

                          {/* Coming Soon Badge */}
                          {app.comingSoon && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <Clock className="w-2 h-2 text-white" />
                            </div>
                          )}

                          {/* Special QRP Badge */}
                          {app.id === "qrp" && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>

                        <span className="text-white text-xs text-center leading-tight max-w-16 truncate">
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QRP Spotlight */}
                <div className="px-8 mt-8">
                  <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center">
                        <Image src="/qrp-logo.png" alt="QRP" width={24} height={24} className="object-contain" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">QRP OS v2.0</h3>
                        <p className="text-gray-400 text-sm">Complete App Suite</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">
                      Een complete suite van apps met AI-ondersteuning. Van rekenmachine tot code editor - alles wat je
                      nodig hebt!
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-orange-500/20 rounded-full">
                        <span className="text-orange-400 text-xs">🚀 8 Apps</span>
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                        <span className="text-blue-400 text-xs">🤖 AI Powered</span>
                      </div>
                      <div className="px-3 py-1 bg-purple-500/20 rounded-full">
                        <span className="text-purple-400 text-xs">🇳🇱 Nederlands</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Dock */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <div className="flex space-x-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
