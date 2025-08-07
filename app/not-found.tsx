import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-4">
      <h2 className="text-4xl font-bold mb-4">404 - Pagina niet gevonden</h2>
      <p className="text-lg text-white/80 mb-6">
        De pagina die je zoekt bestaat niet.
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Terug naar de homepage
        </Button>
      </Link>
    </div>
  );
}
