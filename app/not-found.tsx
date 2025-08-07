import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-lowest text-on-surface p-4 text-center">
      <Frown className="h-20 w-20 text-primary mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-4">404 - Pagina niet gevonden</h1>
      <p className="text-lg text-muted-foreground mb-8">
        De pagina die je zoekt bestaat niet.
      </p>
      <Link href="/" passHref>
        <Button className="bg-primary text-on-primary hover:bg-primary/90">
          Terug naar de homepage
        </Button>
      </Link>
    </div>
  )
}
