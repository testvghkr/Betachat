"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, ArrowLeft, Bot, User, Trash2, Copy, Check, Sparkles, Brain, History } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      loadChatHistory()
      startNewChat()
    }
  }, [user, loading, router])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChatHistory = () => {
    if (!user) return
    const savedHistory = JSON.parse(localStorage.getItem(`qrp_chat_history_${user.id}`) || "[]")
    const parsedHistory = savedHistory.map((chat: any) => ({
      ...chat,
      timestamp: new Date(chat.timestamp),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }))
    setChatHistory(parsedHistory)
  }

  const saveChatHistory = (chats: ChatSession[]) => {
    if (!user) return
    localStorage.setItem(`qrp_chat_history_${user.id}`, JSON.stringify(chats))
    setChatHistory(chats)
  }

  const startNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "Nieuwe Chat",
      messages: [
        {
          id: "welcome",
          content: `Hallo ${user?.name}! Mijn naam is QRP, en het is een plezier om je te ontmoeten! 😊\n\nIk sta helemaal klaar om je vriendelijk te woord te staan. Of het nu gaat om vragen beantwoorden, hulp bij huiswerk, creatieve projecten, of gewoon een gezellig gesprek - ik draai mijn hand er niet voor om.\n\nWaar kan ik je vandaag mee helpen?`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ],
      timestamp: new Date(),
    }
    setCurrentChat(newChat)
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simple AI-like responses based on keywords
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("hallo") || lowerMessage.includes("hoi")) {
      return "Hallo! Leuk je te spreken! Hoe gaat het met je vandaag? 😊"
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("hulp")) {
      return "Natuurlijk help ik je graag! Vertel me waar je hulp bij nodig hebt. Ik kan je helpen met:\n\n• Vragen beantwoorden\n• Huiswerk en studie\n• Creatieve projecten\n• Programmeren\n• En nog veel meer!\n\nWat zou je graag willen weten?"
    }

    if (lowerMessage.includes("rekenen") || lowerMessage.includes("wiskunde") || lowerMessage.includes("math")) {
      return "Voor wiskundige berekeningen raad ik je de AI Rekenmachine aan! Die vind je in het hoofdmenu. Daar kan ik complexe berekeningen maken met stap-voor-stap uitleg.\n\nMaar als je een snelle vraag hebt, kan ik je hier ook helpen! Wat wil je berekenen?"
    }

    if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("programmeren") ||
      lowerMessage.includes("javascript") ||
      lowerMessage.includes("python")
    ) {
      return "Programmeren is een van mijn specialiteiten! 💻 Ik kan je helpen met:\n\n• Code schrijven en debuggen\n• Uitleg van concepten\n• Best practices\n• Verschillende programmeertalen\n\nWelke programmeertaal gebruik je, of waar heb je hulp bij nodig?"
    }

    if (lowerMessage.includes("huiswerk") || lowerMessage.includes("school") || lowerMessage.includes("studie")) {
      return "Ik help graag met huiswerk en studie! 📚 Ik kan je ondersteunen bij:\n\n• Uitleg van moeilijke concepten\n• Structureren van je antwoorden\n• Onderzoek en bronnen\n• Alle schoolvakken\n\nWaar heb je hulp bij nodig?"
    }

    if (lowerMessage.includes("dank") || lowerMessage.includes("bedankt")) {
      return "Graag gedaan! 😊 Ik ben er altijd om te helpen. Heb je nog andere vragen?"
    }

    if (lowerMessage.includes("wie ben je") || lowerMessage.includes("wat ben je")) {
      return "Ik ben QRP, je vriendelijke AI-assistent! 🤖 Ik ben hier om je te helpen met allerlei vragen en taken. Ik kan:\n\n• Gesprekken voeren\n• Vragen beantwoorden\n• Helpen met huiswerk\n• Creatieve projecten ondersteunen\n• Code schrijven\n• En nog veel meer!\n\nIk probeer altijd vriendelijk en behulpzaam te zijn. Wat zou je graag willen weten?"
    }

    // Default responses
    const defaultResponses = [
      "Dat is een interessante vraag! Kun je me wat meer details geven zodat ik je beter kan helpen?",
      "Ik begrijp je vraag. Laat me daar eens over nadenken... Kun je me wat meer context geven?",
      "Dat klinkt belangrijk! Vertel me wat meer over de situatie zodat ik je de beste hulp kan bieden.",
      "Interessant punt! Ik help je graag verder. Kun je wat meer uitleg geven?",
      "Goed dat je dat vraagt! Om je de beste hulp te kunnen bieden, zou je wat meer details kunnen geven?",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const sendMessage = async () => {
    if (!message.trim() || !currentChat || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 1 ? message.trim().slice(0, 30) + "..." : currentChat.title,
    }

    setCurrentChat(updatedChat)
    setMessage("")
    setIsTyping(true)

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "assistant",
        timestamp: new Date(),
      }

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
      }

      setCurrentChat(finalChat)

      // Save to history
      const updatedHistory = [finalChat, ...chatHistory.filter((chat) => chat.id !== finalChat.id)].slice(0, 20)
      saveChatHistory(updatedHistory)

      // Log activity
      const activityLog = JSON.parse(localStorage.getItem(`activity_log_${user?.id}`) || "[]")
      activityLog.push({
        tool: "AI Chat",
        action: `Bericht verzonden: "${userMessage.content.slice(0, 50)}${userMessage.content.length > 50 ? "..." : ""}"`,
        time: new Date().toLocaleString("nl-NL"),
        timestamp: new Date(),
      })
      localStorage.setItem(`activity_log_${user?.id}`, JSON.stringify(activityLog))
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, er is een fout opgetreden. Probeer het opnieuw.",
        sender: "assistant",
        timestamp: new Date(),
      }

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
      }

      setCurrentChat(finalChat)
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    if (!user) return
    setChatHistory([])
    localStorage.removeItem(`qrp_chat_history_${user.id}`)
    startNewChat()
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="android-avatar animate-pulse">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="android-header px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="android-icon-button">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="android-avatar bg-gradient-to-r from-blue-400 to-blue-600">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Chat met QRP</h1>
              <p className="text-sm text-muted-foreground">Je vriendelijke AI-assistent</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="android-card h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    {currentChat?.title || "Chat met QRP"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={startNewChat}>
                    Nieuwe Chat
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 pb-4">
                    {currentChat?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.sender === "assistant" && (
                          <div className="android-avatar bg-gradient-to-r from-blue-400 to-blue-600 flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.sender === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`text-xs ${
                                msg.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {msg.timestamp.toLocaleTimeString("nl-NL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {msg.sender === "assistant" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                className="h-6 w-6 p-0 ml-2"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {msg.sender === "user" && (
                          <div className="android-avatar bg-gradient-to-r from-purple-400 to-purple-600 flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="android-avatar bg-gradient-to-r from-blue-400 to-blue-600 flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Typ je bericht hier..."
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || isTyping}
                      className="android-primary-button"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Druk Enter om te verzenden. QRP spreekt Nederlands en helpt je graag!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat History */}
            <Card className="android-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Geschiedenis
                  </CardTitle>
                  {chatHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearChat} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nog geen gesprekken</p>
                    <p className="text-xs">Je chatgeschiedenis verschijnt hier</p>
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setCurrentChat(chat)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentChat?.id === chat.id
                              ? "bg-blue-100 dark:bg-blue-900/20"
                              : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <p className="text-sm font-medium truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground">{chat.messages.length} berichten</p>
                          <p className="text-xs text-muted-foreground">{chat.timestamp.toLocaleDateString("nl-NL")}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="android-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <p>• Vraag om hulp bij huiswerk</p>
                  <p>• Laat code uitleggen</p>
                  <p>• Brainstorm over ideeën</p>
                  <p>• Stel algemene vragen</p>
                  <p>• Voer gewoon een gesprek!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
