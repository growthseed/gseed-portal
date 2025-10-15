import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={20} />
              Voltar
            </Button>
          </Link>
          <Link to="/">
            <Button className="gap-2">
              <Home size={20} />
              Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}