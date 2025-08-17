"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ArrowLeft, Trash2, Copy, Download, Sparkles, Send, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface Document {
  id: string
  title: string
  content: string
  type: string
  timestamp: number
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [documentType, setDocumentType] = useState("brief")
  const [isGenerating, setIsGenerating] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`documents_${user.id}`)
      if (saved) {
        setDocuments(JSON.parse(saved))
      }
    }
  }, [user])

  const saveDocument = (document: Document) => {
    if (!user) return

    const updated = [document, ...documents]
    setDocuments(updated)
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(updated))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) ||
        '{"totalChats":0,"totalCalculations":0,"totalDocuments":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalDocuments += 1
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    activities.unshift({
      id: Date.now().toString(),
      type: "document",
      description: `Document gemaakt: ${document.title}`,
      timestamp: Date.now(),
    })
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
  }

  const generateDocument = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let content = ""
      let title = ""

      switch (documentType) {
        case "brief":
          title = `Brief: ${prompt.slice(0, 30)}...`
          content = `Beste lezer,\n\nIk schrijf u deze brief betreffende ${prompt}.\n\nNa zorgvuldige overweging van de situatie, wil ik graag het volgende delen:\n\n${prompt} is een belangrijk onderwerp dat onze aandacht verdient. Door middel van deze brief hoop ik duidelijkheid te verschaffen over de verschillende aspecten die hiermee samenhangen.\n\nIk vertrouw erop dat deze informatie nuttig voor u is en sta open voor verdere vragen of discussie over dit onderwerp.\n\nMet vriendelijke groet,\n${user?.name || "Gebruiker"}`
          break
        case "rapport":
          title = `Rapport: ${prompt.slice(0, 30)}...`
          content = `RAPPORT\n\nOnderwerp: ${prompt}\nDatum: ${new Date().toLocaleDateString("nl-NL")}\nAuteur: ${user?.name || "Gebruiker"}\n\n1. INLEIDING\n\nDit rapport behandelt ${prompt} en geeft een overzicht van de belangrijkste bevindingen en aanbevelingen.\n\n2. ANALYSE\n\nNa onderzoek naar ${prompt} kunnen we concluderen dat dit een complex onderwerp is dat verschillende aspecten omvat. De analyse toont aan dat er meerdere factoren een rol spelen.\n\n3. BEVINDINGEN\n\n- Het onderwerp ${prompt} vereist zorgvuldige aandacht\n- Er zijn verschillende benaderingen mogelijk\n- Verdere studie wordt aanbevolen\n\n4. CONCLUSIE\n\nOp basis van dit onderzoek kunnen we stellen dat ${prompt} een belangrijk onderwerp is dat verdere aandacht verdient.\n\n5. AANBEVELINGEN\n\n- Implementeer de voorgestelde maatregelen\n- Monitor de voortgang regelmatig\n- Evalueer de resultaten na implementatie`
          break
        case "essay":
          title = `Essay: ${prompt.slice(0, 30)}...`
          content = `${prompt.toUpperCase()}\n\nInleiding\n\n${prompt} is een fascinerend onderwerp dat vele aspecten van ons dagelijks leven raakt. In dit essay zal ik verschillende perspectieven onderzoeken en mijn eigen visie delen op dit belangrijke thema.\n\nHoofddeel\n\nWanneer we ${prompt} nader bekijken, vallen verschillende interessante aspecten op. Ten eerste is het belangrijk om te begrijpen dat dit onderwerp niet in isolatie bestaat, maar deel uitmaakt van een groter geheel.\n\nDaarnaast speelt ${prompt} een cruciale rol in de manier waarop we onze wereld begrijpen en vormgeven. De impact hiervan is merkbaar in verschillende sectoren en heeft gevolgen voor zowel individuen als de samenleving als geheel.\n\nTen slotte is het essentieel om te erkennen dat ${prompt} een dynamisch onderwerp is dat voortdurend evolueert. Dit vereist een flexibele benadering en openheid voor nieuwe inzichten.\n\nConclusie\n\nSamenvattend kunnen we stellen dat ${prompt} een complex maar boeiend onderwerp is dat onze voortdurende aandacht verdient. Door verschillende perspectieven te onderzoeken en kritisch na te denken, kunnen we tot een dieper begrip komen van dit belangrijke thema.`
          break
        default:
          title = `Document: ${prompt.slice(0, 30)}...`
          content = `Dit document behandelt: ${prompt}\n\nInhoud wordt gegenereerd op basis van uw verzoek. De AI heeft een gestructureerd document gemaakt dat uw specificaties volgt.\n\n${prompt}\n\nDit is een voorbeeld van hoe de AI uw verzoek interpreteert en omzet in bruikbare content.`
      }

      const document: Document = {
        id: Date.now().toString(),
        title,
        content,
        type: documentType,
        timestamp: Date.now(),
      }

      saveDocument(document)
      setPrompt("")
    } catch (error) {
      console.error("Document generation error:", error)
    } finally {
      setIsGenerating(false)
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

  const downloadDocument = (document: Document) => {
    const blob = new Blob([document.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title.replace(/[^a-z0-9]/gi, "_")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearDocuments = () => {
    if (!user) return
    setDocuments([])
    localStorage.removeItem(`documents_${user.id}`)
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Nu"
    if (minutes < 60) return `${minutes}m geleden`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}u geleden`
    return new Date(timestamp).toLocaleDateString("nl-NL")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-between px-4 text-white text-xs font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Document AI</h1>
            </div>
          </div>
          {documents.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDocuments}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Document Generator */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Nieuw document maken</span>
              </div>

              {/* Document Type Selector */}
              <div className="flex space-x-2">
                {[
                  { id: "brief", label: "Brief" },
                  { id: "rapport", label: "Rapport" },
                  { id: "essay", label: "Essay" },
                  { id: "artikel", label: "Artikel" },
                ].map((type) => (
                  <Button
                    key={type.id}
                    variant={documentType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDocumentType(type.id)}
                    className={documentType === type.id ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Beschrijf wat voor document je wilt maken... Bijvoorbeeld: 'Een brief aan de gemeente over straatverlichting' of 'Een rapport over klimaatverandering'"
                className="min-h-[100px]"
                disabled={isGenerating}
              />

              <Button
                onClick={generateDocument}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Document genereren...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Genereer {documentType}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        {documents.length > 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Mijn Documenten ({documents.length})
                </span>
                <Badge variant="outline" className="text-xs">
                  {documents.length} documenten
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 p-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-500 text-white text-xs">{doc.type}</Badge>
                            <span className="text-xs text-gray-500">{formatTime(doc.timestamp)}</span>
                          </div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(doc.content, doc.id)}
                            className="p-1"
                          >
                            {copiedId === doc.id ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc)} className="p-1">
                            <Download className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <ScrollArea className="h-32">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{doc.content}</p>
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welkom bij Document AI!</h3>
              <p className="text-gray-600 mb-4">
                Laat AI je helpen met het maken van professionele documenten zoals brieven, rapporten en essays.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>📝 Kies een documenttype</p>
                <p>✍️ Beschrijf wat je wilt</p>
                <p>🚀 Laat AI het document genereren</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
