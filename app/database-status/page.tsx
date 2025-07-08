"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/database")
      const data = await response.json()

      if (response.ok) {
        setStatus(data)
      } else {
        setError(data.error || "Database test failed")
        setStatus(data)
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const resetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the database? This will delete ALL data!")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Database reset successfully!")
        checkDatabase()
      } else {
        alert("Reset failed: " + data.error)
      }
    } catch (err) {
      alert("Reset failed: Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">🗄️ Database Management</h1>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-4">Database Status</h2>

            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-white">Checking database...</p>
              </div>
            )}

            {!loading && status && (
              <div className="space-y-4">
                <div className={`p-4 rounded ${status.success ? "bg-green-900" : "bg-red-900"}`}>
                  <h3 className={`font-bold ${status.success ? "text-green-200" : "text-red-200"}`}>
                    {status.success ? "✅ Database Online" : "❌ Database Error"}
                  </h3>
                  <p className={status.success ? "text-green-300" : "text-red-300"}>{status.message}</p>
                </div>

                {status.stats && (
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-white font-bold mb-2">📊 Statistics:</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{status.stats.users}</div>
                        <div className="text-gray-300 text-sm">Users</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{status.stats.chats}</div>
                        <div className="text-gray-300 text-sm">Chats</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{status.stats.messages}</div>
                        <div className="text-gray-300 text-sm">Messages</div>
                      </div>
                    </div>
                  </div>
                )}

                {status.recentUsers && status.recentUsers.length > 0 && (
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-white font-bold mb-2">👥 Recent Users:</h3>
                    <div className="space-y-2">
                      {status.recentUsers.map((user: any) => (
                        <div key={user.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">
                            {user.name} ({user.email})
                          </span>
                          <span className="text-orange-400">{user._count.chats} chats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-white font-bold mb-2">⚙️ Configuration:</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>🔗 Database URL: {status.database_url}</li>
                    <li>🕐 Last Check: {new Date(status.timestamp).toLocaleString()}</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button
                onClick={checkDatabase}
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
              >
                🔄 Refresh Status
              </Button>
              <Button onClick={resetDatabase} variant="destructive" className="bg-red-600 hover:bg-red-700">
                🗑️ Reset Database
              </Button>
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                ← Back to Login
              </Button>
            </div>
          </div>

          {/* Test Accounts Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-4">🧪 Test Accounts</h2>
            <p className="text-gray-300 mb-4">Use these accounts to test the system:</p>

            <div className="space-y-3">
              <div className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="text-white font-medium">Test Account 1:</div>
                <div className="text-orange-400 text-sm">Email: test@qrp.com</div>
                <div className="text-blue-400 text-sm">Password: test123</div>
              </div>
              <div className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="text-white font-medium">Test Account 2:</div>
                <div className="text-orange-400 text-sm">Email: demo@qrp.com</div>
                <div className="text-blue-400 text-sm">Password: test123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
