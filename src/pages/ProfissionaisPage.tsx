import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Briefcase, Filter, X, UserPlus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { professionalService } from '@/services/professionalService';
import { FilterSidebar } from '@/components/layout/FilterSidebar';
import type { Profile } from '@/types/database.types';

interface Filters {
  search: string;
  profession?: string;
  skills?: string[];
  location?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  isAvailable?: boolean;
  isAsdrm?: boolean;
}

export function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
  });
  const [showFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Carregar profissionais com useCallback para memoização
  const loadProfissionais = useCallback(async () => {
    console.log('[ProfissionaisPage] 🔄 Carregando profissionais...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await professionalService.getAll({
        search: filters.search || undefined,
        skills: filters.skills || undefined,
        location: filters.location || undefined,
        min_rate: filters.minRate || undefined,
        max_rate: filters.maxRate || undefined,
        min_rating: filters.minRating || undefined,
        is_available: filters.isAvailable,
        is_asdrm_member: filters.isAsdrm,
      });
      
      if (result.success && result.data) {
        console.log('[ProfissionaisPage] ✅ Profissionais carregados:', result.data.length);
        setProfissionais(result.data);
      } else {
        console.error('[ProfissionaisPage] ❌ Erro ao carregar:', result.message);
        setError(result.message || 'Erro ao carregar profissionais');
      }
    } catch (err: any) {
      console.error('[ProfissionaisPage] 💥 Erro fatal:', err);
      setError(err.message || 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.skills,
    filters.location,
    filters.minRate,
    filters.maxRate,
    filters.minRating,
    filters.isAvailable,
    filters.isAsdrm
  ]);

  // Carregar profissionais apenas quando filtros mudarem
  useEffect(() => {
    console.log('[ProfissionaisPage] 📍 Filtros mudaram, recarregando...');
    loadProfissionais();
  }, [loadProfissionais]);

  const clearFilters = useCallback(() => {
    setFilters({ search: '' });
  }, []);

  const activeFiltersCount = useMemo(() => 
    (filters.profession ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? filters.skills.length : 0) +
    (filters.location ? 1 : 0) +
    (filters.minRate ? 1 : 0) +
    (filters.maxRate ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.isAvailable ? 1 : 0),
    [filters]
  );

  const formatCurrency = (value?: number) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar de Filtros */}
      <FilterSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        filters={filters}
        onFiltersChange={setFilters}
        type="profissionais"
      />
      
      {/* Conteúdo Principal */}
      <div className="flex-1">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Profissionais
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {profissionais.length} {profissionais.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar por nome, habilidades ou localização..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12"
              />
            </div>
            
            {/* Botão de Filtros - Mobile */}
            <Button
              variant={showSidebar ? 'default' : 'outline'}
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-12 relative lg:hidden"
            >
              <SlidersHorizontal size={20} className="mr-2" />
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
            
            {/* Botão Desktop para Toggle Sidebar */}
            <Button
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-12 hidden lg:flex"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              {showSidebar ? 'Ocultar Filtros' : 'Mostrar Filtros'}
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
                {/* Localização */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Localização
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Cidade ou Estado"
                      value={filters.location || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: e.target.value || undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Valor Mínimo/Hora */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Mín./Hora
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.minRate || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minRate: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                {/* Valor Máximo/Hora */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Máx./Hora
                  </label>
                  <Input
                    type="number"
                    placeholder="Sem limite"
                    value={filters.maxRate || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxRate: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                {/* Avaliação Mínima */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avaliação Mínima
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0"
                      value={filters.minRating || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        minRating: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isAvailable || false}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isAvailable: e.target.checked || undefined 
                    }))}
                    className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Apenas disponíveis
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={filters.isAvailable ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                isAvailable: !prev.isAvailable || undefined 
              }))}
            >
              Disponíveis Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando profissionais...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={loadProfissionais}>Tentar Novamente</Button>
          </div>
        ) : profissionais.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum profissional encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || activeFiltersCount > 0
                ? 'Tente ajustar seus filtros de busca'
                : 'Ainda não há profissionais cadastrados'}
            </p>
            {(filters.search || activeFiltersCount > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionais.map((profissional) => (
              <Link
                key={profissional.id}
                to={`/profissionais/${profissional.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gseed-500 dark:hover:border-gseed-500 transition-all"
              >
                {/* Avatar & Cover */}
                <div className="relative h-32 bg-gradient-to-r from-gseed-500 to-gseed-600">
                  {profissional.cover_url && (
                    <img 
                      src={profissional.cover_url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute -bottom-10 left-4">
                    {profissional.avatar_url ? (
                      <img 
                        src={profissional.avatar_url} 
                        alt={profissional.name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-800">
                        {profissional.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-12">
                  {/* Nome & Título */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gseed-600 dark:group-hover:text-gseed-400 transition-colors">
                      {profissional.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profissional.professional_title || 'Profissional'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      <span>{profissional.views_count || 0} visualizações</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {profissional.professional_bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {profissional.professional_bio}
                    </p>
                  )}

                  {/* Skills */}
                  {profissional.skills && profissional.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {profissional.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profissional.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profissional.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">A partir de</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(profissional.hourly_rate ? Number(profissional.hourly_rate) : undefined)}/h
                      </div>
                    </div>
                    
                    <Badge variant={(profissional.availability === 'freelance' || profissional.availability === 'part_time') ? 'success' : 'secondary'}>
                      {(profissional.availability === 'freelance' || profissional.availability === 'part_time') ? 'Disponível' : 'Ocupado'}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default ProfissionaisPage;
