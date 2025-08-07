'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest p-4">
      <Card className="w-full max-w-md bg-surface-container-high text-on-surface shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-error mb-4" />
          <CardTitle className="text-2xl font-bold text-error">Er is iets misgegaan!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We konden de pagina niet laden. Probeer het later opnieuw.
          </p>
          <p className="text-sm text-on-surface-variant">
            <strong className="font-semibold">Foutmelding:</strong> {error.message}
          </p>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="bg-primary text-on-primary hover:bg-primary/90"
          >
            Probeer opnieuw
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
