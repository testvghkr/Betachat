"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calculator, ArrowLeft, History, Trash2, Copy, Check, Sparkles, Brain, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface CalculationHistory {
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
  const [explanation, setExplanation] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      loadHistory()
    }
  }, [user, loading, router])

  const loadHistory = () => {
    if (!user) return
    const savedHistory = JSON.parse(localStorage.getItem(`calculator_history_${user.id}`) || "[]")
    const parsedHistory = savedHistory.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }))
    setHistory(parsedHistory)
  }

  const saveToHistory = (calculation: CalculationHistory) => {
    if (!user) return
    const newHistory = [calculation, ...history].slice(0, 50) // Keep last 50 calculations
    setHistory(newHistory)
    localStorage.setItem(`calculator_history_${user.id}`, JSON.stringify(newHistory))

    // Log activity
    const activityLog = JSON.parse(localStorage.getItem(`activity_log_${user.id}`) || "[]")
    activityLog.push({
      tool: "AI Rekenmachine",
      action: `Berekening: ${calculation.expression} = ${calculation.result}`,
      time: new Date().toLocaleString("nl-NL"),
      timestamp: new Date(),
    })
    localStorage.setItem(`activity_log_${user.id}`, JSON.stringify(activityLog))
  }

  const calculate = async () => {
    if (!expression.trim()) return

    setIsCalculating(true)
    setResult("")
    setExplanation("")

    try {
      // Simple calculation using eval (in production, use a proper math parser)
      let calculatedResult: string
      let aiExplanation: string

      try {
        // Basic safety check for eval
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "")
        const evalResult = eval(sanitized)
        calculatedResult = evalResult.toString()

        // Generate AI explanation
        aiExplanation = generateExplanation(expression, calculatedResult)
      } catch (error) {
        calculatedResult = "Fout in berekening"
        aiExplanation = "De ingevoerde expressie kon niet worden berekend. Controleer de syntax."
      }

      setResult(calculatedResult)
      setExplanation(aiExplanation)

      // Save to history
      const calculation: CalculationHistory = {
        id: Date.now().toString(),
        expression: expression.trim(),
        result: calculatedResult,
        explanation: aiExplanation,
        timestamp: new Date(),
      }

      saveToHistory(calculation)
    } catch (error) {
      setResult("Fout")
      setExplanation("Er is een fout opgetreden bij het berekenen.")
    } finally {
      setIsCalculating(false)
    }
  }

  const generateExplanation = (expr: string, res: string): string => {
    // Simple AI-like explanations
    if (expr.includes("+")) {
      return `Ik heb de getallen opgeteld: ${expr} = ${res}`
    }
    if (expr.includes("-")) {
      return `Ik heb de aftrekking uitgevoerd: ${expr} = ${res}`
    }
    if (expr.includes("*")) {
      return `Ik heb de vermenigvuldiging berekend: ${expr} = ${res}`
    }
    if (expr.includes("/")) {
      return `Ik heb de deling uitgevoerd: ${expr} = ${res}`
    }
    if (expr.includes("(") && expr.includes(")")) {
      return `Ik heb eerst de haakjes berekend, daarna de rest: ${expr} = ${res}`
    }
    return `Het resultaat van ${expr} is ${res}`
  }

  const clearHistory = () => {
    if (!user) return
    setHistory([])
    localStorage.removeItem(`calculator_history_${user.id}`)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculate()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="android-avatar animate-pulse">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Laden...</p>
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
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="android-avatar bg-gradient-to-r from-green-400 to-green-600">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Rekenmachine</h1>
              <p className="text-sm text-muted-foreground">Wiskundige problemen met AI-uitleg</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  Nieuwe Berekening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="expression" className="text-sm font-medium">
                    Voer je berekening in:
                  </label>
                  <Input
                    id="expression"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Bijvoorbeeld: 2 + 3 * 4 of (10 + 5) / 3"
                    className="text-lg font-mono"
                    disabled={isCalculating}
                  />
                  <p className="text-xs text-muted-foreground">
                    Gebruik +, -, *, /, () voor berekeningen. Druk Enter om te berekenen.
                  </p>
                </div>

                <Button
                  onClick={calculate}
                  disabled={!expression.trim() || isCalculating}
                  className="w-full android-primary-button"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Berekenen...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Bereken met AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            {(result || explanation) && (
              <Card className="android-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100">Resultaat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700 dark:text-green-300">Antwoord:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result, "current-result")}
                          className="h-6 w-6 p-0"
                        >
                          {copiedId === "current-result" ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="text-2xl font-bold font-mono text-green-900 dark:text-green-100 bg-white dark:bg-gray-800 p-3 rounded-lg">
                        {result}
                      </div>
                    </div>
                  )}

                  {explanation && (
                    <div className="space-y-2">
                      <span className="text-sm text-green-700 dark:text-green-300">AI Uitleg:</span>
                      <div className="text-sm text-green-800 dark:text-green-200 bg-white dark:bg-gray-800 p-3 rounded-lg leading-relaxed">
                        {explanation}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Examples */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg">Voorbeelden</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {["2 + 3 * 4", "(10 + 5) / 3", "25 - 7 * 2", "100 / (5 + 5)"].map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setExpression(example)}
                      className="font-mono text-xs bg-transparent"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <Card className="android-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Geschiedenis
                  </CardTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nog geen berekeningen</p>
                    <p className="text-xs">Je geschiedenis verschijnt hier</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {history.map((calc) => (
                        <div key={calc.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-medium">{calc.expression}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(calc.result, calc.id)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedId === calc.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <div className="font-mono text-lg font-bold text-green-600">= {calc.result}</div>
                          <div className="text-xs text-muted-foreground">{calc.timestamp.toLocaleString("nl-NL")}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="android-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Statistieken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Totaal berekeningen:</span>
                  <span className="font-semibold">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vandaag:</span>
                  <span className="font-semibold">
                    {history.filter((calc) => calc.timestamp.toDateString() === new Date().toDateString()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deze week:</span>
                  <span className="font-semibold">
                    {
                      history.filter((calc) => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return calc.timestamp > weekAgo
                      }).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
