"use client"

import { useState } from "react"
import { PhoneStartup } from "@/app/components/phone-startup"

export default function PhonePage() {
  const [showStartup, setShowStartup] = useState(true)

  if (showStartup) {
    return <PhoneStartup onComplete={() => setShowStartup(false)} />
  }

  // Redirect to main phone interface
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }

  return null
}
