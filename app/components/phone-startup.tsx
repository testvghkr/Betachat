"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PhoneStartupProps {
  onComplete: () => void
}

export function PhoneStartup({ onComplete }: PhoneStartupProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1)
      } else {
        onComplete()
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [step, onComplete])

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(progressTimer)
  }, [])

  const steps = [
    {
      title: "QRP OS",
      subtitle: "Opstarten...",
      icon: <Image src="/qrp-logo.png" alt="QRP" width={60} height={60} className="object-contain" />,
    },
    {
      title: "Systeem Laden",
      subtitle: "Apps voorbereiden...",
      icon: <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>,
    },
    {
      title: "Bijna Klaar",
      subtitle: "Interface laden...",
      icon: <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-pulse"></div>,
    },
    {
      title: "Welkom",
      subtitle: "QRP OS is klaar!",
      icon: <Image src="/qrp-logo.png" alt="QRP" width={60} height={60} className="object-contain animate-bounce" />,
    },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">{steps[step]?.icon}</div>

        <h1 className="text-white text-2xl font-bold mb-2">{steps[step]?.title}</h1>
        <p className="text-gray-400 mb-8">{steps[step]?.subtitle}</p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mb-4">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-gray-500 text-sm">{progress}%</p>
      </div>
    </div>
  )
}
