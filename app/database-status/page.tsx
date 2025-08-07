'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Database, CheckCircle, XCircle, Trash2 } from 'lucide-react'

interface DbStatus {
  chatCount: number
  messageCount: number
  visitorCount: number
  userCount: number
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [clearMessage, setClearMessage] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_status' }),
      })
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
      } else {
        setError(data.error || 'Fout bij het ophalen van de status.')
      }
    } catch (err: any) {
      setError(err.message || 'Netwerkfout bij het ophalen van de status.')
    } finally {
      setLoading(false)
    }
  }

  const handleClearAllData = async () => {
    if (!confirm('Weet je zeker dat je ALLE databasegegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
      return
    }

    setClearing(true)
    setClearMessage(null)
    try {
      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all_data' }),
      })
      const data = await response.json()
      if (data.success) {
        setClearMessage('Alle gegevens succesvol gewist!')
        fetchStatus() // Refresh status after clearing
      } else {
        setClearMessage(data.error || 'Fout bij het wissen van gegevens.')
      }
    } catch (err: any) {
      setClearMessage(err.message || 'Netwerkfout bij het wissen van gegevens.')
    } finally {
      setClearing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest p-4">
      <Card className="w-full max-w-md bg-surface-container-high text-on-surface shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Database Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Status laden...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-error">
              <XCircle className="h-8 w-8" />
              <p className="font-medium">Fout: {error}</p>
              <Button onClick={fetchStatus} className="bg-primary text-on-primary hover:bg-primary/90">
                Opnieuw proberen
              </Button>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-primary">
                <Database className="h-10 w-10" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-on-surface-variant">Chats:</div>
                <div className="text-right text-foreground">{status.chatCount}</div>
                <div className="font-medium text-on-surface-variant">Berichten:</div>
                <div className="text-right text-foreground">{status.messageCount}</div>
                <div className="font-medium text-on-surface-variant">Bezoekers:</div>
                <div className="text-right text-foreground">{status.visitorCount}</div>
                <div className="font-medium text-on-surface-variant">Gebruikers (placeholder):</div>
                <div className="text-right text-foreground">{status.userCount}</div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleClearAllData}
                  disabled={clearing}
                  className="bg-error text-on-error hover:bg-error/90"
                >
                  {clearing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wissen...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Wis alle gegevens
                    </>
                  )}
                </Button>
              </div>
              {clearMessage && (
                <p className={`text-center text-sm ${clearMessage.includes('succesvol') ? 'text-green-600' : 'text-error'}`}>
                  {clearMessage}
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
