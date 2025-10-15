import { 
  DollarSign, 
  Calendar, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  User
} from 'lucide-react';
import { useState } from 'react';
import type { Proposal } from '@/services/proposalService';

interface ProposalCardProps {
  proposal: Proposal & {
    projects?: {
      id: string;
      title: string;
      category: string;
      status: string;
      profiles?: {
        id: string;
        name: string;
        avatar_url?: string;
      };
    };
    profiles?: {
      id: string;
      name: string;
      avatar_url?: string;
    };
    professional_profiles?: {
      id: string;
      title: string;
      skills: string[];
      hourly_rate?: number;
      portfolio_images?: string[];
    };
  };
  viewMode: 'sent' | 'received';
  onView?: () => void;
  onDelete?: () => void;
  onRespond?: () => void;
}

export function ProposalCard({ 
  proposal, 
  viewMode, 
  onView, 
  onDelete,
  onRespond 
}: ProposalCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pendente',
        icon: Clock,
      },
      under_review: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Em Análise',
        icon: Eye,
      },
      accepted: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Aceita',
        icon: CheckCircle2,
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Recusada',
        icon: XCircle,
      },
      withdrawn: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Retirada',
        icon: XCircle,
      },
    };

    const status = badges[proposal.status] || badges.pending;
    const Icon = status.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
        <Icon size={14} />
        {status.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Avatar */}
            {viewMode === 'received' && proposal.profiles ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {proposal.profiles.avatar_url ? (
                  <img 
                    src={proposal.profiles.avatar_url} 
                    alt={proposal.profiles.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            ) : null}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {viewMode === 'sent' 
                  ? proposal.projects?.title 
                  : proposal.profiles?.name || 'Profissional'}
              </h3>
              {viewMode === 'received' && proposal.professional_profiles?.title && (
                <p className="text-sm text-gray-600">
                  {proposal.professional_profiles.title}
                </p>
              )}
              {viewMode === 'sent' && proposal.projects?.category && (
                <p className="text-sm text-gray-600">
                  {proposal.projects.category}
                </p>
              )}
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} className="text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    onView?.();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye size={16} />
                  Ver Detalhes
                </button>
                {viewMode === 'sent' && proposal.status === 'pending' && (
                  <button
                    onClick={() => {
                      onDelete?.();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    Retirar Proposta
                  </button>
                )}
                {viewMode === 'received' && proposal.status === 'pending' && (
                  <button
                    onClick={() => {
                      onRespond?.();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gseed-600 hover:bg-gseed-50 transition-colors"
                  >
                    <MessageSquare size={16} />
                    Responder
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Message Preview */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {proposal.message}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-gray-400" />
          <span className="text-gray-600">Valor:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(Number(proposal.proposed_value))}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-gray-600">Prazo:</span>
          <span className="font-semibold text-gray-900">
            {proposal.proposed_deadline}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Enviada {formatDate(proposal.created_at)}</span>
          {!proposal.is_viewed && viewMode === 'sent' && (
            <span className="inline-flex items-center gap-1 text-yellow-600">
              <Clock size={12} />
              Não visualizada
            </span>
          )}
          {proposal.is_viewed && proposal.viewed_at && viewMode === 'sent' && (
            <span className="inline-flex items-center gap-1 text-blue-600">
              <Eye size={12} />
              Visualizada {formatDate(proposal.viewed_at)}
            </span>
          )}
        </div>

        <button
          onClick={onView}
          className="text-sm font-medium text-gseed-600 hover:text-gseed-700 transition-colors"
        >
          Ver Detalhes →
        </button>
      </div>

      {/* Response Message (if any) */}
      {proposal.response_message && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Resposta do contratante:
          </p>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{proposal.response_message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
