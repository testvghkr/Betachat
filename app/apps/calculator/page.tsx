"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, History } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

interface HistoryItem {
  id: number
  calculation: string
  result: number
  created_at: string
}

export default function CalculatorPage() {
  const { user } = useAuth()
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (user && !user.isGuest) {
      loadHistory()
    }
  }, [user])

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/calculator/history")
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("Failed to load calculator history:", error)
    }
  }

  const saveToHistory = async (calculation: string, result: number) => {
    if (user?.isGuest) return

    try {
      await fetch("/api/calculator/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculation, result }),
      })
      loadHistory() // Reload history
    } catch (error) {
      console.error("Failed to save calculation:", error)
    }
  }

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)

      // Save to database
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`
      saveToHistory(calculation, newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)

      // Save to database
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`
      saveToHistory(calculation, newValue)

      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearHistory = async () => {
    if (user?.isGuest) {
      setHistory([])
      return
    }

    try {
      await fetch("/api/calculator/history", { method: "DELETE" })
      setHistory([])
    } catch (error) {
      console.error("Failed to clear history:", error)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const percentage = () => {
    const value = Number.parseFloat(display) / 100
    setDisplay(String(value))
  }

  const toggleSign = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(-value))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mr-3">
                <span className="text-white text-lg">🧮</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Calculator</h1>
                <p className="text-gray-400 text-sm">
                  {user?.isGuest ? "Gastmodus - niet opgeslagen" : "Geschiedenis wordt opgeslagen"}
                </p>
              </div>
            </div>
          </div>

          {/* Display */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-white text-4xl font-light mb-2 min-h-[3rem] flex items-end justify-end">
                  {display}
                </div>
                {operation && previousValue !== null && (
                  <div className="text-orange-400 text-sm">
                    {previousValue} {operation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Row 1 */}
            <Button onClick={clear} className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-lg font-medium">
              AC
            </Button>
            <Button onClick={toggleSign} className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-lg font-medium">
              ±
            </Button>
            <Button onClick={percentage} className="h-16 bg-gray-600 hover:bg-gray-500 text-white text-lg font-medium">
              %
            </Button>
            <Button
              onClick={() => inputOperation("÷")}
              className="h-16 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-xl font-medium"
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button
              onClick={() => inputNumber("7")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              7
            </Button>
            <Button
              onClick={() => inputNumber("8")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              8
            </Button>
            <Button
              onClick={() => inputNumber("9")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              9
            </Button>
            <Button
              onClick={() => inputOperation("×")}
              className="h-16 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-xl font-medium"
            >
              ×
            </Button>

            {/* Row 3 */}
            <Button
              onClick={() => inputNumber("4")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              4
            </Button>
            <Button
              onClick={() => inputNumber("5")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              5
            </Button>
            <Button
              onClick={() => inputNumber("6")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              6
            </Button>
            <Button
              onClick={() => inputOperation("-")}
              className="h-16 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-xl font-medium"
            >
              -
            </Button>

            {/* Row 4 */}
            <Button
              onClick={() => inputNumber("1")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              1
            </Button>
            <Button
              onClick={() => inputNumber("2")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              2
            </Button>
            <Button
              onClick={() => inputNumber("3")}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              3
            </Button>
            <Button
              onClick={() => inputOperation("+")}
              className="h-16 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-xl font-medium"
            >
              +
            </Button>

            {/* Row 5 */}
            <Button
              onClick={() => inputNumber("0")}
              className="h-16 col-span-2 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="h-16 bg-gray-700 hover:bg-gray-600 text-white text-xl font-medium"
            >
              .
            </Button>
            <Button
              onClick={performCalculation}
              className="h-16 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-xl font-medium"
            >
              =
            </Button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Geschiedenis
                  </CardTitle>
                  <Button onClick={clearHistory} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {history.slice(0, 10).map((item) => (
                    <div key={item.id} className="text-gray-300 text-sm font-mono bg-gray-800/50 p-2 rounded">
                      {item.calculation}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
