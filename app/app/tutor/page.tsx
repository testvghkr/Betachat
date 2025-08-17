"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, ArrowLeft, Trash2, Copy, Download, Send, CheckCircle, Clock, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface TutorSession {
  id: string
  subject: string
  question: string
  explanation: string
  level: string
  timestamp: number
}

export default function TutorPage() {
  const { user } = useAuth()
  const [question, setQuestion] = useState("")
  const [subject, setSubject] = useState("wiskunde")
  const [level, setLevel] = useState("middelbaar")
  const [isGenerating, setIsGenerating] = useState(false)
  const [sessions, setSessions] = useState<TutorSession[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`tutor_sessions_${user.id}`)
      if (saved) {
        setSessions(JSON.parse(saved))
      }
    }
  }, [user])

  const saveSession = (session: TutorSession) => {
    if (!user) return

    const updated = [session, ...sessions]
    setSessions(updated)
    localStorage.setItem(`tutor_sessions_${user.id}`, JSON.stringify(updated))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) ||
        '{"totalChats":0,"totalCalculations":0,"totalDocuments":0,"totalCodeSessions":0,"totalCreativeProjects":0,"totalTutorSessions":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalTutorSessions += 1
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    activities.unshift({
      id: Date.now().toString(),
      type: "tutor",
      description: `Leer sessie: ${session.subject}`,
      timestamp: Date.now(),
    })
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
  }

  const generateExplanation = async () => {
    if (!question.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let explanation = ""

      // Generate subject-specific explanations
      switch (subject) {
        case "wiskunde":
          if (question.toLowerCase().includes("algebra") || question.toLowerCase().includes("vergelijking")) {
            explanation = `📚 Wiskunde Uitleg: ${question}\n\n🎯 Stap-voor-stap uitleg:\n\n1️⃣ **Begrijp het probleem**\n   ${question} is een algebraïsch probleem. We gaan dit systematisch oplossen.\n\n2️⃣ **Identificeer de variabelen**\n   Kijk welke onbekenden er zijn en wat we moeten vinden.\n\n3️⃣ **Stel de vergelijking op**\n   Vertaal het probleem naar wiskundige taal.\n\n4️⃣ **Los stap voor stap op**\n   - Isoleer de variabele\n   - Gebruik inverse bewerkingen\n   - Controleer je antwoord\n\n💡 **Tips voor ${level} niveau:**\n- Werk altijd netjes en gestructureerd\n- Controleer je antwoord door substitutie\n- Oefen met vergelijkbare opgaven\n\n📖 **Volgende stappen:**\nProbeer zelf een vergelijkbare opgave te maken en pas dezelfde methode toe.`
          } else if (question.toLowerCase().includes("geometrie") || question.toLowerCase().includes("driehoek")) {
            explanation = `📐 Geometrie Uitleg: ${question}\n\n🎯 Geometrische concepten:\n\n1️⃣ **Basis principes**\n   ${question} betreft geometrische vormen en hun eigenschappen.\n\n2️⃣ **Belangrijke formules**\n   - Oppervlakte driehoek: ½ × basis × hoogte\n   - Omtrek: som van alle zijden\n   - Stelling van Pythagoras: a² + b² = c²\n\n3️⃣ **Oplossingsmethode**\n   - Teken een duidelijke figuur\n   - Label alle bekende waarden\n   - Kies de juiste formule\n   - Bereken stap voor stap\n\n💡 **Visualisatie tips:**\n- Maak altijd een tekening\n- Gebruik verschillende kleuren voor verschillende elementen\n- Controleer of je antwoord logisch is\n\n🔍 **Voor ${level} niveau:**\nFocus op het begrijpen van de concepten voordat je formules toepast.`
          } else {
            explanation = `🧮 Wiskunde Hulp: ${question}\n\n📝 **Probleemanalyse:**\nJe vraag over ${question} is interessant! Laten we dit samen uitwerken.\n\n🎯 **Aanpak voor ${level} niveau:**\n\n1️⃣ **Begrijp de vraag**\n   Wat wordt er precies gevraagd?\n\n2️⃣ **Verzamel informatie**\n   Welke gegevens heb je?\n\n3️⃣ **Kies een strategie**\n   Welke methode past het beste?\n\n4️⃣ **Werk het uit**\n   Stap voor stap naar de oplossing\n\n5️⃣ **Controleer**\n   Klopt je antwoord?\n\n💡 **Studietips:**\n- Oefen regelmatig met verschillende opgaven\n- Begrijp de theorie voordat je formules gebruikt\n- Vraag hulp als je vastloopt\n\n📚 **Aanvullende bronnen:**\nZoek naar vergelijkbare voorbeelden in je schoolboek of online.`
          }
          break
        case "nederlands":
          explanation = `📖 Nederlands Uitleg: ${question}\n\n✍️ **Taalkundige analyse:**\n\n1️⃣ **Onderwerp identificatie**\n   ${question} betreft Nederlandse taal en literatuur.\n\n2️⃣ **Belangrijke aspecten:**\n   - Grammatica en spelling\n   - Tekstbegrip en analyse\n   - Schrijfvaardigheid\n   - Literatuurgeschiedenis\n\n3️⃣ **Uitleg voor ${level} niveau:**\n   \n   **Als het over grammatica gaat:**\n   - Identificeer woordsoorten\n   - Analyseer zinsbouw\n   - Let op spelling en interpunctie\n   \n   **Als het over literatuur gaat:**\n   - Begrijp de context\n   - Analyseer thema's en motieven\n   - Kijk naar stijlmiddelen\n\n💡 **Studietips:**\n- Lees veel en gevarieerd\n- Oefen met schrijven\n- Gebruik een goed woordenboek\n- Maak samenvattingen van belangrijke teksten\n\n📚 **Hulpmiddelen:**\n- Van Dale woordenboek\n- Grammatica naslagwerken\n- Literaire tijdlijnen`
          break
        case "geschiedenis":
          explanation = `🏛️ Geschiedenis Uitleg: ${question}\n\n📜 **Historische context:**\n\n1️⃣ **Tijdsperiode**\n   ${question} plaatsen we in de juiste historische context.\n\n2️⃣ **Belangrijke elementen:**\n   - Oorzaken en gevolgen\n   - Belangrijke personen\n   - Maatschappelijke veranderingen\n   - Politieke ontwikkelingen\n\n3️⃣ **Analyse methode:**\n   \n   **Chronologisch denken:**\n   - Wat gebeurde er voor dit event?\n   - Wat waren de directe gevolgen?\n   - Hoe beïnvloedde dit de toekomst?\n   \n   **Kritisch denken:**\n   - Welke bronnen hebben we?\n   - Zijn er verschillende perspectieven?\n   - Wat kunnen we hiervan leren?\n\n🎯 **Voor ${level} niveau:**\n- Focus op hoofdlijnen en verbanden\n- Gebruik tijdlijnen en kaarten\n- Vergelijk met hedendaagse situaties\n\n📚 **Studietips:**\n- Maak tijdlijnen\n- Gebruik historische atlassen\n- Kijk naar documentaires\n- Bezoek musea en historische plaatsen`
          break
        default:
          explanation = `🎓 Studie Hulp: ${question}\n\n📚 **Algemene uitleg:**\n\nJe vraag over ${question} in het vak ${subject} is interessant! Hier is een gestructureerde uitleg:\n\n1️⃣ **Hoofdconcept**\n   Het belangrijkste wat je moet begrijpen over dit onderwerp.\n\n2️⃣ **Stap-voor-stap benadering**\n   - Begin met de basis\n   - Bouw geleidelijk op\n   - Oefen met voorbeelden\n   - Test je begrip\n\n3️⃣ **Voor ${level} niveau:**\n   De uitleg is aangepast aan jouw studieniveau.\n\n💡 **Algemene studietips:**\n- Maak aantekeningen\n- Stel vragen als je iets niet begrijpt\n- Oefen regelmatig\n- Zoek verbanden met andere onderwerpen\n\n📖 **Vervolgstappen:**\nProbeer het geleerde toe te passen in praktijkoefeningen.`
      }

      const session: TutorSession = {
        id: Date.now().toString(),
        subject,
        question: question.trim(),
        explanation,
        level,
        timestamp: Date.now(),
      }

      saveSession(session)
      setQuestion("")
    } catch (error) {
      console.error("Tutor generation error:", error)
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

  const downloadSession = (session: TutorSession) => {
    const content = `${session.subject.toUpperCase()} - ${session.level.toUpperCase()}\n\nVraag: ${session.question}\n\n${session.explanation}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tutor-${session.subject}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearSessions = () => {
    if (!user) return
    setSessions([])
    localStorage.removeItem(`tutor_sessions_${user.id}`)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-between px-4 text-white text-xs font-medium">
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
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Leer Assistent</h1>
            </div>
          </div>
          {sessions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSessions}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tutor Interface */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Stel je studievraag</span>
              </div>

              {/* Subject and Level Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vak:</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "wiskunde", label: "Wiskunde" },
                      { id: "nederlands", label: "Nederlands" },
                      { id: "geschiedenis", label: "Geschiedenis" },
                      { id: "biologie", label: "Biologie" },
                    ].map((subj) => (
                      <Button
                        key={subj.id}
                        variant={subject === subj.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSubject(subj.id)}
                        className={subject === subj.id ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                      >
                        {subj.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Niveau:</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "basisschool", label: "Basisschool" },
                      { id: "middelbaar", label: "Middelbaar" },
                      { id: "hoger", label: "Hoger" },
                    ].map((lvl) => (
                      <Button
                        key={lvl.id}
                        variant={level === lvl.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLevel(lvl.id)}
                        className={level === lvl.id ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                      >
                        {lvl.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Stel je vraag... Bijvoorbeeld: 'Hoe los ik een kwadratische vergelijking op?' of 'Wat is de hoofdgedachte van dit gedicht?'"
                className="min-h-[100px]"
                disabled={isGenerating}
              />

              <Button
                onClick={generateExplanation}
                disabled={!question.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uitleg genereren...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Krijg uitleg voor {subject}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study Sessions */}
        {sessions.length > 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Studie Sessies ({sessions.length})
                </span>
                <Badge variant="outline" className="text-xs">
                  {sessions.length} sessies
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 p-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-indigo-500 text-white text-xs">{session.subject}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {session.level}
                            </Badge>
                            <span className="text-xs text-gray-500">{formatTime(session.timestamp)}</span>
                          </div>
                          <h3 className="font-medium text-gray-900">Vraag: {session.question}</h3>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(session.explanation, session.id)}
                            className="p-1"
                          >
                            {copiedId === session.id ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadSession(session)} className="p-1">
                            <Download className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
                        <ScrollArea className="h-48">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {session.explanation}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welkom bij je Leer Assistent!</h3>
              <p className="text-gray-600 mb-4">
                Krijg persoonlijke uitleg en hulp bij al je studievragen. Van wiskunde tot geschiedenis!
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>📚 Kies je vak en niveau</p>
                <p>❓ Stel je studievraag</p>
                <p>🎓 Krijg uitgebreide uitleg</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
