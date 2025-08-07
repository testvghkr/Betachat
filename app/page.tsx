"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mic, MicOff, Volume2, VolumeX, Send, Menu, User, Settings, LogOut, Upload, Download, Trash2, MessageSquare, Home } from 'lucide-react'
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  
  const { user, logout } = useAuth()
  const router = useRouter()

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem("qrp-chats")
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setChats(parsedChats)
      
      if (parsedChats.length > 0) {
        const latestChat = parsedChats[0]
        setCurrentChatId(latestChat.id)
        setMessages(latestChat.messages)
      }
    }
  }, [])

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("qrp-chats", JSON.stringify(chats))
    }
  }, [chats])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
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
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
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

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Nieuwe Chat",
      messages: [],
      createdAt: new Date()
    }
    
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setMessages([])
  }

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(c => c.id !== chatId)
      if (remainingChats.length > 0) {
        selectChat(remainingChats[0].id)
      } else {
        createNewChat()
      }
    }
  }

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "")
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ))
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.url
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedFile) return

    let messageContent = input.trim()
    
    // Handle file upload
    if (selectedFile) {
      const fileUrl = await uploadFile(selectedFile)
      if (fileUrl) {
        messageContent += `\n\n[Bestand: ${selectedFile.name}](${fileUrl})`
      }
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date()
    }

    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantContent += parsed.content
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantContent }
                      : msg
                  ))
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }

      // Update chat with new messages
      const finalMessages = [...newMessages, { ...assistantMessage, content: assistantContent }]
      
      if (currentChatId) {
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        ))
        
        // Update chat title if it's the first message
        if (messages.length === 0) {
          updateChatTitle(currentChatId, messageContent)
        }
      }

    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, er is een fout opgetreden. Probeer het opnieuw.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const exportChat = () => {
    const chatData = {
      title: chats.find(c => c.id === currentChatId)?.title || "Chat Export",
      messages: messages,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qrp-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="mx-auto mb-4" />
            <CardTitle className="md-headline-small">Welkom bij QRP Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full md-filled-button"
            >
              Inloggen
            </Button>
            <Button 
              onClick={() => router.push("/login")} 
              variant="outline" 
              className="w-full"
            >
              Registreren
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col border-r border-outline-variant">
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/qrp-logo.png" alt="QRP Logo" width={40} height={40} />
            <h1 className="md-title-large font-semibold">QRP Chat</h1>
          </div>
          <Button onClick={createNewChat} className="w-full md-filled-button">
            <MessageSquare className="w-4 h-4 mr-2" />
            Nieuwe Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="md-body-medium truncate">{chat.title}</div>
                    <div className="md-body-small text-muted-foreground">
                      {chat.messages.length} berichten
                    </div>
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteChat(chat.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-outline-variant">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/account")}>
                <Settings className="w-4 h-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4 border-b border-outline-variant">
                  <div className="flex items-center gap-3">
                    <Image src="/qrp-logo.png" alt="QRP Logo" width={40} height={40} />
                    <SheetTitle className="md-title-large">QRP Chat</SheetTitle>
                  </div>
                  <Button onClick={createNewChat} className="w-full md-filled-button">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nieuwe Chat
                  </Button>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <div key={chat.id} className="group relative">
                        <Button
                          variant={currentChatId === chat.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => selectChat(chat.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="md-body-medium truncate">{chat.title}</div>
                            <div className="md-body-small text-muted-foreground">
                              {chat.messages.length} berichten
                            </div>
                          </div>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteChat(chat.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
            <div className="md:hidden flex items-center gap-2">
              <Image src="/qrp-logo.png" alt="QRP Logo" width={32} height={32} />
              <h1 className="md-title-medium font-semibold">QRP</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportChat}>
              <Download className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="mx-auto mb-6 opacity-50" />
                <h2 className="md-headline-small mb-2">Hallo! Ik ben QRP</h2>
                <p className="md-body-large text-muted-foreground mb-6">
                  Ik ben je vriendelijke Nederlandse AI-assistent. Ik kan je helpen met vragen, code schrijven, huiswerk maken, en nog veel meer!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Code schrijven</Badge>
                  <Badge variant="secondary">Huiswerk hulp</Badge>
                  <Badge variant="secondary">Creatieve projecten</Badge>
                  <Badge variant="secondary">Algemene vragen</Badge>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Image src="/qrp-logo.png" alt="QRP" width={20} height={20} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                    <Card className={`${message.role === "user" ? "bg-primary text-primary-foreground" : "md-card"}`}>
                      <CardContent className="p-4">
                        <div className="md-body-medium whitespace-pre-wrap">{message.content}</div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speak(message.content)}
                              disabled={isSpeaking}
                            >
                              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <div className="md-body-small text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Image src="/qrp-logo.png" alt="QRP" width={20} height={20} />
                </div>
                <Card className="md-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-bounce-gentle w-2 h-2 bg-primary rounded-full"></div>
                      <div className="animate-bounce-gentle w-2 h-2 bg-primary rounded-full" style={{ animationDelay: "0.1s" }}></div>
                      <div className="animate-bounce-gentle w-2 h-2 bg-primary rounded-full" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-outline-variant">
          <div className="max-w-4xl mx-auto">
            {selectedFile && (
              <div className="mb-3 p-3 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="md-body-small">{selectedFile.name}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedFile(null)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Typ je bericht..."
                  disabled={isLoading}
                  className="md-input pr-12"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.js,.py,.html,.css,.json"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={isListening ? "bg-destructive text-destructive-foreground" : ""}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button type="submit" disabled={isLoading || (!input.trim() && !selectedFile)} className="md-filled-button">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
