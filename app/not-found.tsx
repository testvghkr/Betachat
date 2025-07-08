import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <Image src="/qrp-logo.png" alt="QRP Logo" width={120} height={80} className="object-contain mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-4">Pagina niet gevonden</h2>
        <p className="text-gray-400 mb-6">De pagina die je zoekt bestaat niet.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
            Terug naar home
          </Button>
        </Link>
      </div>
    </div>
  )
}
