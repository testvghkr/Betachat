'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Mic, MicOff, Volume2, VolumeX, Menu, User, MessageSquare, Sparkles, Upload, Download, Trash2, Copy, Code, Palette, Music, Video, BookOpen, Brain, Sun, Moon, Zap } from 'lucide-react'
import { cn, formatTime, generateId } from '@/lib/utils'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatHistory()
    initializeSpeechRecognition()
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChatHistory = () => {
    const saved = localStorage.getItem('qrp_chat_history')
    if (saved) {
      const history = JSON.parse(saved).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setChatHistory(history)
    }
  }

  const saveChatHistory = (history: ChatHistory[]) => {
    localStorage.setItem('qrp_chat_history', JSON.stringify(history))
    setChatHistory(history)
  }

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'nl-NL'

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

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        return url
      }
    } catch (error) {
      console.error('File upload failed:', error)
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedFile) return

    const userMessage: Message = {
      id: generateId(),
      content: input.trim() || `[Bestand: ${selectedFile?.name}]`,
      role: 'user',
      timestamp: new Date(),
      fileName: selectedFile?.name,
    }

    let fileUrl = null
    if (selectedFile) {
      fileUrl = await handleFileUpload(selectedFile)
      userMessage.fileUrl = fileUrl
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setSelectedFile(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          fileUrl: fileUrl
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: generateId(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        }

        const finalMessages = [...newMessages, assistantMessage]
        setMessages(finalMessages)
        
        // Auto-speak response if enabled
        if (isSpeaking) {
          speak(data.response)
        }

        // Save to chat history
        saveCurrentChat(finalMessages)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: generateId(),
        content: 'Sorry, er ging iets mis. Probeer het opnieuw.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const saveCurrentChat = (currentMessages: Message[]) => {
    if (currentMessages.length === 0) return

    const chatTitle = currentMessages[0]?.content.substring(0, 50) + '...' || 'Nieuwe Chat'
    
    let updatedHistory = [...chatHistory]
    
    if (currentChatId) {
      // Update existing chat
      const chatIndex = updatedHistory.findIndex(chat => chat.id === currentChatId)
      if (chatIndex !== -1) {
        updatedHistory[chatIndex] = {
          ...updatedHistory[chatIndex],
          messages: currentMessages,
          title: chatTitle
        }
      }
    } else {
      // Create new chat
      const newChat: ChatHistory = {
        id: generateId(),
        title: chatTitle,
        messages: currentMessages,
        createdAt: new Date()
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
    setMessages([])
    setCurrentChatId(null)
  }

  const deleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId)
    saveChatHistory(updatedHistory)
    
    if (currentChatId === chatId) {
      startNewChat()
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportChat = () => {
    const chatData = {
      title: `QRP Chat - ${new Date().toLocaleDateString('nl-NL')}`,
      messages: messages,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qrp-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900" 
        : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 glass-surface border-white/20">
                  <SheetHeader>
                    <SheetTitle className="text-white">Chat Geschiedenis</SheetTitle>
                    <SheetDescription className="text-white/60">
                      Je eerdere gesprekken met QRP
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <Button 
                      onClick={startNewChat}
                      className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
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
                                "w-full justify-start text-left h-auto p-3 text-white hover:bg-white/20",
                                currentChatId === chat.id && "bg-white/20"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{chat.title}</p>
                                <p className="text-xs text-white/60">
                                  {formatTime(chat.createdAt)}
                                </p>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteChat(chat.id)}
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/20"
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
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">QRP Chat</h1>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 border-purple-400/30">
                  <Zap className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/20"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={exportChat}
                disabled={messages.length === 0}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Hallo! 👋
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Ik ben QRP, je vriendelijke AI-assistent. Waar kan ik je mee helpen?
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Code, title: "Programmeren", desc: "Code schrijven & debuggen" },
                { icon: BookOpen, title: "Leren", desc: "Huiswerk & uitleg" },
                { icon: Palette, title: "Creativiteit", desc: "Ideeën & ontwerpen" },
                { icon: Brain, title: "Denken", desc: "Problemen oplossen" },
              ].map((feature, index) => (
                <Card key={index} className="glass-surface border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <feature.icon className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-white/60 mt-1">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-fade-in",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 glass-surface border-white/20",
                message.role === 'user' 
                  ? 'bg-primary/30 ml-auto text-primary-foreground' 
                  : 'bg-white/10 text-white'
              )}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {message.fileName && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-white/80">
                        <Upload className="h-3 w-3" />
                        {message.fileName}
                      </div>
                    )}
                    <p className="text-white whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-white/50 mt-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(message.content)}
                        className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 glass-surface border-white/20 bg-white/10">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <Card className="glass-surface border-white/20 sticky bottom-4">
          <CardContent className="p-4">
            {selectedFile && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-white/10 rounded-lg">
                <Upload className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80 flex-1">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Typ je bericht hier..."
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 focus:ring-primary focus:border-primary"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/20"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={cn(
                  "text-white hover:bg-white/20",
                  isListening && "bg-red-500/20 text-red-300"
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => speak(messages[messages.length - 1]?.content || '')}
                disabled={isLoading || messages.length === 0 || messages[messages.length - 1]?.role === 'user'}
                className={cn(
                  "text-white hover:bg-white/20",
                  isSpeaking && "bg-green-500/20 text-green-300"
                )}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedFile)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
