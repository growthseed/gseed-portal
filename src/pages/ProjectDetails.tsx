import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  User,
  Star,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectDetails() {
  const { id } = useParams()

  const project = {
    id: 1,
    title: 'Desenvolvimento de E-commerce Completo',
    description: `Preciso de um desenvolvedor experiente para criar uma loja virtual completa com as seguintes características:

    • Sistema de cadastro e login de clientes
    • Catálogo de produtos com filtros e busca
    • Carrinho de compras e checkout
    • Integração com meios de pagamento (PagSeguro, Mercado Pago)
    • Painel administrativo para gestão de produtos, pedidos e clientes
    • Sistema de controle de estoque
    • Relatórios de vendas
    • Design responsivo e moderno
    
    Preferência por profissionais com experiência comprovada em projetos similares.`,
    category: 'Desenvolvimento Web',
    budget: 'R$ 5.000 - R$ 10.000',
    deadline: '30 dias',
    proposals: 15,
    location: 'São Paulo, SP',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
    postedAt: 'Há 2 dias',
    client: {
      name: 'João Silva',
      rating: 4.8,
      projects: 12,
      memberSince: 'Janeiro 2024',
      verified: true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/projects">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft size={20} />
            Voltar aos Projetos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>Publicado {project.postedAt}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Descrição do Projeto
                    </h3>
                    <div className="whitespace-pre-line text-gray-600">
                      {project.description}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Habilidades Necessárias
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Detalhes do Projeto
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Orçamento</p>
                          <p className="font-medium">{project.budget}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Prazo</p>
                          <p className="font-medium">{project.deadline}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Localização</p>
                          <p className="font-medium">{project.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Propostas</p>
                          <p className="font-medium">{project.proposals} enviadas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Enviar Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {project.proposals}
                  </p>
                  <p className="text-sm text-gray-500">propostas enviadas</p>
                </div>
                <Button className="w-full" size="lg">
                  Enviar Proposta
                </Button>
                <Button variant="outline" className="w-full">
                  Salvar Projeto
                </Button>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {project.client.name}
                      </p>
                      {project.client.verified && (
                        <CheckCircle size={16} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">
                        {project.client.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Projetos publicados</span>
                    <span className="font-medium">{project.client.projects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Membro desde</span>
                    <span className="font-medium">{project.client.memberSince}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}