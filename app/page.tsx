"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Code,
  Calculator,
  FileText,
  Brain,
  Palette,
  MessageSquare,
  LogIn,
  UserPlus,
  Zap,
  Star,
  Heart,
  ArrowRight,
  Play,
  Users,
  Globe,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="android-avatar animate-pulse">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>
    )
  }

  // If user is logged in, redirect to app
  if (user) {
    window.location.href = "/app"
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="android-header px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="android-avatar">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">QRP</h1>
              <p className="text-xs text-muted-foreground">AI Assistent Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="android-icon-button">
                <LogIn className="h-4 w-4 mr-2" />
                Inloggen
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="android-primary-button">
                <UserPlus className="h-4 w-4 mr-2" />
                Registreren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="space-y-6">
            <div className="mx-auto w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="h-16 w-16 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welkom bij QRP
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Je complete AI-assistent platform met geavanceerde tools voor programmeren, rekenen, documenten maken,
                en nog veel meer.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Star className="h-4 w-4 mr-2" />
                Gebruiksvriendelijk
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Heart className="h-4 w-4 mr-2" />
                Nederlands
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Veilig
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="android-primary-button text-lg px-8 py-4">
                  <Play className="h-5 w-5 mr-2" />
                  Gratis Beginnen
                </Button>
              </Link>
              <Link href="/link">
                <Button
                  variant="outline"
                  size="lg"
                  className="android-secondary-button text-lg px-8 py-4 bg-transparent"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Meer Informatie
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Krachtige AI-Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ontdek onze uitgebreide collectie AI-tools die je helpen bij dagelijkse taken
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "AI Chat",
                description: "Intelligente gesprekken met onze geavanceerde AI-assistent voor alle vragen.",
                color: "from-blue-400 to-blue-600",
                features: ["Natuurlijke gesprekken", "Contextbehoud", "Meertalig"],
              },
              {
                icon: Calculator,
                title: "AI Rekenmachine",
                description: "Geavanceerde berekeningen met AI-ondersteuning en stap-voor-stap uitleg.",
                color: "from-green-400 to-green-600",
                features: ["Complexe berekeningen", "Grafiek generatie", "Uitleg stappen"],
              },
              {
                icon: FileText,
                title: "Document AI",
                description: "Documenten maken, bewerken en analyseren met kunstmatige intelligentie.",
                color: "from-purple-400 to-purple-600",
                features: ["Auto-generatie", "Samenvatting", "Vertaling"],
              },
              {
                icon: Code,
                title: "Code Assistent",
                description: "Programmeren wordt makkelijk met onze AI-code generator en debugger.",
                color: "from-orange-400 to-orange-600",
                features: ["Code generatie", "Bug fixes", "Optimalisatie"],
              },
              {
                icon: Palette,
                title: "Creatieve AI",
                description: "Genereer afbeeldingen, designs en creatieve content met AI.",
                color: "from-pink-400 to-pink-600",
                features: ["Afbeelding generatie", "Design hulp", "Ideeën"],
              },
              {
                icon: Brain,
                title: "Leer Assistent",
                description: "Persoonlijke AI-tutor voor huiswerk, studie en kennisopbouw.",
                color: "from-indigo-400 to-indigo-600",
                features: ["Uitleg concepten", "Quiz maken", "Studieplanning"],
              },
            ].map((tool, index) => (
              <Card
                key={index}
                className="android-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <tool.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                  <div className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Vertrouwd door Duizenden</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-blue-100">Actieve Gebruikers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">1M+</div>
                <div className="text-blue-100">AI Gesprekken</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">99%</div>
                <div className="text-blue-100">Tevredenheid</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Waarom QRP Kiezen?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Ontdek de voordelen van ons AI-platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Users,
                  title: "Gebruiksvriendelijk",
                  description: "Intuïtieve interface ontworpen voor iedereen, van beginners tot experts.",
                },
                {
                  icon: Globe,
                  title: "Altijd Beschikbaar",
                  description: "24/7 toegang tot alle AI-tools, waar je ook bent.",
                },
                {
                  icon: Shield,
                  title: "Veilig & Privé",
                  description: "Je gegevens zijn veilig met onze geavanceerde beveiligingsmaatregelen.",
                },
                {
                  icon: Zap,
                  title: "Supersnel",
                  description: "Razendsnelle AI-responses voor maximale productiviteit.",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="android-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="android-avatar">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">QRP AI</div>
                    <div className="text-sm text-muted-foreground">Online</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="android-message-bubble android-message-assistant">
                    <p className="text-sm">Hallo! Ik ben QRP, je AI-assistent. Waar kan ik je mee helpen?</p>
                  </div>
                  <div className="android-message-bubble android-message-user ml-auto">
                    <p className="text-sm">Kun je me helpen met wiskunde?</p>
                  </div>
                  <div className="android-message-bubble android-message-assistant">
                    <p className="text-sm">
                      Natuurlijk! Ik help je graag met wiskundige problemen. Wat wil je berekenen?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Klaar om te Beginnen?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sluit je aan bij duizenden gebruikers die al profiteren van onze AI-tools
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="android-primary-button text-lg px-8 py-4">
                <UserPlus className="h-5 w-5 mr-2" />
                Gratis Account Maken
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="android-secondary-button text-lg px-8 py-4 bg-transparent">
                <LogIn className="h-5 w-5 mr-2" />
                Al een Account?
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="android-avatar w-8 h-8">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">QRP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Je vriendelijke AI-assistent platform voor alle dagelijkse taken.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/link" className="block text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/auth/register" className="block text-muted-foreground hover:text-foreground">
                  Prijzen
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/link" className="block text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
                <Link href="/link" className="block text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Bedrijf</h4>
              <div className="space-y-2 text-sm">
                <Link href="/link" className="block text-muted-foreground hover:text-foreground">
                  Over Ons
                </Link>
                <Link href="/link" className="block text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QRP. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
