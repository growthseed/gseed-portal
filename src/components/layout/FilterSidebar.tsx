import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { professionCategories } from '@/data/professions';

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

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  type: 'profissionais' | 'projetos';
}

export function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  type,
}: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableProfessions, setAvailableProfessions] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Quando categoria mudar, atualizar profissões disponíveis
  useEffect(() => {
    if (selectedCategory && professionCategories[selectedCategory as keyof typeof professionCategories]) {
      const category = professionCategories[selectedCategory as keyof typeof professionCategories];
      setAvailableProfessions(category.specialties);
    } else {
      setAvailableProfessions([]);
    }
  }, [selectedCategory]);

  // Quando profissão mudar, atualizar habilidades disponíveis
  useEffect(() => {
    if (filters.profession && selectedCategory) {
      const category = professionCategories[selectedCategory as keyof typeof professionCategories];
      if (category) {
        setAvailableSkills(category.skills);
      }
    } else {
      setAvailableSkills([]);
    }
  }, [filters.profession, selectedCategory]);

  const handleProfessionChange = (profession: string) => {
    onFiltersChange({
      ...filters,
      profession: profession || undefined,
      skills: [], // Limpar habilidades ao mudar profissão
    });
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    onFiltersChange({
      ...filters,
      skills: newSkills.length > 0 ? newSkills : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    onFiltersChange({
      search: filters.search,
    });
  };

  const activeFiltersCount =
    (filters.profession ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? filters.skills.length : 0) +
    (filters.location ? 1 : 0) +
    (filters.minRate ? 1 : 0) +
    (filters.maxRate ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.isAvailable ? 1 : 0) +
    (filters.isAsdrm ? 1 : 0);

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
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                onFiltersChange({ ...filters, profession: undefined, skills: [] });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {Object.keys(professionCategories).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Profissão/Especialidade */}
          {selectedCategory && availableProfessions.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profissão/Especialidade
              </label>
              <select
                value={filters.profession || ''}
                onChange={(e) => handleProfessionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
              >
                <option value="">Selecione a profissão</option>
                {availableProfessions.map(profession => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
                <option value="Outro">Outro</option>
              </select>
            </div>
          )}

          {/* Habilidades - Aparecem apenas após selecionar profissão */}
          {filters.profession && availableSkills.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Habilidades
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableSkills.map(skill => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.skills?.includes(skill) || false}
                      onChange={() => handleSkillToggle(skill)}
                      className="w-4 h-4 text-gseed-600 border-gray-300 rounded focus:ring-2 focus:ring-gseed-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Outros Filtros */}
          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Membro ASDMR */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isAsdrm || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  isAsdrm: e.target.checked || undefined,
                })}
                className="w-5 h-5 text-gseed-600 border-gray-300 rounded focus:ring-2 focus:ring-gseed-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Apenas membros ASDMR
              </span>
            </label>

            {/* Disponível */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isAvailable || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  isAvailable: e.target.checked || undefined,
                })}
                className="w-5 h-5 text-gseed-600 border-gray-300 rounded focus:ring-2 focus:ring-gseed-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Apenas disponíveis
              </span>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}
