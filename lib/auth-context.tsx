"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  isGuest?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, name: string, password: string) => Promise<boolean>
  loginAsGuest: () => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check localStorage for user session
      const savedUser = localStorage.getItem("qrp_user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo users for testing
      const demoUsers = [
        { id: "1", email: "demo@qrp.com", password: "demo123", name: "Demo Gebruiker" },
        { id: "2", email: "test@qrp.com", password: "test123", name: "Test Gebruiker" },
        { id: "3", email: "guest@qrp.com", password: "guest123", name: "Gast Gebruiker", isGuest: true },
      ]

      const user = demoUsers.find((u) => u.email === email && u.password === password)

      if (user) {
        const userData = { id: user.id, email: user.email, name: user.name, isGuest: user.isGuest }
        setUser(userData)
        localStorage.setItem("qrp_user", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll create a user with a random ID
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        isGuest: false,
      }

      setUser(userData)
      localStorage.setItem("qrp_user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const loginAsGuest = async (): Promise<boolean> => {
    try {
      const guestData = {
        id: "guest_" + Date.now(),
        email: "guest@qrp.com",
        name: "Gast Gebruiker",
        isGuest: true,
      }

      setUser(guestData)
      localStorage.setItem("qrp_user", JSON.stringify(guestData))
      return true
    } catch (error) {
      console.error("Guest login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("qrp_user")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginAsGuest,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
