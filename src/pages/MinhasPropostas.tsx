import { useState, useEffect } from 'react';
import { 
  Send, 
  Filter, 
  Search,
  Inbox,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { proposalService, type Proposal } from '@/services/proposalService';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { AppHeader } from '@/components/layout/AppHeader';

type FilterStatus = 'all' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';

export default function MinhasPropostas() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [proposals, filterStatus, searchQuery]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proposalService.getUserProposals();
      setProposals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = proposals;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.projects?.title?.toLowerCase().includes(query) ||
        p.message.toLowerCase().includes(query)
      );
    }

    setFilteredProposals(filtered);
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return proposals.length;
    return proposals.filter(p => p.status === status).length;
  };

  const handleWithdraw = async (proposalId: string) => {
    if (!confirm('Tem certeza que deseja retirar esta proposta?')) return;

    try {
      await proposalService.withdrawProposal(proposalId);
      await loadProposals();
    } catch (err) {
      alert('Erro ao retirar proposta');
    }
  };

  const filters: { value: FilterStatus; label: string; color: string }[] = [
    { value: 'all', label: 'Todas', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pendentes', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'under_review', label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
    { value: 'accepted', label: 'Aceitas', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Recusadas', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gseed-100 rounded-xl flex items-center justify-center">
              <Send size={24} className="text-gseed-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Minhas Propostas
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe o status de todas as suas propostas enviadas
              </p>
            </div>
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
                  placeholder="Buscar por projeto..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === filter.value
                  ? filter.color + ' shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label} ({getStatusCount(filter.value)})
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
              Erro ao carregar propostas
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadProposals}
              className="px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus !== 'all' || searchQuery
                ? 'Nenhuma proposta encontrada'
                : 'Você ainda não enviou nenhuma proposta'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              {filterStatus !== 'all' || searchQuery
                ? 'Tente ajustar os filtros de busca'
                : 'Explore os projetos disponíveis e envie sua primeira proposta!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                viewMode="sent"
                onView={() => {
                  // TODO: Navigate to proposal details
                  console.log('View proposal:', proposal.id);
                }}
                onDelete={() => handleWithdraw(proposal.id)}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && filteredProposals.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Propostas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proposals.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getStatusCount('pending')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {getStatusCount('accepted')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa de Aceitação</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proposals.length > 0 
                    ? Math.round((getStatusCount('accepted') / proposals.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
