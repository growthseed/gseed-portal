import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, DollarSign, Briefcase, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/projetos/ProjectCard';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/database.types';

interface Filters {
  search: string;
  category?: string;
  workModel?: 'remote' | 'onsite' | 'hybrid';
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  skills?: string[];
}

export function ProjetosPage() {
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Categorias disponíveis
  const categorias = [
    'Desenvolvimento Web',
    'Design',
    'Marketing',
    'Redação',
    'Consultoria',
    'Dados',
    'Outro'
  ];

  useEffect(() => {
    loadProjetos();
  }, [filters]);

  const loadProjetos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await projectService.getAll({
        search: filters.search || undefined,
        category: filters.category || undefined,
        work_model: filters.workModel || undefined,
        min_budget: filters.minBudget || undefined,
        max_budget: filters.maxBudget || undefined,
        location: filters.location || undefined,
        skills: filters.skills || undefined,
      });
      
      if (result.success && result.data) {
        setProjetos(result.data);
      } else {
        setError(result.message || 'Erro ao carregar projetos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category
    }));
  };

  const handleWorkModelChange = (model: 'remote' | 'onsite' | 'hybrid') => {
    setFilters(prev => ({
      ...prev,
      workModel: prev.workModel === model ? undefined : model
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '' });
  };

  const activeFiltersCount = 
    (filters.category ? 1 : 0) +
    (filters.workModel ? 1 : 0) +
    (filters.minBudget ? 1 : 0) +
    (filters.maxBudget ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? 1 : 0);

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Projetos Disponíveis
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {projetos.length} {projetos.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
              </p>
            </div>
            
            <Button asChild size="lg">
              <Link to="/criar-projeto">
                <Briefcase className="mr-2" size={20} />
                Criar Projeto
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar projetos por título, descrição ou habilidades..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 relative"
            >
              <Filter size={20} className="mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Filtros Avançados
                </h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X size={16} className="mr-1" />
                    Limpar Filtros
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      category: e.target.value || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 dark:text-white"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Modelo de Trabalho */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modelo de Trabalho
                  </label>
                  <select
                    value={filters.workModel || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      workModel: e.target.value as any || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 dark:text-white"
                  >
                    <option value="">Todos os modelos</option>
                    <option value="remote">Remoto</option>
                    <option value="onsite">Presencial</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                </div>

                {/* Orçamento Mínimo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Orçamento Mínimo
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minBudget || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        minBudget: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Orçamento Máximo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Orçamento Máximo
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="number"
                      placeholder="Sem limite"
                      value={filters.maxBudget || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        maxBudget: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={!filters.category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
            >
              Todos
            </Button>
            {categorias.slice(0, 5).map(cat => (
              <Button
                key={cat}
                variant={filters.category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando projetos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={loadProjetos}>Tentar Novamente</Button>
          </div>
        ) : projetos.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || activeFiltersCount > 0
                ? 'Tente ajustar seus filtros de busca'
                : 'Seja o primeiro a criar um projeto!'}
            </p>
            {(filters.search || activeFiltersCount > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjetosPage;