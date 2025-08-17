"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, ArrowLeft, Trash2, Copy, Download, Sparkles, Send, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface CodeSession {
  id: string
  title: string
  language: string
  code: string
  explanation: string
  timestamp: number
}

export default function CodePage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isGenerating, setIsGenerating] = useState(false)
  const [sessions, setSessions] = useState<CodeSession[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`code_sessions_${user.id}`)
      if (saved) {
        setSessions(JSON.parse(saved))
      }
    }
  }, [user])

  const saveSession = (session: CodeSession) => {
    if (!user) return

    const updated = [session, ...sessions]
    setSessions(updated)
    localStorage.setItem(`code_sessions_${user.id}`, JSON.stringify(updated))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) ||
        '{"totalChats":0,"totalCalculations":0,"totalDocuments":0,"totalCodeSessions":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalCodeSessions += 1
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    activities.unshift({
      id: Date.now().toString(),
      type: "code",
      description: `Code gegenereerd: ${session.title}`,
      timestamp: Date.now(),
    })
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
  }

  const generateCode = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let code = ""
      let explanation = ""
      const title = `${language}: ${prompt.slice(0, 30)}...`

      switch (language) {
        case "javascript":
          if (prompt.toLowerCase().includes("functie") || prompt.toLowerCase().includes("function")) {
            code = `// ${prompt}\nfunction myFunction() {\n  // Implementatie van ${prompt}\n  console.log("Functie uitgevoerd!");\n  \n  // Voorbeeld logica\n  const result = "Resultaat van " + "${prompt}";\n  return result;\n}\n\n// Gebruik van de functie\nconst output = myFunction();\nconsole.log(output);`
            explanation = `Deze JavaScript functie implementeert ${prompt}. De code bevat een basis structuur die je kunt aanpassen naar je specifieke behoeften.`
          } else if (prompt.toLowerCase().includes("array") || prompt.toLowerCase().includes("lijst")) {
            code = `// ${prompt}\nconst myArray = [];\n\n// Elementen toevoegen\nmyArray.push("item1", "item2", "item3");\n\n// Door array itereren\nmyArray.forEach((item, index) => {\n  console.log(\`Item \${index}: \${item}\`);\n});\n\n// Array filteren\nconst filtered = myArray.filter(item => item.includes("1"));\nconsole.log("Gefilterde items:", filtered);`
            explanation = `Deze code toont hoe je werkt met arrays in JavaScript voor ${prompt}. Het bevat voorbeelden van toevoegen, itereren en filteren.`
          } else {
            code = `// ${prompt}\nconst solution = () => {\n  // Implementatie voor ${prompt}\n  console.log("Oplossing voor: ${prompt}");\n  \n  // Voorbeeld implementatie\n  const data = {\n    input: "${prompt}",\n    processed: true,\n    timestamp: new Date().toISOString()\n  };\n  \n  return data;\n};\n\n// Uitvoeren\nconst result = solution();\nconsole.log(result);`
            explanation = `Deze JavaScript code biedt een oplossing voor ${prompt}. Het gebruikt moderne ES6+ syntax en best practices.`
          }
          break
        case "python":
          if (prompt.toLowerCase().includes("functie") || prompt.toLowerCase().includes("function")) {
            code = `# ${prompt}\ndef my_function():\n    """Implementatie van ${prompt}"""\n    print("Functie uitgevoerd!")\n    \n    # Voorbeeld logica\n    result = f"Resultaat van {prompt}"\n    return result\n\n# Gebruik van de functie\nif __name__ == "__main__":\n    output = my_function()\n    print(output)`
            explanation = `Deze Python functie implementeert ${prompt}. De code volgt Python conventies en bevat documentatie.`
          } else {
            code = `# ${prompt}\nimport datetime\n\ndef solution():\n    """Oplossing voor ${prompt}"""\n    print(f"Oplossing voor: {prompt}")\n    \n    # Voorbeeld implementatie\n    data = {\n        "input": "${prompt}",\n        "processed": True,\n        "timestamp": datetime.datetime.now().isoformat()\n    }\n    \n    return data\n\n# Uitvoeren\nif __name__ == "__main__":\n    result = solution()\n    print(result)`
            explanation = `Deze Python code biedt een oplossing voor ${prompt}. Het gebruikt Python best practices en standaard libraries.`
          }
          break
        case "html":
          code = `<!DOCTYPE html>\n<html lang="nl">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${prompt}</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 20px;\n            background-color: #f5f5f5;\n        }\n        .container {\n            max-width: 800px;\n            margin: 0 auto;\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n        }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <h1>${prompt}</h1>\n        <p>Dit is een voorbeeld HTML pagina voor ${prompt}.</p>\n        <button onclick="alert('Hallo!')">Klik hier</button>\n    </div>\n</body>\n</html>`
          explanation = `Deze HTML code creëert een basis webpagina voor ${prompt}. Het bevat styling en interactiviteit.`
          break
        default:
          code = `// ${prompt}\n// Code gegenereerd voor ${language}\n\nconsole.log("${prompt}");`
          explanation = `Basis code template voor ${prompt} in ${language}.`
      }

      const session: CodeSession = {
        id: Date.now().toString(),
        title,
        language,
        code,
        explanation,
        timestamp: Date.now(),
      }

      saveSession(session)
      setPrompt("")
    } catch (error) {
      console.error("Code generation error:", error)
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

  const downloadCode = (session: CodeSession) => {
    const extension =
      session.language === "javascript"
        ? "js"
        : session.language === "python"
          ? "py"
          : session.language === "html"
            ? "html"
            : "txt"

    const blob = new Blob([session.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${session.title.replace(/[^a-z0-9]/gi, "_")}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearSessions = () => {
    if (!user) return
    setSessions([])
    localStorage.removeItem(`code_sessions_${user.id}`)
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-between px-4 text-white text-xs font-medium">
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
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Code Assistent</h1>
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

        {/* Code Generator */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Code genereren</span>
              </div>

              {/* Language Selector */}
              <div className="flex space-x-2">
                {[
                  { id: "javascript", label: "JavaScript" },
                  { id: "python", label: "Python" },
                  { id: "html", label: "HTML" },
                  { id: "css", label: "CSS" },
                ].map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(lang.id)}
                    className={language === lang.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>

              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Beschrijf wat voor code je wilt... Bijvoorbeeld: 'Een functie om getallen op te tellen' of 'Een HTML pagina met een formulier'"
                disabled={isGenerating}
              />

              <Button
                onClick={generateCode}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Code genereren...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Genereer {language} code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Code Sessions */}
        {sessions.length > 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Code Geschiedenis ({sessions.length})
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
                            <Badge className="bg-orange-500 text-white text-xs">{session.language}</Badge>
                            <span className="text-xs text-gray-500">{formatTime(session.timestamp)}</span>
                          </div>
                          <h3 className="font-medium text-gray-900">{session.title}</h3>
                          <p className="text-sm text-gray-600">{session.explanation}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(session.code, session.id)}
                            className="p-1"
                          >
                            {copiedId === session.id ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadCode(session)} className="p-1">
                            <Download className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-900 p-4 rounded-lg">
                        <ScrollArea className="h-48">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{session.code}</pre>
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welkom bij Code Assistent!</h3>
              <p className="text-gray-600 mb-4">
                Laat AI je helpen met het schrijven van code in verschillende programmeertalen.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>💻 Kies een programmeertaal</p>
                <p>📝 Beschrijf wat je wilt maken</p>
                <p>🚀 Krijg direct werkende code</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
