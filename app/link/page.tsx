"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Sparkles,
  Code,
  BookOpen,
  Palette,
  Brain,
  Music,
  Video,
  Calculator,
  Calendar,
  FileText,
  Heart,
  Zap,
  Star,
  Download,
  Share,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Android Header */}
      <div className="android-header flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-lg dark:bg-gray-900/80">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="android-icon-button">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">QRP Introductie</h1>
            <p className="text-xs text-muted-foreground">Ontdek wat ik kan</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="h-12 w-12 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hallo! Ik ben QRP 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Je vriendelijke AI-assistent die je helpt met alles van programmeren tot huiswerk maken, van creatieve
              projecten tot het oplossen van complexe problemen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Vriendelijk
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Heart className="h-3 w-3 mr-1" />
              Behulpzaam
            </Badge>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Wat kan ik voor je doen?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code,
                title: "Programmeren",
                description:
                  "Code schrijven, debuggen, uitleggen van concepten, en helpen met projecten in verschillende programmeertalen.",
                color: "from-green-400 to-blue-500",
              },
              {
                icon: BookOpen,
                title: "Huiswerk & Leren",
                description: "Uitleg van moeilijke concepten, hulp bij opdrachten, en begeleiding bij het leerproces.",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Palette,
                title: "Creatieve Projecten",
                description: "Ideeën genereren, ontwerpen bespreken, en helpen bij creatieve uitdagingen.",
                color: "from-pink-400 to-red-500",
              },
              {
                icon: Brain,
                title: "Problemen Oplossen",
                description: "Analytisch denken, strategieën ontwikkelen, en complexe vraagstukken aanpakken.",
                color: "from-purple-400 to-indigo-500",
              },
              {
                icon: Calculator,
                title: "Wiskunde & Rekenen",
                description: "Van eenvoudige berekeningen tot complexe wiskundige problemen oplossen.",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: FileText,
                title: "Teksten Schrijven",
                description: "Essays, rapporten, brieven, en andere teksten schrijven en verbeteren.",
                color: "from-teal-400 to-green-500",
              },
            ].map((capability, index) => (
              <Card
                key={index}
                className="android-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${capability.color} flex items-center justify-center mb-3`}
                  >
                    <capability.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <Card className="android-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Speciale Functies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <Music className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Spraakherkenning</h4>
                  <p className="text-sm text-muted-foreground">Spreek je vragen in plaats van typen</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Bestand Upload</h4>
                  <p className="text-sm text-muted-foreground">Upload afbeeldingen en documenten voor analyse</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Chat Geschiedenis</h4>
                  <p className="text-sm text-muted-foreground">Al je gesprekken worden bewaard</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                  <Download className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Export Functie</h4>
                  <p className="text-sm text-muted-foreground">Download je gesprekken als JSON</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality Section */}
        <Card className="android-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Mijn Persoonlijkheid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ik ben ontworpen om <strong>vriendelijk</strong> en <strong>behulpzaam</strong> te zijn. Ik spreek mensen
              altijd respectvol aan in het Nederlands en probeer elke vraag zo goed mogelijk te beantwoorden. Of je nu
              hulp nodig hebt met een eenvoudige vraag of een complex probleem, ik sta altijd klaar om te helpen!
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Vriendelijk",
                "Geduldig",
                "Behulpzaam",
                "Creatief",
                "Analytisch",
                "Betrouwbaar",
                "Enthousiast",
                "Leergierig",
              ].map((trait, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Klaar om te beginnen?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ik sta klaar om je te helpen met al je vragen en projecten. Laten we samen aan de slag gaan!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="android-primary-button">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start een gesprek
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="android-secondary-button bg-transparent">
              <Share className="h-4 w-4 mr-2" />
              Deel QRP
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            QRP - Je vriendelijke AI-assistent • Gemaakt met ❤️ voor iedereen
          </p>
        </div>
      </div>
    </div>
  )
}
