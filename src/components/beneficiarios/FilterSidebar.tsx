import { useState } from 'react';
import { 
  Search, 
  Filter, 
  X,
  MapPin,
  Calendar,
  Activity,
  Star,
  ChevronDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge-advanced';

interface FilterSidebarProps {
  onFilterChange?: (filters: BeneficiarioFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export interface BeneficiarioFilters {
  busca: string;
  status: string[];
  estado: string[];
  cidade: string;
  sexo: string[];
  profissao?: string;
  valorMin?: number;
  valorMax?: number;
  idadeMin?: number; // Idade mínima
  idadeMax?: number; // Idade máxima
  isVIP?: boolean;
  temAlerta?: boolean;
  renovacaoProxima?: boolean;
}

export function FilterSidebar({ onFilterChange, onClose, isMobile = false }: FilterSidebarProps) {
  const [filters, setFilters] = useState<BeneficiarioFilters>({
    busca: '',
    status: [],
    estado: [],
    cidade: '',
    sexo: [],
    profissao: '',
    valorMin: undefined,
    valorMax: undefined,
  });

  const [expandedSections, setExpandedSections] = useState({
    status: true,
    localizacao: true,
    profissao: true,
    valores: true,
    demografico: true,
    avancado: false,
  });

  // Estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const statusOptions = [
    { value: 'ativo', label: 'Ativo', variant: 'active' as const },
    { value: 'inativo', label: 'Inativo', variant: 'inactive' as const },
    { value: 'pendente', label: 'Pendente', variant: 'pending' as const },
    { value: 'bloqueado', label: 'Bloqueado', variant: 'alert' as const },
  ];

  const sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
  ];

  // Lista de profissões
  const profissoes = [
    'Designer Gráfico',
    'Desenvolvedor Web',
    'Desenvolvedor Mobile',
    'Redator(a)',
    'Copywriter',
    'Fotógrafo',
    'Videomaker',
    'Social Media Manager',
    'Consultor de Marketing',
    'Especialista em SEO',
    'Editor de Vídeo',
    'Ilustrador(a)',
    'UX/UI Designer',
    'Arquiteto de Software',
    'DevOps',
    'Analista de Dados',
    'Product Manager',
    'Gerente de Projetos',
  ].sort();

  const handleFilterChange = (newFilters: Partial<BeneficiarioFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleArrayFilter = (key: keyof BeneficiarioFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange({ [key]: newArray });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    const cleared: BeneficiarioFilters = {
      busca: '',
      status: [],
      estado: [],
      cidade: '',
      sexo: [],
      profissao: '',
      valorMin: undefined,
      valorMax: undefined,
    };
    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const activeFiltersCount = 
    filters.status.length + 
    filters.estado.length + 
    filters.sexo.length + 
    (filters.cidade ? 1 : 0) +
    (filters.profissao ? 1 : 0) +
    (filters.valorMin ? 1 : 0) +
    (filters.valorMax ? 1 : 0) +
    (filters.isVIP ? 1 : 0) +
    (filters.temAlerta ? 1 : 0) +
    (filters.renovacaoProxima ? 1 : 0);

  return (
    <div className={`bg-white dark:bg-gray-800 ${isMobile ? 'h-full' : 'rounded-xl shadow-lg'} flex flex-col border border-gray-100 dark:border-gray-700`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gseed-600 dark:text-gseed-400" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtros</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="info">{activeFiltersCount}</Badge>
            )}
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={filters.busca}
            onChange={(e) => handleFilterChange({ busca: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Botão Limpar Filtros */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full mt-3 py-2 text-sm text-gseed-600 dark:text-gseed-400 hover:bg-gseed-50 dark:hover:bg-gseed-900/20 rounded-lg transition-colors"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {/* Filtros (com scroll) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Status */}
        <div>
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-gray-600 dark:text-gray-400" />
              Status
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.status ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.status && (
            <div className="space-y-2">
              {statusOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(option.value)}
                    onChange={() => toggleArrayFilter('status', option.value)}
                    className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                  />
                  <Badge variant={option.variant}>{option.label}</Badge>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Profissão */}
        <div>
          <button
            onClick={() => toggleSection('profissao')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-gray-600 dark:text-gray-400" />
              Profissão
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.profissao ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.profissao && (
            <div>
              <select
                value={filters.profissao || ''}
                onChange={(e) => handleFilterChange({ profissao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500"
              >
                <option value="" className="dark:bg-gray-700">Todas as profissões</option>
                {profissoes.map(prof => (
                  <option key={prof} value={prof} className="dark:bg-gray-700">
                    {prof}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Localização */}
        <div>
          <button
            onClick={() => toggleSection('localizacao')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
              Localização
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.localizacao ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.localizacao && (
            <div className="space-y-3">
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={filters.estado[0] || ''}
                  onChange={(e) => handleFilterChange({ estado: e.target.value ? [e.target.value] : [] })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500"
                >
                  <option value="" className="dark:bg-gray-700">Todos os estados</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado} className="dark:bg-gray-700">
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome da cidade..."
                  value={filters.cidade}
                  onChange={(e) => handleFilterChange({ cidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Valores */}
        <div>
          <button
            onClick={() => toggleSection('valores')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star size={18} className="text-gray-600 dark:text-gray-400" />
              Faixa de Valores
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.valores ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.valores && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor por Hora
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mínimo (R$)</label>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="10"
                      value={filters.valorMin || ''}
                      onChange={(e) => handleFilterChange({ valorMin: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Máximo (R$)</label>
                    <input
                      type="number"
                      placeholder="1000"
                      min="0"
                      step="10"
                      value={filters.valorMax || ''}
                      onChange={(e) => handleFilterChange({ valorMax: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
                {(filters.valorMin || filters.valorMax) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Mostrando: R$ {filters.valorMin || 0} - R$ {filters.valorMax || '∞'}/hora
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demográfico */}
        <div>
          <button
            onClick={() => toggleSection('demografico')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
              Demográfico
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.demografico ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.demografico && (
            <div className="space-y-3">
              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sexo
                </label>
                <div className="space-y-2">
                  {sexoOptions.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.sexo.includes(option.value)}
                        onChange={() => toggleArrayFilter('sexo', option.value)}
                        className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros Avançados */}
        <div>
          <button
            onClick={() => toggleSection('avancado')}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star size={18} className="text-gray-600 dark:text-gray-400" />
              Avançado
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedSections.avancado ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.avancado && (
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.isVIP || false}
                  onChange={(e) => handleFilterChange({ isVIP: e.target.checked })}
                  className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                />
                <Badge variant="gradient" icon={<Star size={12} />}>
                  VIP
                </Badge>
              </label>

              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.temAlerta || false}
                  onChange={(e) => handleFilterChange({ temAlerta: e.target.checked })}
                  className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Com alertas</span>
              </label>

              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.renovacaoProxima || false}
                  onChange={(e) => handleFilterChange({ renovacaoProxima: e.target.checked })}
                  className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Renovação próxima</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
