"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Calculator,
  FileText,
  Code,
  Palette,
  Brain,
  Settings,
  LogOut,
  User,
  Search,
  Bell,
  TrendingUp,
  Clock,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface UserStats {
  totalChats: number
  totalCalculations: number
  totalDocuments: number
  timeSpent: number
  todayActivity: number
  weekActivity: number
}

interface RecentActivity {
  tool: string
  action: string
  time: string
  timestamp: Date
}

export default function AppDashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [greeting, setGreeting] = useState("")
  const [stats, setStats] = useState<UserStats>({
    totalChats: 0,
    totalCalculations: 0,
    totalDocuments: 0,
    timeSpent: 0,
    todayActivity: 0,
    weekActivity: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting("Goedemorgen")
      else if (hour < 18) setGreeting("Goedemiddag")
      else setGreeting("Goedenavond")

      loadUserStats()
      loadRecentActivity()
    }
  }, [user, loading, router])

  const loadUserStats = () => {
    if (!user) return

    // Load real user statistics from localStorage
    const chatHistory = JSON.parse(localStorage.getItem(`qrp_chat_history_${user.id}`) || "[]")
    const calculatorHistory = JSON.parse(localStorage.getItem(`calculator_history_${user.id}`) || "[]")
    const documentHistory = JSON.parse(localStorage.getItem(`document_history_${user.id}`) || "[]")
    const activityLog = JSON.parse(localStorage.getItem(`activity_log_${user.id}`) || "[]")

    // Calculate today's activity
    const today = new Date().toDateString()
    const todayActivities = activityLog.filter((activity: any) => new Date(activity.timestamp).toDateString() === today)

    // Calculate this week's activity
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekActivities = activityLog.filter((activity: any) => new Date(activity.timestamp) > weekAgo)

    setStats({
      totalChats: chatHistory.length,
      totalCalculations: calculatorHistory.length,
      totalDocuments: documentHistory.length,
      timeSpent: Math.floor(activityLog.length * 2.5), // Estimate 2.5 minutes per activity
      todayActivity: todayActivities.length,
      weekActivity: weekActivities.length,
    })
  }

  const loadRecentActivity = () => {
    if (!user) return

    const activityLog = JSON.parse(localStorage.getItem(`activity_log_${user.id}`) || "[]")
    const recent = activityLog
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      }))

    setRecentActivity(recent)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="android-avatar animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const aiTools = [
    {
      id: "chat",
      title: "AI Chat",
      description: "Start een gesprek met je persoonlijke AI-assistent",
      icon: MessageSquare,
      color: "from-blue-400 to-blue-600",
      href: "/app/chat",
      popular: stats.totalChats > 0,
      count: stats.totalChats,
    },
    {
      id: "calculator",
      title: "AI Rekenmachine",
      description: "Los wiskundige problemen op met AI-uitleg",
      icon: Calculator,
      color: "from-green-400 to-green-600",
      href: "/app/calculator",
      new: stats.totalCalculations === 0,
      count: stats.totalCalculations,
    },
    {
      id: "documents",
      title: "Document AI",
      description: "Maak en bewerk documenten met AI-hulp",
      icon: FileText,
      color: "from-purple-400 to-purple-600",
      href: "/app/documents",
      count: stats.totalDocuments,
    },
    {
      id: "code",
      title: "Code Assistent",
      description: "Programmeer met AI-ondersteuning en debugging",
      icon: Code,
      color: "from-orange-400 to-orange-600",
      href: "/app/code",
      count: 0,
    },
    {
      id: "creative",
      title: "Creatieve AI",
      description: "Genereer afbeeldingen en creatieve content",
      icon: Palette,
      color: "from-pink-400 to-pink-600",
      href: "/app/creative",
      count: 0,
    },
    {
      id: "tutor",
      title: "Leer Assistent",
      description: "Krijg hulp bij huiswerk en studie",
      icon: Brain,
      color: "from-indigo-400 to-indigo-600",
      href: "/app/tutor",
      count: 0,
    },
  ]

  const getTimeSpentText = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}u ${remainingMinutes}m` : `${hours}u`
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Nu"
    if (diffInMinutes < 60) return `${diffInMinutes} min geleden`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} uur geleden`
    return `${Math.floor(diffInMinutes / 1440)} dagen geleden`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="android-header px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="android-avatar">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {greeting}, {user.name}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {stats.todayActivity > 0 ? `${stats.todayActivity} activiteiten vandaag` : "Welkom terug bij QRP"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="android-icon-button" title="Zoeken">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="android-icon-button" title="Meldingen">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="android-icon-button" title="Instellingen">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="android-icon-button" title="Uitloggen">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Message for New Users */}
        {stats.totalChats === 0 && stats.totalCalculations === 0 && (
          <Card className="android-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="android-avatar">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Welkom bij QRP! 🎉</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Je bent nu klaar om te beginnen! Probeer eerst de <strong>AI Chat</strong> voor een gesprek, of test
                    de <strong>AI Rekenmachine</strong> voor wiskundige problemen. Al je activiteiten worden automatisch
                    opgeslagen.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Link href="/app/chat">
                      <Button className="android-primary-button">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </Link>
                    <Link href="/app/calculator">
                      <Button variant="outline" className="bg-transparent">
                        <Calculator className="h-4 w-4 mr-2" />
                        Probeer Rekenmachine
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Gesprekken</p>
                  <p className="text-xl font-bold">{stats.totalChats}</p>
                </div>
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Berekeningen</p>
                  <p className="text-xl font-bold">{stats.totalCalculations}</p>
                </div>
                <Calculator className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Deze Week</p>
                  <p className="text-xl font-bold">{stats.weekActivity}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Tijd Actief</p>
                  <p className="text-xl font-bold">{getTimeSpentText(stats.timeSpent)}</p>
                </div>
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Tools Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">AI Tools</h2>
              <p className="text-sm text-muted-foreground">Klik op een tool om te beginnen</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <Link key={tool.id} href={tool.href}>
                  <Card className="android-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center shadow-lg`}
                        >
                          <tool.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex gap-1 flex-col items-end">
                          {tool.popular && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Gebruikt
                            </Badge>
                          )}
                          {tool.new && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <Zap className="h-3 w-3 mr-1" />
                              Nieuw
                            </Badge>
                          )}
                          {tool.count > 0 && (
                            <span className="text-xs text-muted-foreground">{tool.count} keer gebruikt</span>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center justify-between">
                        {tool.title}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recente Activiteit
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nog geen activiteit</p>
                    <p className="text-xs">Begin met een AI-tool om je activiteit te zien</p>
                  </div>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium">{activity.tool}</p>
                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg">Snelle Acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/app/chat">
                  <Button className="w-full justify-start android-primary-button">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Nieuwe Chat Starten
                  </Button>
                </Link>
                <Link href="/app/calculator">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calculator className="h-4 w-4 mr-2" />
                    Berekening Maken
                  </Button>
                </Link>
                <Link href="/app/documents">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Document Maken
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Helpful Tips */}
            <Card className="android-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg text-green-900 dark:text-green-100">💡 Wist je dat?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                  {stats.totalChats === 0
                    ? "Je kunt met de AI Chat in het Nederlands praten over elk onderwerp!"
                    : stats.totalCalculations === 0
                      ? "De AI Rekenmachine kan complexe wiskundige problemen uitleggen!"
                      : "Al je gesprekken en berekeningen worden automatisch opgeslagen."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
