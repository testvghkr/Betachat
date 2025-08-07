'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Mic, StopCircle, History, Trash2, Zap, Upload, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  fileUrl?: string
  fileName?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [chatHistory, setChatHistory] = useState<string[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load chat history from localStorage on mount
    const savedHistory = localStorage.getItem('chatHistory')
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }
    // Load current chat messages if a chat ID is active
    if (currentChatId) {
      const savedChat = localStorage.getItem(`chat-${currentChatId}`)
      if (savedChat) {
        setMessages(JSON.parse(savedChat))
      }
    }
  }, [currentChatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (input.trim() === '' && !selectedFile) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      fileName: selectedFile ? selectedFile.name : undefined,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')
    setSelectedFile(null)

    try {
      const formData = new FormData()
      formData.append('prompt', input)
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])

      // Save chat to history
      const updatedMessages = [...messages, newMessage, assistantMessage]
      if (!currentChatId) {
        const newChatId = `chat-${Date.now()}`
        setCurrentChatId(newChatId)
        localStorage.setItem(`chat-${newChatId}`, JSON.stringify(updatedMessages))
        setChatHistory((prevHistory) => {
          const newHistory = [...prevHistory, newChatId]
          localStorage.setItem('chatHistory', JSON.stringify(newHistory))
          return newHistory
        })
      } else {
        localStorage.setItem(`chat-${currentChatId}`, JSON.stringify(updatedMessages))
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString() + '-error',
          role: 'assistant',
          content: 'Sorry, er ging iets mis. Probeer het opnieuw.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data])
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }
        // Send audio to API for transcription (placeholder)
        const transcribedText = await transcribeAudio(audioBlob)
        setInput(transcribedText)
        setAudioChunks([])
      }
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Placeholder for actual transcription API call
    console.log('Transcribing audio:', audioBlob)
    return 'Dit is een voorbeeld van getranscribeerde tekst.' // Mock transcription
  }

  const handleClearChat = () => {
    setMessages([])
    if (currentChatId) {
      localStorage.removeItem(`chat-${currentChatId}`)
      setChatHistory((prevHistory) => {
        const newHistory = prevHistory.filter((id) => id !== currentChatId)
        localStorage.setItem('chatHistory', JSON.stringify(newHistory))
        return newHistory
      })
      setCurrentChatId(null)
    }
  }

  const handleLoadChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(`/api/download?fileUrl=${encodeURIComponent(fileUrl)}&fileName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Bestand kon niet worden gedownload.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface-container-lowest text-on-surface">
      <header className="flex items-center justify-between p-4 bg-primary text-on-primary shadow-md">
        <h1 className="text-xl font-bold">QRP Chatbot</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => alert('Geschiedenis openen')}>
            <History className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClearChat}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 flex flex-col">
        <ScrollArea className="flex-1 p-4 rounded-lg bg-surface-container shadow-inner mb-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <p className="text-lg font-semibold">Hallo! Ik ben QRP, je vriendelijke AI-assistent.</p>
                <p className="text-sm">Waar kan ik je vandaag mee helpen?</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <Card
                  className={cn(
                    'max-w-[70%] p-3 rounded-lg shadow-md',
                    message.role === 'user'
                      ? 'bg-primary text-on-primary rounded-br-none'
                      : 'bg-surface-container-high text-on-surface rounded-bl-none'
                  )}
                >
                  <CardContent className="p-0">
                    <p>{message.content}</p>
                    {message.fileUrl && (
                      <div className="mt-2">
                        {message.fileUrl.startsWith('blob:') ? (
                          <img src={message.fileUrl || "/placeholder.svg"} alt={message.fileName || 'Uploaded file'} className="max-w-full h-auto rounded-md" />
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadFile(message.fileUrl!, message.fileName || 'download')}>
                            <Download className="h-4 w-4 mr-2" /> {message.fileName || 'Bestand'}
                          </Button>
                        )}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 p-2 bg-surface-container-high rounded-lg shadow-lg">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="ghost" size="icon" asChild>
              <Upload className="h-5 w-5 text-on-surface-variant" />
            </Button>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </label>
          {selectedFile && (
            <Badge variant="secondary" className="mr-2">
              {selectedFile.name}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setSelectedFile(null)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Input
            type="text"
            placeholder="Typ je bericht..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            className="flex-1 bg-surface-container-low border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-on-surface"
          />
          {isRecording ? (
            <Button variant="ghost" size="icon" onClick={stopRecording}>
              <StopCircle className="h-5 w-5 text-error" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={startRecording}>
              <Mic className="h-5 w-5 text-on-surface-variant" />
            </Button>
          )}
          <Button size="icon" onClick={handleSendMessage} className="bg-primary text-on-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <audio ref={audioRef} controls className="hidden" />
      </main>
    </div>
  )
}
