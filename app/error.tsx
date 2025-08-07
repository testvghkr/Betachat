'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Oeps! Er ging iets mis.</h2>
      <p className="text-lg text-white/80 mb-6">
        We konden de pagina niet laden. Probeer het later opnieuw.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Probeer opnieuw
      </Button>
    </div>
  );
}
