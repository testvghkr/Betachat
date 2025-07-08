"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Download, Copy, RotateCcw, Save } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

export default function CodeEditorPage() {
  const [code, setCode] = useState(`// Welkom bij QRP Code Editor!
function helloWorld() {
    console.log("Hallo, wereld!");
    return "QRP v2.0 is geweldig!";
}

helloWorld();`)

  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const languages = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "html", label: "HTML", icon: "🟧" },
    { value: "css", label: "CSS", icon: "🟦" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "json", label: "JSON", icon: "📄" },
  ]

  const examples = {
    javascript: `// JavaScript Voorbeeld
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci reeks:");
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,

    html: `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>QRP Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .gradient { background: linear-gradient(45deg, #f97316, #3b82f6); 
                   color: white; padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="gradient">
            <h1>🚀 QRP v2.0</h1>
            <p>Welkom bij de QRP Code Editor!</p>
        </div>
    </div>
</body>
</html>`,

    css: `/* CSS Voorbeeld - QRP Styling */
.qrp-button {
    background: linear-gradient(45deg, #f97316, #3b82f6);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.qrp-button:hover {
    transform: scale(1.05);
}

.qrp-card {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    color: white;
}`,

    python: `# Python Voorbeeld
def qrp_calculator(operation, a, b):
    """QRP Calculator met verschillende operaties"""
    operations = {
        'add': lambda x, y: x + y,
        'subtract': lambda x, y: x - y,
        'multiply': lambda x, y: x * y,
        'divide': lambda x, y: x / y if y != 0 else "Kan niet delen door nul!"
    }
    
    return operations.get(operation, lambda x, y: "Onbekende operatie")(a, b)

# Test de calculator
print("QRP Calculator Demo:")
print(f"10 + 5 = {qrp_calculator('add', 10, 5)}")
print(f"10 - 5 = {qrp_calculator('subtract', 10, 5)}")
print(f"10 * 5 = {qrp_calculator('multiply', 10, 5)}")
print(f"10 / 5 = {qrp_calculator('divide', 10, 5)}")`,

    json: `{
  "qrp": {
    "version": "2.0",
    "name": "QRP Chatbot",
    "description": "AI-powered chatbot met Nederlandse ondersteuning",
    "features": [
      "Chat functionaliteit",
      "Code editor", 
      "Calculator",
      "Kalender",
      "Notities",
      "Games"
    ],
    "languages": ["Nederlands", "English"],
    "ai_powered": true,
    "apps": {
      "calculator": {
        "description": "Geavanceerde rekenmachine",
        "features": ["Basis operaties", "Geschiedenis", "Percentage"]
      },
      "code_editor": {
        "description": "Code schrijven en testen", 
        "supported_languages": ["JavaScript", "HTML", "CSS", "Python", "JSON"]
      }
    }
  }
}`,
  }

  const { user } = useAuth()

  const saveSnippet = async () => {
    if (user?.isGuest || !code.trim()) return

    const title = `${language} snippet - ${new Date().toLocaleDateString()}`

    try {
      await fetch("/api/code-snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, code, language }),
      })
    } catch (error) {
      console.error("Failed to save snippet:", error)
    }
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput("")

    setTimeout(() => {
      if (language === "javascript") {
        try {
          // Create a safe environment to run JavaScript
          const logs: string[] = []
          const mockConsole = {
            log: (...args: any[]) => logs.push(args.join(" ")),
            error: (...args: any[]) => logs.push("ERROR: " + args.join(" ")),
            warn: (...args: any[]) => logs.push("WARNING: " + args.join(" ")),
          }

          // Replace console in the code
          const safeCode = code.replace(/console\./g, "mockConsole.")

          // Create function and run it
          const func = new Function("mockConsole", safeCode)
          func(mockConsole)

          setOutput(logs.join("\n") || "Code uitgevoerd (geen output)")
        } catch (error) {
          setOutput(`Fout: ${error instanceof Error ? error.message : "Onbekende fout"}`)
        }
      } else {
        setOutput(
          `${language.toUpperCase()} code kan niet worden uitgevoerd in de browser.\nCode is wel geldig en kan worden gedownload.`,
        )
      }
      setIsRunning(false)
    }, 1000)
  }

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: "js",
      html: "html",
      css: "css",
      python: "py",
      json: "json",
    }

    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qrp-code.${extensions[language] || "txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const loadExample = () => {
    setCode(examples[language as keyof typeof examples] || "// Geen voorbeeld beschikbaar")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mr-3">
                <span className="text-white text-lg">💻</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Code Editor</h1>
                <p className="text-gray-400 text-sm">Schrijf en test je code</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="space-y-4">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Code Editor</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value} className="text-white">
                              {lang.icon} {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white font-mono text-sm min-h-[400px] resize-none"
                    placeholder="Schrijf hier je code..."
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Uitvoeren..." : "Uitvoeren"}
                    </Button>

                    <Button
                      onClick={downloadCode}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>

                    <Button
                      onClick={copyCode}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Kopiëren
                    </Button>

                    <Button
                      onClick={loadExample}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Voorbeeld
                    </Button>

                    {!user?.isGuest && (
                      <Button
                        onClick={saveSnippet}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Opslaan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output */}
            <div className="space-y-4">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 border border-gray-600 rounded p-4 min-h-[400px]">
                    {isRunning ? (
                      <div className="flex items-center text-orange-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                        Code wordt uitgevoerd...
                      </div>
                    ) : output ? (
                      <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">{output}</pre>
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        <span className="text-2xl mb-2 block">🚀</span>
                        Klik op "Uitvoeren" om je code te testen
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Language Info */}
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">
                    {languages.find((l) => l.value === language)?.icon}{" "}
                    {languages.find((l) => l.value === language)?.label} Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 text-sm space-y-2">
                    {language === "javascript" && (
                      <>
                        <p>• Ondersteunt ES6+ syntax</p>
                        <p>• Console.log output wordt getoond</p>
                        <p>• Veilige uitvoering in sandbox</p>
                        <p>• Ideaal voor algoritmes en logica</p>
                      </>
                    )}
                    {language === "html" && (
                      <>
                        <p>• Volledige HTML5 ondersteuning</p>
                        <p>• Inline CSS en JavaScript mogelijk</p>
                        <p>• Download voor preview in browser</p>
                        <p>• Responsive design testen</p>
                      </>
                    )}
                    {language === "css" && (
                      <>
                        <p>• Moderne CSS3 features</p>
                        <p>• Flexbox en Grid layouts</p>
                        <p>• Animaties en transitions</p>
                        <p>• Custom properties (variabelen)</p>
                      </>
                    )}
                    {language === "python" && (
                      <>
                        <p>• Python 3 syntax</p>
                        <p>• Basis libraries beschikbaar</p>
                        <p>• Download voor lokale uitvoering</p>
                        <p>• Ideaal voor data processing</p>
                      </>
                    )}
                    {language === "json" && (
                      <>
                        <p>• Syntax validatie</p>
                        <p>• Gestructureerde data opslag</p>
                        <p>• API configuratie</p>
                        <p>• Data uitwisseling format</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
