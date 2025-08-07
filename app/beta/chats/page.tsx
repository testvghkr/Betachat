"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Plus, Home, ArrowLeft, Send, Bot, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface Chat {
  id: number
  title: string
  created_at: string
  updated_at: string
}

interface Message {
  id: number
  content: string
  role: "user" | "assistant"
  created_at: string
}

export default function BetaChatsPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [showNewChatForm, setShowNewChatForm] = useState(false)

  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  const loadChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const loadMessages = async (chatId: number) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const createNewChat = async () => {
    if (!newChatTitle.trim()) return

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChatTitle }),
      })

      if (response.ok) {
        const newChat = await response.json()
        setChats([newChat, ...chats])
        setNewChatTitle("")
        setShowNewChatForm(false)
        setSelectedChat(newChat)
        setMessages([])
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isLoading) return

    const userMessage = newMessage
    setNewMessage("")
    setIsLoading(true)

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: Date.now(),
      content: userMessage,
      role: "user",
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage, role: "user" }),
      })

      if (response.ok) {
        // Simulate AI response
        setTimeout(() => {
          const aiResponse: Message = {
            id: Date.now() + 1,
            content: `Hallo! Ik ben QRP, je vriendelijke AI-assistent. Je vroeg: "${userMessage}". Ik help je graag met al je vragen! 😊`,
            role: "assistant",
            created_at: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Authenticatie vereist</h1>
          <Link href="/login" className="text-purple-300 hover:text-purple-100">
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Terug</span>
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 border-purple-400/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              <h1 className="text-xl font-bold text-white">QRP Chats</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chats
                  </CardTitle>
                  <Button
                    onClick={() => setShowNewChatForm(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto">
                {showNewChatForm && (
                  <div className="space-y-2 p-3 bg-white/10 rounded-lg border border-white/20">
                    <Input
                      placeholder="Chat titel..."
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={createNewChat} size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Maken
                      </Button>
                      <Button
                        onClick={() => setShowNewChatForm(false)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        Annuleren
                      </Button>
                    </div>
                  </div>
                )}

                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat)
                      loadMessages(chat.id)
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedChat?.id === chat.id
                        ? "bg-purple-600/30 border border-purple-400/50"
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <h3 className="font-medium text-white truncate">{chat.title}</h3>
                    <p className="text-sm text-white/60 mt-1">
                      {new Date(chat.updated_at).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                ))}

                {chats.length === 0 && !showNewChatForm && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Nog geen chats</p>
                    <Button onClick={() => setShowNewChatForm(true)} className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Eerste chat maken
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20 flex flex-col">
              {selectedChat ? (
                <>
                  <CardHeader className="border-b border-white/20">
                    <CardTitle className="text-white">{selectedChat.title}</CardTitle>
                    <CardDescription className="text-white/60">
                      Chat met QRP - Je vriendelijke AI-assistent
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-white border border-white/20"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 text-purple-300" />}
                            {message.role === "user" && <User className="h-4 w-4 mt-0.5 text-white" />}
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {new Date(message.created_at).toLocaleTimeString("nl-NL", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-white border border-white/20 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4 text-purple-300" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 border-t border-white/20">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Typ je bericht..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
                        rows={1}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Selecteer een chat</h3>
                    <p className="text-white/60">Kies een chat uit de lijst of maak een nieuwe aan</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
