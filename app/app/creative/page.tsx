"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Palette,
  ArrowLeft,
  Trash2,
  Copy,
  Download,
  Sparkles,
  Send,
  CheckCircle,
  Clock,
  ImageIcon,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface CreativeProject {
  id: string
  title: string
  type: string
  description: string
  content: string
  timestamp: number
}

export default function CreativePage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [projectType, setProjectType] = useState("afbeelding")
  const [isGenerating, setIsGenerating] = useState(false)
  const [projects, setProjects] = useState<CreativeProject[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`creative_projects_${user.id}`)
      if (saved) {
        setProjects(JSON.parse(saved))
      }
    }
  }, [user])

  const saveProject = (project: CreativeProject) => {
    if (!user) return

    const updated = [project, ...projects]
    setProjects(updated)
    localStorage.setItem(`creative_projects_${user.id}`, JSON.stringify(updated))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) ||
        '{"totalChats":0,"totalCalculations":0,"totalDocuments":0,"totalCodeSessions":0,"totalCreativeProjects":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalCreativeProjects += 1
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    activities.unshift({
      id: Date.now().toString(),
      type: "creative",
      description: `Creatief project: ${project.title}`,
      timestamp: Date.now(),
    })
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
  }

  const generateCreative = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      let content = ""
      let description = ""
      const title = `${projectType}: ${prompt.slice(0, 30)}...`

      switch (projectType) {
        case "afbeelding":
          content = `🎨 AI Afbeelding Concept\n\n📝 Prompt: ${prompt}\n\n🖼️ Beschrijving:\nEen prachtige ${prompt} met levendige kleuren en artistieke details. De compositie toont een harmonieuze balans tussen licht en schaduw, met aandacht voor textuur en diepte.\n\n🎯 Stijl: Digitale kunst\n📐 Formaat: 1024x1024 pixels\n🌈 Kleurenpalet: Warm en uitnodigend\n\n💡 Creatieve elementen:\n- Dynamische compositie\n- Rijke kleurvariaties\n- Gedetailleerde texturen\n- Artistieke interpretatie van ${prompt}`
          description = `AI-gegenereerd afbeeldingsconcept voor ${prompt}`
          break
        case "logo":
          content = `🏷️ Logo Design Concept\n\n📝 Concept: ${prompt}\n\n🎨 Design Beschrijving:\nEen modern en memorabel logo voor ${prompt}. Het ontwerp combineert eenvoud met elegantie, waarbij de kernwaarden van het merk worden weerspiegeld.\n\n📊 Design Specificaties:\n- Stijl: Modern en minimalistisch\n- Kleuren: Professioneel kleurenpalet\n- Typografie: Schoon en leesbaar\n- Schaalbaarheid: Werkt op alle formaten\n\n🎯 Logo Elementen:\n- Hoofdsymbool: Abstracte representatie van ${prompt}\n- Typografie: Sans-serif lettertype\n- Kleurschema: Primaire en secundaire kleuren\n- Varianten: Volledig kleur, zwart-wit, en pictogram\n\n💼 Toepassingen:\n- Visitekaartjes\n- Website headers\n- Social media profielen\n- Merchandise`
          description = `Logo design concept voor ${prompt}`
          break
        case "poster":
          content = `📋 Poster Design\n\n🎯 Thema: ${prompt}\n\n🎨 Visual Concept:\nEen opvallende poster die de essentie van ${prompt} vastlegt. Het design gebruikt krachtige visuele elementen om de boodschap over te brengen.\n\n📐 Layout Specificaties:\n- Formaat: A3 (297 x 420 mm)\n- Oriëntatie: Staand\n- Resolutie: 300 DPI\n- Kleurmodus: CMYK\n\n🎨 Design Elementen:\n- Hoofdtitel: "${prompt}"\n- Visuele hiërarchie: Duidelijke informatiestructuur\n- Kleurgebruik: Contrastrijke combinaties\n- Typografie: Mix van display en body fonts\n\n📝 Content Structuur:\n- Hoofdboodschap prominent weergegeven\n- Ondersteunende informatie\n- Call-to-action indien van toepassing\n- Contact/website informatie\n\n🎯 Doelgroep: Aangepast aan de context van ${prompt}`
          description = `Poster design voor ${prompt}`
          break
        case "banner":
          content = `🏳️ Banner Design\n\n📢 Boodschap: ${prompt}\n\n🎨 Banner Concept:\nEen professionele banner die de aandacht trekt en de boodschap van ${prompt} effectief communiceert. Het ontwerp is geoptimaliseerd voor digitale en print media.\n\n📐 Specificaties:\n- Formaat: 728 x 90 pixels (web banner)\n- Alternatief: 300 x 250 pixels (medium rectangle)\n- Bestandstype: PNG/JPG voor web, PDF voor print\n- Kleurmodus: RGB voor digitaal, CMYK voor print\n\n🎯 Design Elementen:\n- Hoofdboodschap: "${prompt}"\n- Visuele impact: Sterke grafische elementen\n- Kleurschema: Merkgerelateerde kleuren\n- Call-to-action: Duidelijk zichtbaar\n\n📱 Responsive Design:\n- Desktop versie: Volledig formaat\n- Tablet versie: Aangepaste lay-out\n- Mobile versie: Gecomprimeerde versie\n\n🎨 Visuele Stijl:\n- Modern en professioneel\n- Consistent met merkidentiteit\n- Hoge leesbaarheid\n- Aantrekkelijke visuele hiërarchie`
          description = `Banner design voor ${prompt}`
          break
        default:
          content = `🎨 Creatief Project\n\n💡 Concept: ${prompt}\n\nDit is een creatief AI-project gebaseerd op jouw idee. Het combineert artistieke visie met technische precisie om een uniek resultaat te creëren.`
          description = `Creatief project voor ${prompt}`
      }

      const project: CreativeProject = {
        id: Date.now().toString(),
        title,
        type: projectType,
        description,
        content,
        timestamp: Date.now(),
      }

      saveProject(project)
      setPrompt("")
    } catch (error) {
      console.error("Creative generation error:", error)
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

  const downloadProject = (project: CreativeProject) => {
    const blob = new Blob([project.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.title.replace(/[^a-z0-9]/gi, "_")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearProjects = () => {
    if (!user) return
    setProjects([])
    localStorage.removeItem(`creative_projects_${user.id}`)
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-between px-4 text-white text-xs font-medium">
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
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Creatieve AI</h1>
            </div>
          </div>
          {projects.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearProjects}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Creative Generator */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-gray-700">Creatief project maken</span>
              </div>

              {/* Project Type Selector */}
              <div className="flex space-x-2">
                {[
                  { id: "afbeelding", label: "Afbeelding", icon: ImageIcon },
                  { id: "logo", label: "Logo", icon: Sparkles },
                  { id: "poster", label: "Poster", icon: Palette },
                  { id: "banner", label: "Banner", icon: Wand2 },
                ].map((type) => (
                  <Button
                    key={type.id}
                    variant={projectType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProjectType(type.id)}
                    className={projectType === type.id ? "bg-pink-500 hover:bg-pink-600" : ""}
                  >
                    <type.icon className="w-3 h-3 mr-1" />
                    {type.label}
                  </Button>
                ))}
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Beschrijf je creatieve idee... Bijvoorbeeld: 'Een logo voor een bakkerij met warme kleuren' of 'Een poster voor een muziekfestival'"
                className="min-h-[100px]"
                disabled={isGenerating}
              />

              <Button
                onClick={generateCreative}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creatief project genereren...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Maak {projectType}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {projects.length > 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Creatieve Projecten ({projects.length})
                </span>
                <Badge variant="outline" className="text-xs">
                  {projects.length} projecten
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 p-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-pink-500 text-white text-xs">{project.type}</Badge>
                            <span className="text-xs text-gray-500">{formatTime(project.timestamp)}</span>
                          </div>
                          <h3 className="font-medium text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(project.content, project.id)}
                            className="p-1"
                          >
                            {copiedId === project.id ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadProject(project)} className="p-1">
                            <Download className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                        <ScrollArea className="h-32">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{project.content}</pre>
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welkom bij Creatieve AI!</h3>
              <p className="text-gray-600 mb-4">
                Laat AI je helpen met het maken van creatieve projecten zoals afbeeldingen, logo's en posters.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>🎨 Kies een projecttype</p>
                <p>💡 Beschrijf je creatieve visie</p>
                <p>✨ Laat AI het concept uitwerken</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
