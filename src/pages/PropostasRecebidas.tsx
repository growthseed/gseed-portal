import { useState, useEffect } from 'react';
import { 
  Inbox, 
  Filter, 
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { proposalService, type Proposal } from '@/services/proposalService';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { AppHeader } from '@/components/layout/AppHeader';

interface ProjectProposals {
  projectId: string;
  projectTitle: string;
  proposals: Proposal[];
}

type FilterStatus = 'all' | 'pending' | 'under_review' | 'accepted' | 'rejected';

export default function PropostasRecebidas() {
  const [projectsProposals, setProjectsProposals] = useState<ProjectProposals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState<'accepted' | 'rejected' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Get user's projects and load proposals for each
      // For now, using mock data structure
      const mockData: ProjectProposals[] = [];
      
      setProjectsProposals(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const getAllProposals = () => {
    return projectsProposals.flatMap(p => p.proposals);
  };

  const getFilteredProposals = () => {
    let proposals = getAllProposals();

    // Filter by project
    if (selectedProject !== 'all') {
      proposals = proposals.filter(p => p.project_id === selectedProject);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      proposals = proposals.filter(p => p.status === filterStatus);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      proposals = proposals.filter(p =>
        p.profiles?.name?.toLowerCase().includes(query) ||
        p.message.toLowerCase().includes(query) ||
        p.professional_profiles?.title?.toLowerCase().includes(query)
      );
    }

    return proposals;
  };

  const getStatusCount = (status: FilterStatus) => {
    const proposals = getAllProposals();
    if (status === 'all') return proposals.length;
    return proposals.filter(p => p.status === status).length;
  };

  const handleRespond = (proposal: Proposal, type: 'accepted' | 'rejected') => {
    setSelectedProposal(proposal);
    setResponseType(type);
    setResponseMessage('');
    setShowRespondModal(true);
  };

  const submitResponse = async () => {
    if (!selectedProposal || !responseType) return;

    try {
      setIsSubmitting(true);
      await proposalService.updateProposalStatus(
        selectedProposal.id,
        responseType,
        responseMessage
      );
      
      setShowRespondModal(false);
      await loadProposals();
    } catch (err) {
      alert('Erro ao responder proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProposals = getFilteredProposals();

  const filters: { value: FilterStatus; label: string; color: string }[] = [
    { value: 'all', label: 'Todas', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pendentes', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'under_review', label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
    { value: 'accepted', label: 'Aceitas', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Recusadas', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Inbox size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Propostas Recebidas
              </h1>
              <p className="text-gray-600">
                Gerencie as propostas enviadas para seus projetos
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por profissional ou proposta..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Project Filter */}
            {projectsProposals.length > 1 && (
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
              >
                <option value="all">Todos os Projetos</option>
                {projectsProposals.map(project => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectTitle} ({project.proposals.length})
                  </option>
                ))}
              </select>
            )}

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === filter.value
                      ? filter.color + ' shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
              {getAllProposals().length === 0
                ? 'Nenhuma proposta recebida ainda'
                : 'Nenhuma proposta encontrada'}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {getAllProposals().length === 0
                ? 'Quando profissionais enviarem propostas para seus projetos, elas aparecerão aqui.'
                : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                viewMode="received"
                onView={() => {
                  // TODO: Navigate to proposal details
                  console.log('View proposal:', proposal.id);
                }}
                onRespond={() => handleRespond(proposal, 'accepted')}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && getAllProposals().length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Propostas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAllProposals().length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {getStatusCount('pending')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {getStatusCount('accepted')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Projetos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectsProposals.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Response Modal */}
      {showRespondModal && selectedProposal && responseType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                {responseType === 'accepted' ? (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle size={20} className="text-red-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">
                  {responseType === 'accepted' ? 'Aceitar Proposta' : 'Recusar Proposta'}
                </h3>
              </div>
              <p className="text-gray-600">
                Profissional: {selectedProposal.profiles?.name}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mensagem {responseType === 'accepted' ? '(opcional)' : '*'}
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                required={responseType === 'rejected'}
                rows={6}
                placeholder={
                  responseType === 'accepted'
                    ? 'Escreva uma mensagem para o profissional...'
                    : 'Explique o motivo da recusa de forma educada...'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRespondModal(false)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitResponse}
                disabled={isSubmitting || (responseType === 'rejected' && !responseMessage)}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  responseType === 'accepted'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    {responseType === 'accepted' ? (
                      <>
                        <CheckCircle2 size={20} />
                        Aceitar Proposta
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        Recusar Proposta
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
