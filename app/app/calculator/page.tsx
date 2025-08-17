"use client"
import { Clock } from "lucide-react" // Import Clock here

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calculator, ArrowLeft, Trash2, Copy, Sparkles, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Calculation {
  id: string
  input: string
  result: string
  timestamp: number
}

export default function CalculatorPage() {
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`calculations_${user.id}`)
      if (saved) {
        setCalculations(JSON.parse(saved))
      }
    }
  }, [user])

  const saveCalculation = (calculation: Calculation) => {
    if (!user) return

    const updated = [calculation, ...calculations]
    setCalculations(updated)
    localStorage.setItem(`calculations_${user.id}`, JSON.stringify(updated))

    // Update user stats
    const stats = JSON.parse(
      localStorage.getItem(`stats_${user.id}`) || '{"totalChats":0,"totalCalculations":0,"timeSpent":0,"lastActive":0}',
    )
    stats.totalCalculations += 1
    stats.lastActive = Date.now()
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(stats))

    // Add to activities
    const activities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || "[]")
    activities.unshift({
      id: Date.now().toString(),
      type: "calculation",
      description: `Berekening: ${calculation.input}`,
      timestamp: Date.now(),
    })
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities.slice(0, 50)))
  }

  const handleCalculate = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)

    try {
      // Simulate AI calculation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let result = ""
      const cleanInput = input.trim()

      // Simple math evaluation (in real app, use proper math parser)
      try {
        // Basic math operations
        if (/^[\d+\-*/().\s]+$/.test(cleanInput)) {
          result = eval(cleanInput).toString()
        } else {
          // AI-style responses for complex questions
          result = `Voor "${cleanInput}" zou ik een geavanceerde berekening uitvoeren. Dit is een demo-resultaat: ${Math.random().toFixed(2)}`
        }
      } catch {
        result = `Ik kan "${cleanInput}" niet berekenen. Probeer een wiskundige uitdrukking zoals "2 + 2" of stel een vraag.`
      }

      const calculation: Calculation = {
        id: Date.now().toString(),
        input: cleanInput,
        result,
        timestamp: Date.now(),
      }

      saveCalculation(calculation)
      setInput("")
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsLoading(false)
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

  const clearHistory = () => {
    if (!user) return
    setCalculations([])
    localStorage.removeItem(`calculations_${user.id}`)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Android-style Status Bar */}
      <div className="h-6 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between px-4 text-white text-xs font-medium">
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Rekenmachine</h1>
            </div>
          </div>
          {calculations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Input Section */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Stel je vraag of voer een berekening in</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bijv: 2 + 2, of 'Bereken de oppervlakte van een cirkel met straal 5'"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleCalculate()}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleCalculate}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {calculations.length > 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Geschiedenis ({calculations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3 p-4">
                  {calculations.map((calc) => (
                    <div key={calc.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              Vraag
                            </Badge>
                            <span className="text-xs text-gray-500">{formatTime(calc.timestamp)}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{calc.input}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(calc.input, `input-${calc.id}`)}
                          className="p-1"
                        >
                          {copiedId === `input-${calc.id}` ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                              Resultaat
                            </Badge>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{calc.result}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(calc.result, `result-${calc.id}`)}
                            className="p-1 ml-2"
                          >
                            {copiedId === `result-${calc.id}` ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welkom bij de AI Rekenmachine!</h3>
              <p className="text-gray-600 mb-4">
                Stel wiskundige vragen, voer berekeningen uit, of vraag om hulp met complexe problemen.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>💡 Probeer: "2 + 2", "Wat is 15% van 200?", of "Bereken de oppervlakte van een rechthoek 5x3"</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
