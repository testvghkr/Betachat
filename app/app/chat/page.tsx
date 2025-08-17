"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Menu,
  User,
  MessageSquare,
  Sparkles,
  Upload,
  Trash2,
  Copy,
  ArrowLeft,
  Download,
} from "lucide-react"
import { cn, formatTime, generateId } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  fileUrl?: string
  fileName?: string
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Add activity logging function
  const logActivity = (action: string) => {
    if (!user) return

    const activity = {
      tool: "AI Chat",
      action,
      timestamp: new Date().toISOString(),
    }

    const existingLog = JSON.parse(localStorage.getItem(`activity_log_${user.id}`) || "[]")
    existingLog.unshift(activity)

    // Keep only last 50 activities
    const trimmedLog = existingLog.slice(0, 50)
    localStorage.setItem(`activity_log_${user.id}`, JSON.stringify(trimmedLog))
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    scrollToBottom()
  }, [messages, user, loading, router])

  useEffect(() => {
    if (user) {
      loadChatHistory()
      initializeSpeechRecognition()

      // Add welcome message if no messages
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: generateId(),
          content: `Hallo ${user.name}! 👋\n\nIk ben QRP, je persoonlijke AI-assistent. Ik kan je helpen met:\n\n• Vragen beantwoorden\n• Code schrijven en debuggen\n• Huiswerk en studie\n• Creatieve projecten\n• Problemen oplossen\n\nWaar kan ik je vandaag mee helpen?`,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    }
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChatHistory = () => {
    if (!user) return
    const saved = localStorage.getItem(`qrp_chat_history_${user.id}`)
    if (saved) {
      const history = JSON.parse(saved).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      setChatHistory(history)
    }
  }

  const saveChatHistory = (history: ChatHistory[]) => {
    if (!user) return
    localStorage.setItem(`qrp_chat_history_${user.id}`, JSON.stringify(history))
    setChatHistory(history)
  }

  const initializeSpeechRecognition = () => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "nl-NL"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "nl-NL"
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `Bedankt voor je vraag, ${user?.name}! Over "${userInput}" kan ik je het volgende vertellen...`,
      `Interessante vraag! Laat me je helpen met "${userInput}". Hier is wat ik weet...`,
      `Hallo ${user?.name}! Voor "${userInput}" heb ik een uitgebreid antwoord...`,
      `Geweldige vraag over "${userInput}"! Ik help je graag verder...`,
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    if (userInput.toLowerCase().includes("code") || userInput.toLowerCase().includes("programmeren")) {
      return `${randomResponse}\n\nHier is een voorbeeld van hoe je dit zou kunnen aanpakken:\n\n\`\`\`javascript\nfunction example() {\n  console.log("Dit is een voorbeeld!");\n  return "Succes!";\n}\n\`\`\`\n\nHeb je nog specifieke vragen over programmeren?`
    }

    if (userInput.toLowerCase().includes("huiswerk") || userInput.toLowerCase().includes("leren")) {
      return `${randomResponse}\n\nIk help je graag met je huiswerk! Hier zijn enkele tips:\n\n• Begin met het begrijpen van de hoofdconcepten\n• Maak aantekeningen van belangrijke punten\n• Oefen regelmatig met voorbeelden\n• Vraag om hulp als je vastloopt\n\nWat voor vak of onderwerp wil je bestuderen?`
    }

    return `${randomResponse}\n\nIk ben hier om je te helpen met allerlei vragen - van programmeren tot huiswerk maken, van creatieve projecten tot het oplossen van problemen. Vertel me meer over wat je precies wilt weten!\n\nAls je andere AI-tools wilt proberen, kijk dan eens naar de rekenmachine of document generator in je dashboard.`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedFile) return

    const userMessage: Message = {
      id: generateId(),
      content: input.trim() || `[Bestand: ${selectedFile?.name}]`,
      role: "user",
      timestamp: new Date(),
      fileName: selectedFile?.name,
    }

    // Log activity
    logActivity(`Bericht verzonden: ${userMessage.content.substring(0, 50)}...`)

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setSelectedFile(null)
    setIsLoading(true)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const aiResponse = generateAIResponse(userMessage.content)

      const assistantMessage: Message = {
        id: generateId(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // Log AI response
      logActivity("AI antwoord ontvangen")

      // Save to chat history
      saveCurrentChat(finalMessages)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: generateId(),
        content: "Sorry, er ging iets mis. Probeer het opnieuw.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([...newMessages, errorMessage])
      logActivity("Chat fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const saveCurrentChat = (currentMessages: Message[]) => {
    if (currentMessages.length === 0) return

    const chatTitle = currentMessages.find((m) => m.role === "user")?.content.substring(0, 50) + "..." || "Nieuwe Chat"

    const updatedHistory = [...chatHistory]

    if (currentChatId) {
      const chatIndex = updatedHistory.findIndex((chat) => chat.id === currentChatId)
      if (chatIndex !== -1) {
        updatedHistory[chatIndex] = {
          ...updatedHistory[chatIndex],
          messages: currentMessages,
          title: chatTitle,
        }
      }
    } else {
      const newChat: ChatHistory = {
        id: generateId(),
        title: chatTitle,
        messages: currentMessages,
        createdAt: new Date(),
      }
      updatedHistory.unshift(newChat)
      setCurrentChatId(newChat.id)
    }

    saveChatHistory(updatedHistory)
  }

  const loadChat = (chat: ChatHistory) => {
    setMessages(chat.messages)
    setCurrentChatId(chat.id)
  }

  const startNewChat = () => {
    const welcomeMessage: Message = {
      id: generateId(),
      content: `Hallo ${user?.name}! Ik ben QRP. Waar kan ik je mee helpen? 😊`,
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    setCurrentChatId(null)

    // Log activity
    logActivity("Nieuwe chat gestart")
  }

  const deleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId)
    saveChatHistory(updatedHistory)

    if (currentChatId === chatId) {
      startNewChat()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportChat = () => {
    const chatData = {
      user: user?.name,
      title: `QRP Chat - ${new Date().toLocaleDateString("nl-NL")}`,
      messages: messages,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qrp-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="android-avatar animate-pulse">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      {/* Header */}
      <header className="android-header px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="android-icon-button">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="android-icon-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="android-sheet">
                <SheetHeader>
                  <SheetTitle className="text-left">Chat Geschiedenis</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Button onClick={startNewChat} className="w-full justify-start android-primary-button">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Nieuwe Chat
                  </Button>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-2">
                      {chatHistory.map((chat) => (
                        <div key={chat.id} className="group relative">
                          <Button
                            variant="ghost"
                            onClick={() => loadChat(chat)}
                            className={cn(
                              "w-full justify-start text-left h-auto p-3 android-list-item",
                              currentChatId === chat.id && "android-list-item-selected",
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{chat.title}</p>
                              <p className="text-xs text-muted-foreground">{formatTime(chat.createdAt)}</p>
                            </div>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteChat(chat.id)}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 android-icon-button"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3">
              <div className="android-avatar">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Chat</h1>
                <p className="text-sm text-muted-foreground">Met {user.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportChat} disabled={messages.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 android-message-container",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="android-avatar flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] android-message-bubble group",
                  message.role === "user" ? "android-message-user" : "android-message-assistant",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {message.fileName && (
                      <div className="flex items-center gap-2 mb-2 text-sm opacity-70">
                        <Upload className="h-3 w-3" />
                        {message.fileName}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">{formatTime(message.timestamp)}</p>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0 android-icon-button-small"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(message.content)}
                        className="h-6 w-6 p-0 android-icon-button-small"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {message.role === "user" && (
                <div className="android-avatar-user flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 android-message-container">
              <div className="android-avatar">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="android-message-bubble android-message-assistant">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="android-input-container p-6 border-t">
        {selectedFile && (
          <div className="android-file-preview mb-4">
            <Upload className="h-4 w-4" />
            <span className="text-sm flex-1">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              className="android-icon-button-small"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="android-input-form">
          <div className="android-input-wrapper">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Typ je bericht..."
              disabled={isLoading}
              className="android-input"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="android-input-action"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={cn("android-input-action", isListening && "text-red-500")}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className="android-send-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
