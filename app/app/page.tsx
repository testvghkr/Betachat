"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calculator,
  MessageSquare,
  Clock,
  TrendingUp,
  User,
  ArrowRight,
  Sparkles,
  LogOut,
  FileText,
  Code,
  Palette,
  Brain,
  Music,
  Video,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserActivity {
  id: string
  type: "chat" | "calculation" | "document" | "code" | "creative" | "tutor" | "music" | "video"
  description: string
  timestamp: number
}

interface UserStats {
  totalChats: number
  totalCalculations: number
  totalDocuments: number
  totalCodeSessions: number
  totalCreativeProjects: number
  totalTutorSessions: number
  timeSpent: number
  lastActive: number
}

export default function AppDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalChats: 0,
    totalCalculations: 0,
    totalDocuments: 0,
    totalCodeSessions: 0,
    totalCreativeProjects: 0,
    totalTutorSessions: 0,
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

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

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

  const aiApps = [
    {
      id: "chat",
      title: "AI Chat",
      description: "Gesprekken met je persoonlijke AI-assistent",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      href: "/app/chat",
      count: stats.totalChats,
      popular: stats.totalChats > 0,
    },
    {
      id: "calculator",
      title: "AI Rekenmachine",
      description: "Wiskundige problemen met AI-uitleg",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      href: "/app/calculator",
      count: stats.totalCalculations,
      new: stats.totalCalculations === 0,
    },
    {
      id: "documents",
      title: "Document AI",
      description: "Documenten maken en bewerken met AI",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      href: "/app/documents",
      count: stats.totalDocuments,
      new: stats.totalDocuments === 0,
    },
    {
      id: "code",
      title: "Code Assistent",
      description: "Programmeren met AI-ondersteuning",
      icon: Code,
      color: "from-orange-500 to-orange-600",
      href: "/app/code",
      count: stats.totalCodeSessions,
      new: stats.totalCodeSessions === 0,
    },
    {
      id: "creative",
      title: "Creatieve AI",
      description: "Afbeeldingen en designs genereren",
      icon: Palette,
      color: "from-pink-500 to-pink-600",
      href: "/app/creative",
      count: stats.totalCreativeProjects,
      new: stats.totalCreativeProjects === 0,
    },
    {
      id: "tutor",
      title: "Leer Assistent",
      description: "Persoonlijke AI-tutor voor studie",
      icon: Brain,
      color: "from-indigo-500 to-indigo-600",
      href: "/app/tutor",
      count: stats.totalTutorSessions,
      new: stats.totalTutorSessions === 0,
    },
    {
      id: "music",
      title: "Muziek AI",
      description: "Muziek componeren en analyseren",
      icon: Music,
      color: "from-red-500 to-red-600",
      href: "/app/music",
      count: 0,
      new: true,
    },
    {
      id: "video",
      title: "Video AI",
      description: "Video's maken en bewerken",
      icon: Video,
      color: "from-teal-500 to-teal-600",
      href: "/app/video",
      count: 0,
      new: true,
    },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Goedemorgen"
    if (hour < 18) return "Goedemiddag"
    return "Goedenavond"
  }

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

      {/* Header with Logout */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {getGreeting()}, {user?.name || "Gebruiker"}!
              </h1>
              <p className="text-sm text-gray-600">Welkom terug bij QRP</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">AI Chats</p>
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
                  <p className="text-green-100 text-sm">Documenten</p>
                  <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                </div>
                <FileText className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Tijd Actief</p>
                  <p className="text-lg font-bold">{formatTime(stats.timeSpent)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Apps Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-blue-500" />
              AI Apps
            </h2>
            <Badge variant="secondary" className="text-xs">
              {aiApps.length} beschikbaar
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {aiApps.map((app) => (
              <Link key={app.id} href={app.href}>
                <Card className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200 bg-white group">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center`}
                        >
                          <app.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {app.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Populair
                            </Badge>
                          )}
                          {app.new && <Badge className="bg-green-500 text-white text-xs">Nieuw</Badge>}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                          {app.title}
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                        {app.count > 0 && <p className="text-xs text-gray-500 mt-2">{app.count} keer gebruikt</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Recente Activiteit
                </span>
                <Badge variant="outline" className="text-xs">
                  {activities.length} activiteiten
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.type === "chat"
                            ? "bg-blue-100"
                            : activity.type === "calculation"
                              ? "bg-purple-100"
                              : activity.type === "document"
                                ? "bg-green-100"
                                : activity.type === "code"
                                  ? "bg-orange-100"
                                  : activity.type === "creative"
                                    ? "bg-pink-100"
                                    : activity.type === "tutor"
                                      ? "bg-indigo-100"
                                      : "bg-gray-100"
                        }`}
                      >
                        {activity.type === "chat" && <MessageSquare className="w-4 h-4 text-blue-600" />}
                        {activity.type === "calculation" && <Calculator className="w-4 h-4 text-purple-600" />}
                        {activity.type === "document" && <FileText className="w-4 h-4 text-green-600" />}
                        {activity.type === "code" && <Code className="w-4 h-4 text-orange-600" />}
                        {activity.type === "creative" && <Palette className="w-4 h-4 text-pink-600" />}
                        {activity.type === "tutor" && <Brain className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* New User Welcome */}
        {isNewUser && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Welkom bij QRP! 🎉</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Je hebt nu toegang tot 8 krachtige AI-tools. Begin met chatten of probeer de rekenmachine om te
                  starten!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/app/chat">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </Link>
                  <Link href="/app/calculator">
                    <Button variant="outline">
                      <Calculator className="w-4 h-4 mr-2" />
                      Rekenmachine
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">💡 Tips voor vandaag</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {isNewUser ? (
                <>
                  <p>• Begin met de AI Chat om QRP te leren kennen</p>
                  <p>• Probeer de Rekenmachine voor wiskundige vragen</p>
                  <p>• Ontdek alle 8 AI-tools in je eigen tempo</p>
                </>
              ) : (
                <>
                  <p>• Probeer de Document AI voor het maken van teksten</p>
                  <p>• Gebruik de Code Assistent voor programmeer hulp</p>
                  <p>• Ontdek de Creatieve AI voor visuele projecten</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
