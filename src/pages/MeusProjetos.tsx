import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  Briefcase,
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposals_count?: number;
  created_at: string;
}

export default function MeusProjetos() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { label: 'Aberto', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };

    const badge = badges[status as keyof typeof badges] || badges.open;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gseed-100 dark:bg-gseed-900 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-gseed-600 dark:text-gseed-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Meus Projetos
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie todos os seus projetos publicados
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/criar-projeto')}
              className="flex items-center gap-2 px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
            >
              <Plus size={20} />
              Criar Projeto
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar projetos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'open', label: 'Abertos' },
                { value: 'in_progress', label: 'Em Andamento' },
                { value: 'completed', label: 'Concluídos' },
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === filter.value
                      ? 'bg-gseed-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-gseed-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Erro ao carregar projetos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || filterStatus !== 'all'
                ? 'Nenhum projeto encontrado'
                : 'Você ainda não publicou nenhum projeto'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Publique seu primeiro projeto e encontre os profissionais ideais!'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/criar-projeto')}
                className="flex items-center gap-2 px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Criar Primeiro Projeto
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/projetos/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  {project.proposals_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{project.proposals_count} propostas</span>
                    </div>
                  )}
                  
                  {project.budget_min && project.budget_max && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>
                        R$ {project.budget_min.toLocaleString()} - {project.budget_max.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {project.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Prazo: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-500">
                    Criado em {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && projects.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Abertos</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'open').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {projects.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Concluídos</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
