"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  ArrowLeft,
  History,
  Trash2,
  Copy,
  Download,
  Sparkles,
  TrendingUp,
  BarChart3,
  ActivityIcon as Function,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Calculation {
  id: string
  expression: string
  result: string
  explanation: string
  timestamp: Date
}

export default function CalculatorPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [history, setHistory] = useState<Calculation[]>([])
  const [explanation, setExplanation] = useState("")

  // Add activity logging function
  const logActivity = (action: string) => {
    if (!user) return

    const activity = {
      tool: "AI Rekenmachine",
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

    // Load calculation history from localStorage
    const savedHistory = localStorage.getItem(`calculator_history_${user?.id}`)
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((calc: any) => ({
        ...calc,
        timestamp: new Date(calc.timestamp),
      }))
      setHistory(parsedHistory)
    }
  }, [user, loading, router])

  const saveToHistory = (calculation: Calculation) => {
    const newHistory = [calculation, ...history].slice(0, 50) // Keep last 50 calculations
    setHistory(newHistory)
    localStorage.setItem(`calculator_history_${user?.id}`, JSON.stringify(newHistory))
  }

  const generateAIExplanation = (expr: string, res: string): string => {
    const explanations = [
      `Voor de berekening "${expr}" heb ik de volgende stappen gevolgd:\n\n1. Eerst heb ik de uitdrukking geanalyseerd\n2. Vervolgens heb ik de berekening uitgevoerd volgens de wiskundige volgorde\n3. Het eindresultaat is ${res}`,
      `De uitdrukking "${expr}" kan als volgt worden opgelost:\n\n• Ik volg de PEMDAS regel (haakjes, machten, vermenigvuldiging/deling, optelling/aftrekking)\n• Na het toepassen van deze regels krijg ik: ${res}`,
      `Stap-voor-stap uitleg voor "${expr}":\n\n→ Ik begin met het evalueren van de uitdrukking\n→ Ik pas de juiste wiskundige regels toe\n→ Het finale antwoord is: ${res}`,
    ]
    return explanations[Math.floor(Math.random() * explanations.length)]
  }

  const handleCalculate = async () => {
    if (!expression.trim()) return

    setIsCalculating(true)
    setResult("")
    setExplanation("")

    // Log activity
    logActivity(`Berekening: ${expression}`)

    try {
      // Simulate AI calculation with delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500))

      // Simple calculation using eval (in production, use a proper math parser)
      let calculatedResult: string
      try {
        const evalResult = eval(expression.replace(/[^0-9+\-*/().\s]/g, ""))
        calculatedResult = evalResult.toString()
      } catch {
        calculatedResult = "Fout in berekening"
      }

      const aiExplanation = generateAIExplanation(expression, calculatedResult)

      setResult(calculatedResult)
      setExplanation(aiExplanation)

      // Save to history
      const calculation: Calculation = {
        id: Date.now().toString(),
        expression,
        result: calculatedResult,
        explanation: aiExplanation,
        timestamp: new Date(),
      }
      saveToHistory(calculation)

      // Log successful calculation
      logActivity(`Resultaat: ${calculatedResult}`)
    } catch (error) {
      setResult("Er ging iets mis bij de berekening")
      setExplanation("Controleer je invoer en probeer opnieuw.")
      logActivity("Berekening mislukt")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCalculate()
    }
  }

  const insertFunction = (func: string) => {
    setExpression((prev) => prev + func)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(`calculator_history_${user?.id}`)
    logActivity("Geschiedenis gewist")
  }

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      logActivity("Resultaat gekopieerd")
    }
  }

  const exportHistory = () => {
    const data = {
      user: user?.name,
      calculations: history,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `calculator-history-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    logActivity("Geschiedenis geëxporteerd")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="android-avatar animate-pulse">
          <Calculator className="h-6 w-6 text-white" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      {/* Header */}
      <header className="android-header px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="android-icon-button">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Rekenmachine</h1>
                <p className="text-sm text-muted-foreground">Geavanceerde berekeningen met AI-uitleg</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportHistory} disabled={history.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Wis Geschiedenis
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  Berekening Invoeren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Voer je berekening in... (bijv. 2 + 3 * 4)"
                    className="text-lg font-mono"
                    disabled={isCalculating}
                  />
                  <div className="flex flex-wrap gap-2">
                    {["sin(", "cos(", "tan(", "log(", "sqrt(", "^", "π", "e"].map((func) => (
                      <Button
                        key={func}
                        variant="outline"
                        size="sm"
                        onClick={() => insertFunction(func)}
                        disabled={isCalculating}
                      >
                        {func}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!expression.trim() || isCalculating}
                  className="w-full android-primary-button text-lg py-3"
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI berekent...
                    </div>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5 mr-2" />
                      Bereken met AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            {(result || isCalculating) && (
              <Card className="android-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Resultaat
                    </span>
                    {result && (
                      <Button variant="outline" size="sm" onClick={copyResult}>
                        <Copy className="h-4 w-4 mr-2" />
                        Kopieer
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCalculating ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-muted-foreground">AI analyseert je berekening...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-2xl font-bold font-mono text-green-700 dark:text-green-300">{result}</p>
                      </div>
                      {explanation && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Uitleg:</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-line leading-relaxed">
                            {explanation}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Functions */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Function className="h-5 w-5 text-purple-500" />
                  Snelle Functies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Oppervlakte Cirkel", formula: "π * r^2" },
                    { label: "Pythagoras", formula: "sqrt(a^2 + b^2)" },
                    { label: "Percentage", formula: "(deel/geheel) * 100" },
                    { label: "Gemiddelde", formula: "(a + b + c) / 3" },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setExpression(item.formula)}
                      className="text-xs p-2 h-auto flex flex-col items-start"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground font-mono">{item.formula}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Statistieken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Totaal berekeningen:</span>
                  <Badge variant="secondary">{history.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vandaag:</span>
                  <Badge variant="secondary">
                    {
                      history.filter((calc) => {
                        const today = new Date()
                        const calcDate = new Date(calc.timestamp)
                        return calcDate.toDateString() === today.toDateString()
                      }).length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deze week:</span>
                  <Badge variant="secondary">
                    {
                      history.filter((calc) => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return new Date(calc.timestamp) > weekAgo
                      }).length
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* History */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Geschiedenis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nog geen berekeningen</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((calc) => (
                        <div
                          key={calc.id}
                          className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => setExpression(calc.expression)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-sm">{calc.expression}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(calc.result)
                                logActivity("Resultaat gekopieerd uit geschiedenis")
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-green-600 dark:text-green-400">{calc.result}</span>
                            <span className="text-xs text-muted-foreground">
                              {calc.timestamp.toLocaleTimeString("nl-NL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
