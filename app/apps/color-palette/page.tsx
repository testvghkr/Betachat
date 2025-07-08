"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Copy, Shuffle, Palette, Download } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

interface Color {
  hex: string
  rgb: string
  hsl: string
  name: string
}

export default function ColorPalettePage() {
  const [colors, setColors] = useState<Color[]>([
    { hex: "#F97316", rgb: "rgb(249, 115, 22)", hsl: "hsl(24, 95%, 53%)", name: "QRP Orange" },
    { hex: "#3B82F6", rgb: "rgb(59, 130, 246)", hsl: "hsl(217, 91%, 60%)", name: "QRP Blue" },
    { hex: "#10B981", rgb: "rgb(16, 185, 129)", hsl: "hsl(158, 84%, 39%)", name: "Emerald" },
    { hex: "#8B5CF6", rgb: "rgb(139, 92, 246)", hsl: "hsl(258, 90%, 66%)", name: "Violet" },
    { hex: "#EF4444", rgb: "rgb(239, 68, 68)", hsl: "hsl(0, 84%, 60%)", name: "Red" },
  ])

  const [customColor, setCustomColor] = useState("#FF6B6B")

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return "rgb(0, 0, 0)"

    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return "hsl(0, 0%, 0%)"

    const r = Number.parseInt(result[1], 16) / 255
    const g = Number.parseInt(result[2], 16) / 255
    const b = Number.parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const generateRandomPalette = () => {
    const newColors = []
    for (let i = 0; i < 5; i++) {
      const hex = generateRandomColor()
      newColors.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex),
        name: `Color ${i + 1}`,
      })
    }
    setColors(newColors)
  }

  const addCustomColor = () => {
    const newColor = {
      hex: customColor,
      rgb: hexToRgb(customColor),
      hsl: hexToHsl(customColor),
      name: "Custom Color",
    }
    setColors([...colors, newColor])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportPalette = () => {
    const paletteData = {
      name: "QRP Color Palette",
      colors: colors,
      created: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qrp-color-palette.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎨</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Kleurenpalet</h1>
                <p className="text-gray-400 text-sm">Genereer en beheer kleurpaletten</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-10 p-1 bg-transparent border-gray-600"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-24 bg-gray-700 border-gray-600 text-white text-sm"
                    placeholder="#FF6B6B"
                  />
                  <Button
                    onClick={addCustomColor}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Toevoegen
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={generateRandomPalette}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Random Palet
                  </Button>

                  <Button
                    onClick={exportPalette}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporteren
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <div className="grid gap-4">
            {colors.map((color, index) => (
              <Card key={index} className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    {/* Color Preview */}
                    <div
                      className="w-20 h-20 rounded-lg border-2 border-white/20 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    ></div>

                    {/* Color Info */}
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wide">Naam</label>
                        <div className="text-white font-medium">{color.name}</div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wide">HEX</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono">{color.hex}</span>
                          <Button
                            onClick={() => copyToClipboard(color.hex)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wide">RGB</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{color.rgb}</span>
                          <Button
                            onClick={() => copyToClipboard(color.rgb)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wide">HSL</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{color.hsl}</span>
                          <Button
                            onClick={() => copyToClipboard(color.hsl)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Color Theory Tips */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Kleur Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <div>
                  <h4 className="text-white font-medium mb-2">🎨 Complementaire Kleuren</h4>
                  <p>Kleuren die tegenover elkaar staan op de kleurencirkel creëren sterke contrasten.</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">🌈 Analoge Kleuren</h4>
                  <p>Kleuren die naast elkaar staan creëren harmonieuze, rustgevende paletten.</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">⚖️ 60-30-10 Regel</h4>
                  <p>60% dominante kleur, 30% secundaire kleur, 10% accent kleur voor balans.</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">🔍 Toegankelijkheid</h4>
                  <p>Zorg voor voldoende contrast tussen tekst en achtergrond (minimaal 4.5:1).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
