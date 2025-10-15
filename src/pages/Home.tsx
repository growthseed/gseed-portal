import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Briefcase, Users, Shield, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Conecte-se com os melhores
            <span className="text-blue-600"> freelancers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre profissionais qualificados para seus projetos ou ofereça seus serviços para empresas de todo o Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Começar Agora
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline">
                Ver Projetos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">10k+</div>
            <div className="text-gray-600 mt-2">Projetos Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">5k+</div>
            <div className="text-gray-600 mt-2">Freelancers Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600 mt-2">Taxa de Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">R$ 2M+</div>
            <div className="text-gray-600 mt-2">Em Projetos</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher o GSeed Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Pagamento Seguro</h3>
              <p className="text-gray-600">
                Sistema de escrow que protege tanto clientes quanto freelancers
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Star size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Profissionais Verificados</h3>
              <p className="text-gray-600">
                Todos os freelancers passam por processo de verificação
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Suporte Dedicado</h3>
              <p className="text-gray-600">
                Equipe pronta para ajudar em todas as etapas do projeto
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}