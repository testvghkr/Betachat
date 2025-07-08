"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<any>({})

  // Tic Tac Toe Game
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  // Memory Game
  const [cards, setCards] = useState<number[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])

  // Number Guessing Game
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState("")

  const games = [
    {
      id: "tictactoe",
      name: "Tic Tac Toe",
      icon: "⭕",
      description: "Klassieke drie op een rij",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "memory",
      name: "Memory",
      icon: "🧠",
      description: "Onthoud de kaarten",
      color: "from-green-500 to-teal-500",
    },
    {
      id: "guess",
      name: "Raad het Getal",
      icon: "🎯",
      description: "Raad het getal tussen 1-100",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "calculator-game",
      name: "Reken Race",
      icon: "🧮",
      description: "Los sommen zo snel mogelijk op",
      color: "from-orange-500 to-red-500",
    },
  ]

  const { user } = useAuth()

  // Add score saving function:
  const saveScore = async (gameName: string, score: number, gameData: any = {}) => {
    if (user?.isGuest) return

    try {
      await fetch("/api/game-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: gameName,
          score,
          game_data: gameData,
        }),
      })
    } catch (error) {
      console.error("Failed to save score:", error)
    }
  }

  // Tic Tac Toe Logic
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleTicTacToeClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return

    const newBoard = board.slice()
    newBoard[i] = isXNext ? "X" : "O"
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const resetTicTacToe = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  // Memory Game Logic
  const initMemoryGame = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
    const shuffled = [...numbers, ...numbers].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setScore(0)
  }

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped])
        setScore(score + 10)
        setFlipped([])

        // In memory game completion:
        if (matched.length === 16) {
          saveScore("memory", score, { moves: attempts })
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  // Number Guessing Logic
  const handleGuess = () => {
    const num = Number.parseInt(guess)
    setAttempts(attempts + 1)

    if (num === targetNumber) {
      const finalScore = Math.max(0, 100 - attempts * 10)
      setScore(finalScore)
      setHint(`🎉 Correct! Je hebt het geraden in ${attempts + 1} pogingen!`)
      saveScore("guess-number", finalScore, { attempts: attempts + 1 })
    } else if (num < targetNumber) {
      setHint("📈 Te laag! Probeer een hoger getal.")
    } else {
      setHint("📉 Te hoog! Probeer een lager getal.")
    }
    setGuess("")
  }

  const resetGuessGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuess("")
    setAttempts(0)
    setHint("")
    setScore(0)
  }

  const renderGame = () => {
    switch (selectedGame) {
      case "tictactoe":
        const winner = calculateWinner(board)
        const isDraw = !winner && board.every((square) => square !== null)

        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-white text-lg mb-4">
                {winner ? `🏆 ${winner} wint!` : isDraw ? "🤝 Gelijkspel!" : `Beurt: ${isXNext ? "X" : "O"}`}
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {board.map((square, i) => (
                  <Button
                    key={i}
                    onClick={() => handleTicTacToeClick(i)}
                    className="h-20 w-20 text-2xl font-bold bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {square}
                  </Button>
                ))}
              </div>
              <Button onClick={resetTicTacToe} className="mt-4 bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nieuw Spel
              </Button>
            </div>
          </div>
        )

      case "memory":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-white text-lg mb-4">
                Score: {score} | Gevonden: {matched.length / 2}/8
              </div>
              {cards.length === 0 && (
                <Button onClick={initMemoryGame} className="bg-green-600 hover:bg-green-700 mb-4">
                  Start Memory Game
                </Button>
              )}
              <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                {cards.map((card, i) => (
                  <Button
                    key={i}
                    onClick={() => handleCardClick(i)}
                    className={`h-16 w-16 text-xl font-bold ${
                      flipped.includes(i) || matched.includes(i)
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-400"
                    }`}
                  >
                    {flipped.includes(i) || matched.includes(i) ? card : "?"}
                  </Button>
                ))}
              </div>
              {matched.length === 16 && (
                <div className="text-green-400 text-lg mt-4">🎉 Gefeliciteerd! Je hebt alle paren gevonden!</div>
              )}
            </div>
          </div>
        )

      case "guess":
        return (
          <div className="space-y-4 text-center">
            <div className="text-white text-lg">Raad het getal tussen 1 en 100</div>
            <div className="text-gray-300">Pogingen: {attempts}</div>
            {score > 0 && <div className="text-green-400">Score: {score}</div>}

            <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Jouw gok..."
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
                min="1"
                max="100"
              />
              <Button onClick={handleGuess} disabled={!guess} className="bg-purple-600 hover:bg-purple-700">
                <Target className="w-4 h-4" />
              </Button>
            </div>

            {hint && <div className="text-orange-400 text-lg">{hint}</div>}

            <Button onClick={resetGuessGame} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Nieuw Getal
            </Button>
          </div>
        )

      default:
        return <div className="text-center text-gray-400">Selecteer een spel om te beginnen</div>
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎮</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Games</h1>
                <p className="text-gray-400 text-sm">Mini games en puzzels</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Game Selection */}
            <div className="space-y-4">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Kies een Spel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {games.map((game) => (
                    <Button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`w-full justify-start h-auto p-4 ${
                        selectedGame === game.id ? `bg-gradient-to-r ${game.color}` : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{game.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{game.name}</div>
                          <div className="text-sm opacity-80">{game.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* High Scores */}
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Memory Game:</span>
                      <span className="text-green-400">{score}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Raad het Getal:</span>
                      <span className="text-purple-400">{score}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tic Tac Toe:</span>
                      <span className="text-blue-400">-</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Game Area */}
            <div className="lg:col-span-2">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {selectedGame ? games.find((g) => g.id === selectedGame)?.name : "Game Area"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[400px] flex items-center justify-center">{renderGame()}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
