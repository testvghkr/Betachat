"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadResult(null)
      setError(null)
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadResult(data)
        console.log("Upload successful:", data)
      } else {
        setError(data.error || "Upload failed")
        console.error("Upload failed:", data)
      }
    } catch (err) {
      setError("Network error")
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">Upload Test</h1>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Selecteer een bestand:</label>
              <Input
                type="file"
                onChange={handleFileSelect}
                className="bg-gray-700 border-gray-600 text-white"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.js,.py,.html,.css,.json"
              />
            </div>

            {selectedFile && (
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-white font-medium mb-2">Geselecteerd bestand:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>📄 Naam: {selectedFile.name}</li>
                  <li>📏 Grootte: {(selectedFile.size / 1024).toFixed(2)} KB</li>
                  <li>🏷️ Type: {selectedFile.type || "Onbekend"}</li>
                </ul>
              </div>
            )}

            <Button
              onClick={uploadFile}
              disabled={!selectedFile || loading}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500"
            >
              {loading ? "Uploaden..." : "Upload Bestand"}
            </Button>

            {error && (
              <div className="bg-red-900 border border-red-700 p-4 rounded">
                <h3 className="text-red-200 font-medium">❌ Upload Error:</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {uploadResult && (
              <div className="bg-green-900 border border-green-700 p-4 rounded">
                <h3 className="text-green-200 font-medium mb-2">✅ Upload Successful!</h3>
                <ul className="text-green-300 text-sm space-y-1">
                  <li>
                    🔗 URL:{" "}
                    <a href={uploadResult.url} target="_blank" className="underline" rel="noreferrer">
                      {uploadResult.url}
                    </a>
                  </li>
                  <li>📄 Filename: {uploadResult.filename}</li>
                  <li>📏 Size: {uploadResult.size} bytes</li>
                  <li>🏷️ Type: {uploadResult.type}</li>
                </ul>

                {uploadResult.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) && (
                  <div className="mt-4">
                    <img
                      src={uploadResult.url || "/placeholder.svg"}
                      alt="Uploaded file"
                      className="max-w-full h-auto rounded"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button
              onClick={() => (window.location.href = "/chat")}
              variant="outline"
              className="w-full border-gray-600 text-gray-300"
            >
              ← Terug naar Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
