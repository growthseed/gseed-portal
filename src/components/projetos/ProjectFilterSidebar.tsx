import { X, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { professionCategories } from '@/data/professions';

interface Filters {
  search: string;
  category?: string;
  workModel?: 'remote' | 'onsite' | 'hybrid';
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  skills?: string[];
}

interface ProjectFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

// Extrair nomes das categorias de profissões
const categorias = Object.keys(professionCategories);

export function ProjectFilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: ProjectFilterSidebarProps) {
  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
    });
  };

  const activeFiltersCount =
    (filters.category ? 1 : 0) +
    (filters.workModel ? 1 : 0) +
    (filters.minBudget ? 1 : 0) +
    (filters.maxBudget ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? filters.skills.length : 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filtros
              </h2>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Limpar todos os filtros
            </button>
          )}

          {/* Categoria */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="inline mr-1" size={16} />
              Categoria
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  category: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => {
                const categoryData = professionCategories[cat as keyof typeof professionCategories];
                return (
                  <option key={cat} value={cat}>
                    {categoryData.icon} {cat}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Modelo de Trabalho */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Modelo de Trabalho
            </label>
            <div className="space-y-2">
              {[
                { value: 'remote', label: 'Remoto' },
                { value: 'onsite', label: 'Presencial' },
                { value: 'hybrid', label: 'Híbrido' },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="workModel"
                    checked={filters.workModel === value}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        workModel: filters.workModel === value ? undefined : (value as any),
                      })
                    }
                    className="w-4 h-4 text-gseed-600 border-gray-300 focus:ring-2 focus:ring-gseed-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline mr-1" size={16} />
              Localização
            </label>
            <input
              type="text"
              placeholder="Cidade ou Estado"
              value={filters.location || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  location: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
            />
          </div>

          {/* Orçamento */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <DollarSign className="inline mr-1" size={16} />
              Orçamento
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minBudget || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minBudget: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Máximo
                </label>
                <input
                  type="number"
                  placeholder="Sem limite"
                  value={filters.maxBudget || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxBudget: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filtros Rápidos
            </label>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFiltersChange({ ...filters, workModel: 'remote' })}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  filters.workModel === 'remote'
                    ? 'bg-gseed-500 text-white border-gseed-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gseed-500'
                }`}
              >
                Remoto
              </button>
              
              <button
                onClick={() => onFiltersChange({ ...filters, minBudget: undefined, maxBudget: 500 })}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  filters.maxBudget === 500
                    ? 'bg-gseed-500 text-white border-gseed-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gseed-500'
                }`}
              >
                Até R$ 500
              </button>
              
              <button
                onClick={() => onFiltersChange({ ...filters, minBudget: 500, maxBudget: 2500 })}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  filters.minBudget === 500 && filters.maxBudget === 2500
                    ? 'bg-gseed-500 text-white border-gseed-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gseed-500'
                }`}
              >
                R$ 500 - R$ 2.500
              </button>
              
              <button
                onClick={() => onFiltersChange({ ...filters, minBudget: 2500, maxBudget: 10000 })}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  filters.minBudget === 2500 && filters.maxBudget === 10000
                    ? 'bg-gseed-500 text-white border-gseed-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gseed-500'
                }`}
              >
                R$ 2.500 - R$ 10.000
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
