"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, MessageSquare, Clock, TrendingUp, User, ArrowRight, Sparkles, Activity } from "lucide-react"
import Link from "next/link"

interface UserActivity {
  id: string
  type: "chat" | "calculation"
  description: string
  timestamp: number
}

interface UserStats {
  totalChats: number
  totalCalculations: number
  timeSpent: number
  lastActive: number
}

export default function AppDashboard() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalChats: 0,
    totalCalculations: 0,
    timeSpent: 0,
    lastActive: Date.now(),
  })

  useEffect(() => {
    if (user) {
      // Load user activities and stats from localStorage
      const savedActivities = localStorage.getItem(`activities_${user.id}`)
      const savedStats = localStorage.getItem(`stats_${user.id}`)

      if (savedActivities) {
        setActivities(JSON.parse(savedActivities))
      }

      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [user])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}u ${mins}m`
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Nu"
    if (minutes < 60) return `${minutes} min geleden`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} uur geleden`
    return `${Math.floor(minutes / 1440)} dagen geleden`
  }

  const isNewUser = activities.length === 0 && stats.totalChats === 0 && stats.totalCalculations === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-4 text-white text-xs font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welkom terug, {user?.name || "Gebruiker"}!</h1>
          </div>
          {isNewUser ? (
            <p className="text-gray-600">🎉 Welkom bij QRP! Begin met chatten of maak je eerste berekening.</p>
          ) : (
            <p className="text-gray-600">Klaar voor een nieuwe AI-sessie? Kies een tool hieronder.</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Chats</p>
                  <p className="text-2xl font-bold">{stats.totalChats}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Berekeningen</p>
                  <p className="text-2xl font-bold">{stats.totalCalculations}</p>
                </div>
                <Calculator className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Tijd Actief</p>
                  <p className="text-2xl font-bold">{formatTime(stats.timeSpent)}</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Laatste Activiteit</p>
                  <p className="text-sm font-medium">{formatRelativeTime(stats.lastActive)}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            AI Tools
          </h2>

          <div className="grid gap-3">
            <Link href="/app/chat">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Chat</h3>
                        <p className="text-sm text-gray-600">
                          {stats.totalChats > 0
                            ? `${stats.totalChats} gesprekken gevoerd`
                            : "Start je eerste gesprek met QRP"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/calculator">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Rekenmachine</h3>
                        <p className="text-sm text-gray-600">
                          {stats.totalCalculations > 0
                            ? `${stats.totalCalculations} berekeningen gemaakt`
                            : "Maak je eerste slimme berekening"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Recente Activiteit
            </h2>

            <div className="space-y-2">
              {activities.slice(0, 5).map((activity) => (
                <Card key={activity.id} className="bg-white border border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activity.type === "chat" ? "bg-blue-100" : "bg-purple-100"
                          }`}
                        >
                          {activity.type === "chat" ? (
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Calculator className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                        </div>
                      </div>
                      <Badge variant={activity.type === "chat" ? "default" : "secondary"} className="text-xs">
                        {activity.type === "chat" ? "Chat" : "Berekening"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* New User Help */}
        {isNewUser && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Welkom bij QRP!</h3>
                <p className="text-sm text-gray-600">
                  QRP is je persoonlijke AI-assistent. Begin met een gesprek of maak een berekening om te starten.
                </p>
                <div className="flex space-x-2 justify-center">
                  <Link href="/app/chat">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Start Chat
                    </Button>
                  </Link>
                  <Link href="/app/calculator">
                    <Button size="sm" variant="outline">
                      Open Rekenmachine
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
