import { 
  X, 
  DollarSign, 
  Calendar, 
  User, 
  MapPin,
  Star,
  Briefcase,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
  Download
} from 'lucide-react';
import type { Proposal } from '@/services/proposalService';

interface ProposalDetailsModalProps {
  proposal: Proposal & {
    projects?: {
      id: string;
      title: string;
      category: string;
      description: string;
      status: string;
      profiles?: {
        id: string;
        name: string;
        avatar_url?: string;
        city?: string;
        state?: string;
      };
    };
    profiles?: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
      city?: string;
      state?: string;
    };
    professional_profiles?: {
      id: string;
      title: string;
      professional_bio?: string;
      skills: string[];
      hourly_rate?: number;
      portfolio_images?: string[];
      years_of_experience?: number;
    };
  };
  viewMode: 'sent' | 'received';
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onWithdraw?: () => void;
}

export function ProposalDetailsModal({
  proposal,
  viewMode,
  onClose,
  onAccept,
  onReject,
  onWithdraw,
}: ProposalDetailsModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Análise' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aceita' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Recusada' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Retirada' },
    };
    return badges[proposal.status] || badges.pending;
  };

  const statusBadge = getStatusBadge();
  const professional = proposal.profiles;
  const professionalProfile = proposal.professional_profiles;
  const project = proposal.projects;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Detalhes da Proposta
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Professional/Client Info */}
          {viewMode === 'received' && professional && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações do Profissional
              </h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {professional.avatar_url ? (
                    <img 
                      src={professional.avatar_url} 
                      alt={professional.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {professional.name}
                  </h4>
                  {professionalProfile?.title && (
                    <p className="text-gray-600 mb-2">{professionalProfile.title}</p>
                  )}
                  {(professional.city || professional.state) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} />
                      <span>{professional.city}, {professional.state}</span>
                    </div>
                  )}
                </div>
              </div>

              {professionalProfile && (
                <>
                  {professionalProfile.professional_bio && (
                    <div className="mb-4">
                      <p className="text-gray-700">{professionalProfile.professional_bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {professionalProfile.years_of_experience !== undefined && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {professionalProfile.years_of_experience} anos de experiência
                        </span>
                      </div>
                    )}
                    {professionalProfile.hourly_rate && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(Number(professionalProfile.hourly_rate))}/hora
                        </span>
                      </div>
                    )}
                  </div>

                  {professionalProfile.skills && professionalProfile.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Habilidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {professionalProfile.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gseed-100 text-gseed-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Project Info (for sent view) */}
          {viewMode === 'sent' && project && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações do Projeto
              </h3>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {project.title}
              </h4>
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium mb-3">
                {project.category}
              </span>
              {project.description && (
                <p className="text-gray-700">{project.description}</p>
              )}
            </div>
          )}

          {/* Proposal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proposta
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarSign size={20} />
                  <span className="text-sm font-medium">Valor Proposto</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(Number(proposal.proposed_value))}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar size={20} />
                  <span className="text-sm font-medium">Prazo de Entrega</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {proposal.proposed_deadline}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Mensagem:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{proposal.message}</p>
            </div>
          </div>

          {/* Response (if any) */}
          {proposal.response_message && (
            <div className={`rounded-lg p-6 ${
              proposal.status === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {proposal.status === 'accepted' ? (
                  <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle size={24} className="text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${
                    proposal.status === 'accepted' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    Resposta do {viewMode === 'sent' ? 'Contratante' : 'Você'}:
                  </h4>
                  <p className={`${
                    proposal.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {proposal.response_message}
                  </p>
                  {proposal.responded_at && (
                    <p className={`text-sm mt-2 ${
                      proposal.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Respondido em {formatDate(proposal.responded_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Enviada em:</span>
                <p className="text-gray-900">{formatDate(proposal.created_at)}</p>
              </div>
              {proposal.viewed_at && (
                <div>
                  <span className="font-medium">Visualizada em:</span>
                  <p className="text-gray-900">{formatDate(proposal.viewed_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          {viewMode === 'received' && proposal.status === 'pending' && (
            <>
              <button
                onClick={onReject}
                className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                <XCircle size={20} />
                Recusar
              </button>
              <button
                onClick={onAccept}
                className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle2 size={20} />
                Aceitar Proposta
              </button>
            </>
          )}

          {viewMode === 'sent' && proposal.status === 'pending' && (
            <button
              onClick={onWithdraw}
              className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              <XCircle size={20} />
              Retirar Proposta
            </button>
          )}

          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
