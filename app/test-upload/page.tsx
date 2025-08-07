'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, XCircle } from 'lucide-react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setFileUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Upload successful! URL: ${data.url}`);
        setFileUrl(data.url);
        setFile(null);
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setMessage(`Upload failed: ${(error as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <Card className="w-full max-w-md glass-surface border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Bestand Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              onChange={handleFileChange}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            {file && (
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-red-400 hover:bg-red-500/20">
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
          {file && <p className="text-sm text-white/80">Geselecteerd bestand: {file.name}</p>}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {uploading ? 'Uploaden...' : 'Upload Bestand'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
          {message && <p className="text-center text-sm">{message}</p>}
          {fileUrl && (
            <div className="text-center">
              <p className="text-sm text-white/80">Bestand URL:</p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline break-all">
                {fileUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
