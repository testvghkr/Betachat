"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Send, Plus, Download, Edit, Trash2, Check, X, MoreVertical, Settings } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LaunchCelebration } from "@/app/components/launch-celebration"
import Link from "next/link"
import { InstallPrompt } from "@/app/components/install-prompt"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: string
}

interface Chat {
  id: string
  title: string
  description?: string
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isGuest, setIsGuest] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editChatTitle, setEditChatTitle] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLaunchCelebration, setShowLaunchCelebration] = useState(false)
  const [visitorNumber, setVisitorNumber] = useState(0)

  useEffect(() => {
    checkFirstVisit()
    checkAuth()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkFirstVisit = async () => {
    const hasVisited = localStorage.getItem("qrp-visited-v2")

    if (!hasVisited) {
      // First time visitor
      localStorage.setItem("qrp-visited-v2", "true")

      // Get visitor count
      try {
        const response = await fetch("/api/visitor-count", { method: "POST" })
        const data = await response.json()
        setVisitorNumber(data.count || 1)
        setShowLaunchCelebration(true)
      } catch (error) {
        console.error("Failed to get visitor count:", error)
        setVisitorNumber(Math.floor(Math.random() * 1000) + 1) // Fallback random number
        setShowLaunchCelebration(true)
      }
    }
  }

  const checkAuth = async () => {
    console.log("Checking auth...")

    try {
      const response = await fetch("/api/auth/me")
      console.log("Auth check response:", response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log("User data:", userData)
        setUser(userData)
        setIsGuest(userData.isGuest || false)

        // Welkomstbericht
        setMessages([
          {
            id: "welcome",
            content: `Hallo ${userData.name}! Ik ben QRP, je AI-assistent. ${
              userData.isGuest
                ? "Je bent in gastmodus - chats worden niet opgeslagen."
                : "Je chats worden automatisch opgeslagen."
            } Hoe kan ik je vandaag helpen?`,
            role: "assistant",
            createdAt: new Date().toISOString(),
          },
        ])

        if (!userData.isGuest) {
          await loadChats()
        } else {
          // Voor gasten: maak een tijdelijke chat
          setCurrentChat({
            id: "guest_chat",
            title: "Gast Chat",
            description: "Tijdelijke chat",
          })
          setLoading(false)
        }
      } else {
        console.log("Not authenticated, redirecting to login")
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setError("Er is een fout opgetreden bij het controleren van je account. Probeer opnieuw in te loggen.")
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    }
  }

  const loadChats = async () => {
    try {
      console.log("Loading chats...")
      const response = await fetch("/api/chats")
      console.log("Load chats response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Chats loaded:", data.length)
        setChats(data)

        if (data.length > 0) {
          console.log("Setting current chat:", data[0].id)
          setCurrentChat(data[0])
          await loadMessages(data[0].id)
        } else {
          console.log("No chats found, creating new chat")
          await createNewChat()
        }
      } else {
        console.error("Failed to load chats:", response.statusText)
        setError("Kon chats niet laden")
      }
    } catch (error) {
      console.error("Failed to load chats:", error)
      setError("Er is een fout opgetreden bij het laden van je chats")
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId: string) => {
    if (isGuest) return

    try {
      console.log("Loading messages for chat:", chatId)
      const response = await fetch(`/api/chats/${chatId}/messages`)
      console.log("Load messages response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Messages loaded:", data.length)
        setMessages(
          data.length > 0
            ? data
            : [
                {
                  id: "welcome",
                  content: `Hallo ${user?.name || "daar"}! Ik ben QRP, je AI-assistent. Hoe kan ik je vandaag helpen?`,
                  role: "assistant",
                  createdAt: new Date().toISOString(),
                },
              ],
        )
      } else {
        console.error("Failed to load messages:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const createNewChat = async () => {
    if (isGuest) return

    try {
      console.log("Creating new chat...")
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nieuwe Chat", // Tijdelijke titel, wordt automatisch aangepast
          description: "Chat met QRP",
        }),
      })

      console.log("Create chat response:", response.status)

      if (response.ok) {
        const newChat = await response.json()
        console.log("New chat created:", newChat.id)
        setChats((prev) => [newChat, ...prev])
        setCurrentChat(newChat)
        setMessages([
          {
            id: "welcome",
            content: `Hallo ${user?.name || "daar"}! Ik ben QRP, je AI-assistent. Hoe kan ik je vandaag helpen?`,
            role: "assistant",
            createdAt: new Date().toISOString(),
          },
        ])
      } else {
        console.error("Failed to create chat:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to create chat:", error)
    }
  }

  const updateChatTitle = async (chatId: string, title: string) => {
    if (isGuest || !title.trim()) {
      setEditingChatId(null)
      return
    }

    try {
      console.log("Updating chat title:", chatId, title)
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      })

      console.log("Update chat response:", response.status)

      if (response.ok) {
        const updatedChat = await response.json()
        console.log("Chat updated:", updatedChat)

        // Update chats list
        setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title: updatedChat.title } : chat)))

        // Update current chat if it's the one being edited
        if (currentChat?.id === chatId) {
          setCurrentChat({ ...currentChat, title: updatedChat.title })
        }
      } else {
        console.error("Failed to update chat:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to update chat:", error)
    } finally {
      setEditingChatId(null)
    }
  }

  const deleteChat = async (chatId: string) => {
    if (isGuest) return

    if (!confirm("Weet je zeker dat je deze chat wilt verwijderen?")) {
      return
    }

    try {
      console.log("Deleting chat:", chatId)
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      })

      console.log("Delete chat response:", response.status)

      if (response.ok) {
        console.log("Chat deleted successfully")

        // Remove from chats list
        const updatedChats = chats.filter((chat) => chat.id !== chatId)
        setChats(updatedChats)

        // If current chat was deleted, switch to another chat or create new one
        if (currentChat?.id === chatId) {
          if (updatedChats.length > 0) {
            setCurrentChat(updatedChats[0])
            loadMessages(updatedChats[0].id)
          } else {
            createNewChat()
          }
        }
      } else {
        console.error("Failed to delete chat:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    if (!currentChat) return

    const messageContent = inputValue.trim()
    setInputValue("")
    setIsLoading(true)

    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      content: messageContent,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    try {
      console.log("Sending message to chat:", currentChat.id)
      console.log("Message content:", messageContent)

      const response = await fetch(`/api/chats/${currentChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageContent,
        }),
      })

      console.log("Send message response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Message sent successfully")

        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempMessage.id)
          return [...filtered, data.userMessage, data.aiMessage]
        })

        // Als dit de eerste user message was, herlaad de chats om de nieuwe titel te krijgen
        if (messages.filter((m) => m.role === "user").length === 0) {
          loadChats()
        }
      } else {
        const errorData = await response.json()
        console.error("Failed to send message:", errorData)
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
        setError(errorData.error || "Kon bericht niet versturen")
      }
    } catch (error) {
      console.error("Message error:", error)
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      setError("Er is een fout opgetreden bij het versturen van je bericht")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const logout = async () => {
    console.log("Logging out...")

    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/login"
    }
  }

  const downloadCode = async (code: string, language = "javascript", filename?: string) => {
    try {
      console.log("Downloading code:", language, filename)

      const response = await fetch("/api/download-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          filename,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename || `qrp-code.${language === "python" ? "py" : language === "typescript" ? "ts" : "js"}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log("Code downloaded successfully")
      } else {
        console.error("Download failed:", response.statusText)
        setError("Download mislukt")
      }
    } catch (error) {
      console.error("Download error:", error)
      setError("Er is een fout opgetreden bij het downloaden")
    }
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user"
    const content = message.content

    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    const parts = content.split(codeBlockRegex)

    return (
      <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-[80%] rounded-lg p-4 ${
            isUser ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white" : "bg-gray-700 text-white"
          }`}
        >
          {/* Text content with improved code blocks */}
          {parts.map((part, index) => {
            if (index % 3 === 0) {
              return part ? (
                <div key={index} className="whitespace-pre-wrap">
                  {part}
                </div>
              ) : null
            } else if (index % 3 === 1) {
              const language = part || "code"
              const code = parts[index + 1] || ""

              return code ? (
                <div key={index} className="my-3">
                  <div className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-t border border-gray-600">
                    <span className="text-sm text-orange-400 capitalize font-medium">{language}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadCode(code, language, `qrp-${language}-code`)}
                      className="text-orange-400 hover:text-orange-300 h-6 px-2 hover:bg-gray-700"
                      title={`Download ${language} code`}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <pre className="bg-gray-900 p-3 rounded-b overflow-x-auto border border-gray-600 border-t-0">
                    <code className="text-sm text-blue-400">{code}</code>
                  </pre>
                </div>
              ) : null
            }
            return null
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
          <div className="text-white text-lg">Laden...</div>
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Launch Celebration Modal */}
      {showLaunchCelebration && (
        <LaunchCelebration onClose={() => setShowLaunchCelebration(false)} visitorNumber={visitorNumber} />
      )}

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                    <Menu className="w-5 h-5" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gray-800 border-gray-700 w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6 pt-4">
                    <Image src="/qrp-logo.png" alt="QRP Logo" width={80} height={50} className="object-contain" />
                    {!isGuest && (
                      <Button
                        onClick={() => {
                          createNewChat()
                          setSidebarOpen(false)
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nieuw
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      {chats.map((chat) => (
                        <div key={chat.id} className="relative group">
                          {editingChatId === chat.id ? (
                            <div className="flex items-center bg-gray-700 rounded p-1">
                              <Input
                                value={editChatTitle}
                                onChange={(e) => setEditChatTitle(e.target.value)}
                                className="flex-1 bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateChatTitle(chat.id, editChatTitle)
                                  } else if (e.key === "Escape") {
                                    setEditingChatId(null)
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-500 hover:bg-gray-600"
                                onClick={() => updateChatTitle(chat.id, editChatTitle)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:bg-gray-600"
                                onClick={() => setEditingChatId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative flex items-center">
                              <Button
                                variant={currentChat?.id === chat.id ? "secondary" : "ghost"}
                                className="flex-1 justify-start text-left h-auto p-3 text-white hover:bg-gray-700 mr-2"
                                onClick={() => {
                                  setCurrentChat(chat)
                                  if (!isGuest) loadMessages(chat.id)
                                  setSidebarOpen(false)
                                }}
                              >
                                <div>
                                  <div className="font-medium">{chat.title}</div>
                                  {chat.description && <div className="text-sm text-gray-400">{chat.description}</div>}
                                </div>
                              </Button>

                              {/* Drie puntjes menu - nu altijd zichtbaar */}
                              {!editingChatId && !isGuest && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-600 text-gray-400 hover:text-white opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingChatId(chat.id)
                                        setEditChatTitle(chat.title)
                                      }}
                                      className="flex items-center cursor-pointer hover:bg-gray-700"
                                    >
                                      <Edit className="mr-2 h-4 w-4" /> Naam wijzigen
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(chat.id)
                                      }}
                                      className="flex items-center cursor-pointer text-red-500 hover:bg-gray-700 hover:text-red-400"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-white font-semibold text-lg">{currentChat?.title || "QRP Chat"}</h1>
              <p className="text-gray-400 text-sm">
                {isGuest ? "Gastmodus - niet opgeslagen" : "Chats worden opgeslagen"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/app-installeren">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700 hidden md:flex"
                title="Leer hoe je QRP als app installeert"
              >
                <Download className="w-4 h-4 mr-2" />
                App Installeren
              </Button>
            </Link>
            <InstallPrompt />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 border-gray-700 w-64">
                <div className="flex flex-col space-y-4 pt-8">
                  {user && (
                    <div className="text-white mb-4 p-3 bg-gray-700 rounded">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      {isGuest && <div className="text-xs text-orange-400 mt-1">Gastmodus</div>}
                      {!isGuest && <div className="text-xs text-blue-400 mt-1">QRP v2.0 Gebruiker</div>}
                    </div>
                  )}
                  {!isGuest && (
                    <Link href="/account">
                      <Button variant="ghost" className="text-white justify-start hover:bg-gray-700 w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Instellingen
                      </Button>
                    </Link>
                  )}
                  <Button onClick={logout} variant="ghost" className="text-white justify-start hover:bg-gray-700">
                    Uitloggen
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900 border-b border-red-700 p-2 text-center">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <Image
                src="/qrp-logo.png"
                alt="QRP Logo"
                width={100}
                height={60}
                className="object-contain mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2 text-white">Welkom bij QRP v2.0!</h2>
              <p>Stel een vraag of vraag om hulp met code, huiswerk, of creatieve projecten.</p>
            </div>
          )}
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-700 text-white rounded-lg p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <div className="relative p-[2px] bg-gradient-to-r from-orange-500 to-blue-500 rounded-full">
                <div className="bg-gray-800 rounded-full flex items-center min-h-[48px]">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Typ je bericht hier..."
                    className="border-0 bg-transparent text-white placeholder-gray-400 focus:ring-0 focus-visible:ring-0 flex-1 px-4"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="p-2 bg-gray-800 text-xs text-gray-500 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between">
          <span>{isGuest ? "🔓 Gastmodus - Chats niet opgeslagen" : "💾 Chats worden automatisch opgeslagen"}</span>
          <span className="text-orange-400">QRP v2.0 • Gebruiker: {user?.name}</span>
        </div>
      </div>
    </div>
  )
}
