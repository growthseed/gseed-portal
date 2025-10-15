import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  TrendingUp,
  Star
} from 'lucide-react'

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'Desenvolvimento de E-commerce Completo',
      description: 'Preciso de um desenvolvedor para criar uma loja virtual completa com painel administrativo, integração com pagamentos e sistema de estoque.',
      category: 'Desenvolvimento Web',
      budget: 'R$ 5.000 - R$ 10.000',
      deadline: '30 dias',
      proposals: 15,
      location: 'São Paulo, SP',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      featured: true
    },
    {
      id: 2,
      title: 'Design de Identidade Visual',
      description: 'Busco designer para criar identidade visual completa incluindo logo, paleta de cores, tipografia e manual de marca.',
      category: 'Design',
      budget: 'R$ 2.000 - R$ 3.000',
      deadline: '15 dias',
      proposals: 8,
      location: 'Rio de Janeiro, RJ',
      skills: ['Illustrator', 'Photoshop', 'Branding']
    },
    {
      id: 3,
      title: 'App Mobile para Delivery',
      description: 'Desenvolvimento de aplicativo mobile para iOS e Android para sistema de delivery de restaurante.',
      category: 'Mobile',
      budget: 'R$ 8.000 - R$ 15.000',
      deadline: '45 dias',
      proposals: 12,
      location: 'Remoto',
      skills: ['React Native', 'Firebase', 'API REST']
    }
  ]

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'web', label: 'Desenvolvimento Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'writing', label: 'Redação' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projetos Disponíveis
          </h1>
          <p className="text-gray-600">
            Encontre projetos que combinam com suas habilidades
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="icon">
              <Filter size={20} />
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className={project.featured ? 'border-blue-500' : ''}>
              {project.featured && (
                <div className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-t-lg flex items-center gap-1">
                  <Star size={14} />
                  Destaque
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={16} />
                      <span>{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{project.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase size={16} />
                      <span>{project.proposals} propostas</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Link to={`/projects/${project.id}`} className="flex-1">
                      <Button className="w-full">Ver Detalhes</Button>
                    </Link>
                    <Button variant="outline">
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Carregar Mais Projetos
          </Button>
        </div>
      </div>
    </div>
  )
}