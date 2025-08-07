"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Menu, MessageSquare, Sparkles, Code, BookOpen, Palette, Music, Video, ImageIcon, Calculator, Trash2, Download, Share2, Moon, Sun, Mic, MicOff, Volume2, VolumeX, Zap, Heart, Rocket, User, LogOut } from 'lucide-react'
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export default function ChatPage() {
  const { user, logout } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('qrp-chats')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setChats(parsedChats)
      
      // Load the most recent chat
      if (parsedChats.length > 0) {
        const mostRecentChat = parsedChats[0]
        setCurrentChatId(mostRecentChat.id)
        setMessages(mostRecentChat.messages)
      }
    }
  }, [])

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('qrp-chats', JSON.stringify(chats))
    }
  }, [chats])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Nieuwe Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setMessages([])
  }

  const loadChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
      setMessages([])
    }
  }

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + "..." 
      : firstMessage
    
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title, updatedAt: new Date() }
        : chat
    ))
  }

  const updateChatMessages = (chatId: string, newMessages: Message[]) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: newMessages, updatedAt: new Date() }
        : chat
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Create new chat if none exists
    let chatId = currentChatId
    if (!chatId) {
      createNewChat()
      chatId = Date.now().toString()
      setCurrentChatId(chatId)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Update chat title if this is the first message
    if (messages.length === 0 && chatId) {
      updateChatTitle(chatId, userMessage.content)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      
      // Update the chat in the chats array
      if (chatId) {
        updateChatMessages(chatId, finalMessages)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, er ging iets mis. Probeer het opnieuw.",
        role: 'assistant',
        timestamp: new Date()
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      
      if (chatId) {
        updateChatMessages(chatId, finalMessages)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'nl-NL'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

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

      recognition.start()
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'nl-NL'
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const exportChat = () => {
    if (messages.length === 0) return
    
    const chatData = {
      title: chats.find(c => c.id === currentChatId)?.title || "QRP Chat",
      messages: messages,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qrp-chat-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareChat = async () => {
    if (messages.length === 0) return
    
    const chatText = messages.map(m => `${m.role === 'user' ? 'Jij' : 'QRP'}: ${m.content}`).join('\n\n')
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QRP Chat',
          text: chatText,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(chatText)
    }
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sheet>
          <div className="hidden md:flex md:w-80 md:flex-col md:border-r md:border-border">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">QRP</h1>
              </div>
              <Button
                onClick={createNewChat}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs opacity-60">
                        {chat.updatedAt.toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.username || 'Gebruiker'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.isGuest ? 'Gast' : 'Gebruiker'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>QRP</span>
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-2">
                <Button
                  onClick={createNewChat}
                  className="w-full justify-start mb-4"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nieuwe Chat
                </Button>

                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs opacity-60">
                        {chat.updatedAt.toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Mobile User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.username || 'Gebruiker'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.isGuest ? 'Gast' : 'Gebruiker'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center md:hidden">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {chats.find(c => c.id === currentChatId)?.title || "QRP Chat"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Jouw vriendelijke AI-assistent
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-muted-foreground hover:text-foreground"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={exportChat}
                disabled={messages.length === 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={shareChat}
                disabled={messages.length === 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Hallo! Ik ben QRP 👋
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Jouw vriendelijke AI-assistent die je helpt met leren, coderen, creatieve projecten en nog veel meer!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je me helpen met programmeren?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Programmeren</h4>
                          <p className="text-sm text-muted-foreground">Code schrijven & debuggen</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je me helpen met mijn huiswerk?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Leren</h4>
                          <p className="text-sm text-muted-foreground">Huiswerk & uitleg</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je een creatief project voor me maken?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Creativiteit</h4>
                          <p className="text-sm text-muted-foreground">Kunst & design</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je muziek voor me maken?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                          <Music className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Muziek</h4>
                          <p className="text-sm text-muted-foreground">Componeren & bewerken</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je een video voor me maken?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Video</h4>
                          <p className="text-sm text-muted-foreground">Animaties & clips</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setInput("Kun je een afbeelding voor me genereren?")}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Afbeeldingen</h4>
                          <p className="text-sm text-muted-foreground">AI-gegenereerde kunst</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-muted text-muted-foreground mr-12'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-60">
                              {message.timestamp.toLocaleTimeString('nl-NL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                              >
                                {isSpeaking ? (
                                  <VolumeX className="w-3 h-3" />
                                ) : (
                                  <Volume2 className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted text-muted-foreground mr-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white animate-pulse" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-6">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Typ je bericht hier..."
                    disabled={isLoading}
                    className="pr-12 bg-surface-container border-outline-variant focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={startListening}
                    disabled={isLoading || isListening}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              
              <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Powered by Google AI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>Made with love</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Rocket className="w-3 h-3" />
                  <span>QRP v2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
