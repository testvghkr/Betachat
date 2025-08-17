"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ArrowLeft, Bot, User, Trash2, Copy, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: number
}

export default function ChatPage() {
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`chat_${user.id}`)
      if (saved) {
        setMessages(JSON.parse(saved))
      }
    }
  }, [user])

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const saveMessages = (newMessages: Message[]) => {
    if (!user) return

    setMessages(newMessages)
    localStorage.setItem(`chat_${user.id}`, JSON.stringify(newMessages))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) || '{"totalChats":0,"totalCalculations":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalChats = Math.max(stats.totalChats, Math.ceil(newMessages.length / 2))
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage && lastMessage.type === "user") {
      activities.unshift({
        id: Date.now().toString(),
        type: "chat",
        description: `Chat: ${lastMessage.content.slice(0, 50)}${lastMessage.content.length > 50 ? "..." : ""}`,
        timestamp: Date.now(),
      })
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    saveMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // QRP AI Response (simulated)
      let response = ""
      const userInput = userMessage.content.toLowerCase()

      if (userInput.includes("hallo") || userInput.includes("hoi")) {
        response = `Hallo ${user?.name || "daar"}! 😊 Mijn naam is QRP en ik sta klaar om je te helpen. Waar kan ik je vandaag mee van dienst zijn?`
      } else if (userInput.includes("rekenen") || userInput.includes("berekening")) {
        response =
          "Voor berekeningen kun je beter mijn AI Rekenmachine gebruiken! Die is speciaal gemaakt voor wiskundige vragen. Maar ik kan je ook hier helpen met eenvoudige sommen. Wat wil je berekenen?"
      } else if (userInput.includes("wie ben je") || userInput.includes("wat ben je")) {
        response =
          "Ik ben QRP, je vriendelijke AI-assistent! 🤖 Ik kan je helpen met vragen beantwoorden, problemen oplossen, creatieve taken, en nog veel meer. Ik spreek Nederlands en probeer altijd behulpzaam en vriendelijk te zijn."
      } else if (userInput.includes("dank") || userInput.includes("bedankt")) {
        response =
          "Graag gedaan! 😊 Het is mijn plezier om je te helpen. Heb je nog andere vragen of kan ik je ergens anders mee helpen?"
      } else if (userInput.includes("help") || userInput.includes("hulp")) {
        response =
          "Natuurlijk help ik je graag! 💪 Ik kan je assisteren met:\n\n• Vragen beantwoorden\n• Problemen oplossen\n• Creatieve taken\n• Uitleg geven\n• En nog veel meer!\n\nVertel me gewoon waar je hulp bij nodig hebt!"
      } else {
        // Generic helpful response
        response = `Dat is een interessante vraag! Als QRP probeer ik je zo goed mogelijk te helpen. Over "${userMessage.content}" kan ik zeggen dat dit een onderwerp is waar ik graag meer over zou willen weten. Kun je me wat meer context geven zodat ik je beter kan helpen? 🤔`
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: Date.now(),
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      saveMessages(finalMessages)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, er ging iets mis. Probeer het nog eens! 😅",
        timestamp: Date.now(),
      }
      const finalMessages = [...updatedMessages, errorMessage]
      saveMessages(finalMessages)
    } finally {
      setIsLoading(false)
    }
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

  const clearChat = () => {
    if (!user) return
    setMessages([])
    localStorage.removeItem(`chat_${user.id}`)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-between px-4 text-white text-xs font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-24px)]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">QRP Chat</h1>
                  <p className="text-xs text-gray-500">Je AI-assistent</p>
                </div>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          {messages.length > 0 ? (
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                      <div className="flex items-start space-x-2">
                        {message.type === "assistant" && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div
                            className={`p-3 rounded-lg ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-white border border-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="p-1 h-6 w-6"
                            >
                              {copiedId === message.id ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {message.type === "user" && (
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 max-w-md">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hallo! Ik ben QRP 👋</h3>
                  <p className="text-gray-600 mb-4">
                    Je vriendelijke AI-assistent. Ik kan je helpen met vragen, problemen oplossen, en nog veel meer!
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>💬 Stel me een vraag</p>
                    <p>🤔 Vraag om hulp</p>
                    <p>💡 Brainstorm samen</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Typ je bericht hier..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
