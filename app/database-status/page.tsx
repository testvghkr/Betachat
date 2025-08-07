'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  const checkDatabaseStatus = async () => {
    setStatus('loading');
    setErrorMessage(null);
    setTables([]);
    try {
      const dbTestResponse = await fetch('/api/test-db');
      const dbTestData = await dbTestResponse.json();

      if (!dbTestResponse.ok) {
        throw new Error(dbTestData.error || 'Failed to connect to database');
      }

      const tablesResponse = await fetch('/api/admin/database');
      const tablesData = await tablesResponse.json();

      if (!tablesResponse.ok) {
        throw new Error(tablesData.error || 'Failed to fetch tables');
      }

      setStatus('success');
      setTables(tablesData.tables);
    } catch (error) {
      setStatus('error');
      setErrorMessage((error as Error).message);
      console.error('Database status check failed:', error);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <Card className="w-full max-w-md glass-surface border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Database Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-400 mb-3" />
              <p>Database status controleren...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mb-3" />
              <p className="text-lg font-semibold">Database verbinding succesvol!</p>
              {tables.length > 0 && (
                <div className="mt-4 w-full">
                  <p className="font-medium mb-2">Gevonden tabellen:</p>
                  <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                    {tables.map((table, index) => (
                      <li key={index}>{table}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center text-center">
              <XCircle className="h-12 w-12 text-red-400 mb-3" />
              <p className="text-lg font-semibold">Database verbinding mislukt!</p>
              {errorMessage && (
                <p className="text-sm text-red-300 mt-2">Fout: {errorMessage}</p>
              )}
              <Button
                onClick={checkDatabaseStatus}
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Opnieuw proberen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
