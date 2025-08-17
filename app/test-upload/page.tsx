'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setUploadStatus('idle')
      setUploadedUrl(null)
      setErrorMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Geen bestand geselecteerd.')
      return
    }

    setUploadStatus('uploading')
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload mislukt.')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
      setUploadStatus('success')
    } catch (error: any) {
      setErrorMessage(error.message || 'Er is een onbekende fout opgetreden tijdens het uploaden.')
      setUploadStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest p-4">
      <Card className="w-full max-w-md bg-surface-container-high text-on-surface shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Bestand Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="file-input" className="cursor-pointer">
              <Button asChild variant="outline" className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container-low">
                <Upload className="h-8 w-8 mb-2" />
                <span>Kies bestand</span>
              </Button>
            </label>
            <Input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">Geselecteerd: <span className="font-medium text-foreground">{selectedFile.name}</span></p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === 'uploading'}
            className="w-full bg-primary text-on-primary hover:bg-primary/90"
          >
            {uploadStatus === 'uploading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploaden...
              </>
            ) : (
              'Upload bestand'
            )}
          </Button>

          {uploadStatus === 'success' && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Upload succesvol!</p>
              {uploadedUrl && (
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                  Bekijk bestand
                </a>
              )}
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center justify-center space-x-2 text-error">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">Upload mislukt!</p>
              {errorMessage && <p className="text-sm text-error-container">{errorMessage}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
