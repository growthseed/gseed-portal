import { useState } from 'react';
import { BeneficiarioCard } from '@/components/beneficiarios/BeneficiarioCard';
import { FilterSidebar, type BeneficiarioFilters } from '@/components/beneficiarios/FilterSidebar';
import { 
  Users, 
  Filter,
  Grid,
  List,
  Download,
  Plus
} from 'lucide-react';

// Dados mockados para demonstração
const beneficiariosMock = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    foto: undefined,
    idade: 34,
    sexo: 'F' as const,
    cpf: '12345678901',
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'ativo' as const,
    isVIP: true,
    renovacaoProxima: false,
    temAlerta: false,
    totalConsultas: 15,
    totalMedicamentos: 3,
    ultimaConsulta: '15/09/2025',
  },
  {
    id: '2',
    nome: 'João Pedro Oliveira',
    foto: undefined,
    idade: 45,
    sexo: 'M' as const,
    cpf: '98765432109',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    status: 'ativo' as const,
    isVIP: false,
    renovacaoProxima: true,
    temAlerta: false,
    totalConsultas: 8,
    totalMedicamentos: 5,
    ultimaConsulta: '20/09/2025',
  },
  {
    id: '3',
    nome: 'Ana Carolina Mendes',
    foto: undefined,
    idade: 28,
    sexo: 'F' as const,
    cpf: '45678912345',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    status: 'pendente' as const,
    isVIP: false,
    renovacaoProxima: false,
    temAlerta: true,
    totalConsultas: 3,
    totalMedicamentos: 1,
    ultimaConsulta: '10/09/2025',
  },
  {
    id: '4',
    nome: 'Carlos Eduardo Costa',
    foto: undefined,
    idade: 52,
    sexo: 'M' as const,
    cpf: '78945612378',
    cidade: 'Brasília',
    estado: 'DF',
    status: 'ativo' as const,
    isVIP: true,
    renovacaoProxima: false,
    temAlerta: false,
    totalConsultas: 22,
    totalMedicamentos: 7,
    ultimaConsulta: '25/09/2025',
  },
  {
    id: '5',
    nome: 'Juliana Fernandes Lima',
    foto: undefined,
    idade: 31,
    sexo: 'F' as const,
    cpf: '15935745689',
    cidade: 'Curitiba',
    estado: 'PR',
    status: 'inativo' as const,
    isVIP: false,
    renovacaoProxima: false,
    temAlerta: false,
    totalConsultas: 5,
    totalMedicamentos: 2,
    ultimaConsulta: '05/08/2025',
  },
  {
    id: '6',
    nome: 'Roberto Alves Pereira',
    foto: undefined,
    idade: 67,
    sexo: 'M' as const,
    cpf: '95175385296',
    cidade: 'Salvador',
    estado: 'BA',
    status: 'ativo' as const,
    isVIP: false,
    renovacaoProxima: true,
    temAlerta: true,
    totalConsultas: 18,
    totalMedicamentos: 9,
    ultimaConsulta: '22/09/2025',
  },
];

export function BeneficiariosPage() {
  const [filters, setFilters] = useState<BeneficiarioFilters>({
    busca: '',
    status: [],
    estado: [],
    cidade: '',
    sexo: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Função para aplicar filtros
  const beneficiariosFiltrados = beneficiariosMock.filter(beneficiario => {
    // Filtro de busca
    if (filters.busca) {
      const searchTerm = filters.busca.toLowerCase();
      const matchNome = beneficiario.nome.toLowerCase().includes(searchTerm);
      const matchCPF = beneficiario.cpf.includes(searchTerm);
      if (!matchNome && !matchCPF) return false;
    }

    // Filtro de status
    if (filters.status.length > 0 && !filters.status.includes(beneficiario.status)) {
      return false;
    }

    // Filtro de estado
    if (filters.estado.length > 0 && !filters.estado.includes(beneficiario.estado)) {
      return false;
    }

    // Filtro de cidade
    if (filters.cidade && !beneficiario.cidade.toLowerCase().includes(filters.cidade.toLowerCase())) {
      return false;
    }

    // Filtro de sexo
    if (filters.sexo.length > 0 && !filters.sexo.includes(beneficiario.sexo)) {
      return false;
    }

    // Filtro de idade
    if (filters.idadeMin && beneficiario.idade < filters.idadeMin) {
      return false;
    }
    if (filters.idadeMax && beneficiario.idade > filters.idadeMax) {
      return false;
    }

    // Filtros avançados
    if (filters.isVIP && !beneficiario.isVIP) {
      return false;
    }
    if (filters.temAlerta && !beneficiario.temAlerta) {
      return false;
    }
    if (filters.renovacaoProxima && !beneficiario.renovacaoProxima) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="text-blue-600" size={36} />
                Beneficiários
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os beneficiários cadastrados no sistema
              </p>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
              <Plus size={20} />
              Novo Beneficiário
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{beneficiariosMock.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {beneficiariosMock.filter(b => b.status === 'ativo').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {beneficiariosMock.filter(b => b.status === 'pendente').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Encontrados</p>
                  <p className="text-2xl font-bold text-purple-600">{beneficiariosFiltrados.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Filter className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                Filtros
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar de Filtros */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-6">
                <FilterSidebar
                  onFilterChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Lista de Beneficiários */}
          <div className="flex-1">
            {beneficiariosFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Users className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum beneficiário encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou realizar uma nova busca
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {beneficiariosFiltrados.map((beneficiario) => (
                  <BeneficiarioCard
                    key={beneficiario.id}
                    {...beneficiario}
                    onClick={() => console.log('Clicou no beneficiário:', beneficiario.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
