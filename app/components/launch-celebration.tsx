"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LaunchCelebrationProps {
  onClose: () => void
  visitorNumber: number
}

export function LaunchCelebration({ onClose, visitorNumber }: LaunchCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Confetti */}
      {showConfetti && <ConfettiEffect />}

      {/* Modal */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-lg"></div>

        <div className="relative z-10">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={100} height={60} className="object-contain mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-white mb-2">🎉 Gefeliciteerd!</h1>
          <p className="text-gray-300 mb-4">Je bent een van de eerste die dit ziet!</p>

          <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg p-4 mb-6">
            <div className="text-white text-lg font-bold">Bezoeker #{visitorNumber}</div>
            <div className="text-orange-100 text-sm">QRP v2.0 is nu live! 🚀</div>
          </div>

          <div className="space-y-2 text-sm text-gray-400 mb-6">
            <p>✨ AI-powered chatbot in het Nederlands</p>
            <p>💬 Hulp met code, huiswerk en creatieve projecten</p>
            <p>👤 Eenvoudig account management</p>
            <p>🚀 Direct aan de slag</p>
            <p>🔒 Veilig en privé</p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
          >
            Laten we beginnen! 🎯
          </Button>
        </div>
      </div>
    </div>
  )
}

function ConfettiEffect() {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="absolute w-2 h-2 opacity-80"
      style={{
        left: `${Math.random() * 100}%`,
        backgroundColor: Math.random() > 0.5 ? "#f97316" : "#3b82f6",
        animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`,
        animationDelay: `${Math.random() * 2}s`,
      }}
    />
  ))

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">{confettiPieces}</div>
    </>
  )
}
