"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import {
  MessageCircle,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Gamepad2,
  Settings,
  Sparkles,
  ImageIcon,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Chat {
  id: string
  title: string
  description?: string
  lastMessage?: string
  updatedAt: string
  messageCount: number
  hasFiles: boolean
}

export default function BetaChatsPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        // Generate AI descriptions and enhance chat data
        const enhancedChats = data.map((chat: any) => ({
          ...chat,
          description: generateAIDescription(chat.title),
          messageCount: Math.floor(Math.random() * 50) + 1,
          hasFiles: Math.random() > 0.7,
        }))
        setChats(enhancedChats)
      }
    } catch (error) {
      console.error("Failed to load chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIDescription = (title: string): string => {
    const descriptions = [
      "Interessante discussie over AI en technologie",
      "Creatieve brainstormsessie met nieuwe ideeën",
      "Hulp bij programmeren en code optimalisatie",
      "Gesprek over wetenschap en innovatie",
      "Praktische tips en handige suggesties",
      "Diepgaande analyse van complexe onderwerpen",
      "Creatief schrijfproject met AI ondersteuning",
      "Technische uitleg en probleemoplossing",
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const generateChatTitle = (content: string): string => {
    const words = content.split(" ").slice(0, 4).join(" ")
    return words.length > 20 ? words.substring(0, 17) + "..." : words
  }

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nieuwe Chat",
          description: "Verse conversatie met AI",
        }),
      })

      if (response.ok) {
        const newChat = await response.json()
        router.push(`/beta/chat/${newChat.id}`)
      }
    } catch (error) {
      console.error("Failed to create chat:", error)
    }
  }

  const updateChatTitle = async (chatId: string, title: string) => {
    if (!title.trim()) {
      setEditingChatId(null)
      return
    }

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: generateChatTitle(title.trim()) }),
      })

      if (response.ok) {
        loadChats()
      }
    } catch (error) {
      console.error("Failed to update chat:", error)
    } finally {
      setEditingChatId(null)
    }
  }

  const deleteChat = async (chatId: string) => {
    if (!confirm("Weet je zeker dat je deze chat wilt verwijderen?")) return

    try {
      const response = await fetch(`/api/chats/${chatId}`, { method: "DELETE" })
      if (response.ok) {
        loadChats()
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-purple-700 font-medium">Chats laden...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-purple-900">Chat</h1>
                  <p className="text-purple-600 text-sm">Material 3 Expressive Beta</p>
                </div>
              </div>
              <Button
                onClick={createNewChat}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl h-12 px-6 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Chat
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <Input
                placeholder="Zoek in chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 rounded-3xl border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Chat Cards */}
          <div className="grid gap-4 mb-20">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => router.push(`/beta/chat/${chat.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingChatId === chat.id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateChatTitle(chat.id, editTitle)
                                } else if (e.key === "Escape") {
                                  setEditingChatId(null)
                                }
                              }}
                              className="h-8 text-lg font-semibold"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h3 className="text-lg font-semibold text-purple-900 truncate">{chat.title}</h3>
                          )}
                          <p className="text-purple-600 text-sm truncate">{chat.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-purple-500 mb-3">
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {chat.messageCount} berichten
                        </span>
                        {chat.hasFiles && (
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            Bestanden
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(chat.updatedAt).toLocaleDateString("nl-NL")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          Auto-opslaan
                        </div>
                        {chat.hasFiles && (
                          <div className="flex space-x-1">
                            <div className="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-3 h-3 text-purple-600" />
                            </div>
                            <div className="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center">
                              <FileText className="w-3 h-3 text-purple-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-400 hover:text-purple-600 ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-purple-200 rounded-2xl shadow-xl">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingChatId(chat.id)
                            setEditTitle(chat.title)
                          }}
                          className="flex items-center cursor-pointer hover:bg-purple-50 rounded-xl"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Naam wijzigen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(chat.id)
                          }}
                          className="flex items-center cursor-pointer text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredChats.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  {searchTerm ? "Geen chats gevonden" : "Nog geen chats"}
                </h3>
                <p className="text-purple-600 mb-6">
                  {searchTerm ? "Probeer een andere zoekterm" : "Start je eerste conversatie met AI"}
                </p>
                <Button
                  onClick={createNewChat}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl h-12 px-8 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Eerste Chat Starten
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-center space-x-8">
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 h-auto py-2 px-4 text-purple-600 bg-purple-50 rounded-2xl"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Chat</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 h-auto py-2 px-4 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl"
                onClick={() => router.push("/beta/notes")}
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs font-medium">Notities</span>
              </Button>
              <Button
                onClick={createNewChat}
                className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center"
              >
                <Plus className="w-7 h-7 text-white" />
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 h-auto py-2 px-4 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl"
                onClick={() => router.push("/beta/games")}
              >
                <Gamepad2 className="w-6 h-6" />
                <span className="text-xs font-medium">Games</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 h-auto py-2 px-4 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl"
                onClick={() => router.push("/beta/settings")}
              >
                <Settings className="w-6 h-6" />
                <span className="text-xs font-medium">Instellingen</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
