import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  Building2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModalEnviarProposta } from '@/components/propostas/ModalEnviarProposta';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/database.types';

export function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [projeto, setProjeto] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProposal, setUserProposal] = useState<any>(null);

  useEffect(() => {
    loadProjeto();
  }, [id]);

  const loadProjeto = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await projectService.getById(id);
      
      if (result.success && result.data) {
        setProjeto(result.data);
        
        // Incrementar visualizações
        await projectService.incrementViews(id);
        
        // Verificar se usuário já enviou proposta
        // TODO: Implementar quando tivermos autenticação
        // const proposalResult = await proposalService.getUserProposal(id, userId);
        // setUserProposal(proposalResult.data);
      } else {
        setError(result.message || 'Projeto não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarProposta = () => {
    setIsModalOpen(true);
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      pending: { 
        label: 'Aguardando', 
        className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
        icon: <Clock size={14} />
      },
      under_review: { 
        label: 'Em Análise', 
        className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
        icon: <AlertCircle size={14} />
      },
      accepted: { 
        label: 'Aceita', 
        className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
        icon: <CheckCircle2 size={14} />
      },
      rejected: { 
        label: 'Rejeitada', 
        className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
        icon: <XCircle size={14} />
      },
      withdrawn: { 
        label: 'Cancelada', 
        className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400',
        icon: <XCircle size={14} />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Não especificado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Projeto não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/projetos')}>
            Voltar para Projetos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="dark:border-gray-600">
                <Eye size={14} className="mr-1" />
                {projeto.views_count || 0} visualizações
              </Badge>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projeto.title}
                  </h1>
                  {projeto.is_urgent && (
                    <Badge variant="destructive">Urgente</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Building2 size={16} />
                    <span>{projeto.client?.company_name || 'Empresa'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{projeto.location_city}, {projeto.location_state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Publicado em {formatDate(projeto.created_at)}</span>
                  </div>
                </div>
              </div>

              {userProposal ? (
                <div className="ml-4">
                  {getStatusBadge(userProposal.status)}
                </div>
              ) : (
                <Button 
                  onClick={handleEnviarProposta}
                  size="lg"
                  className="ml-4"
                >
                  Enviar Proposta
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre o Projeto */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sobre o Projeto
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {projeto.description}
                </p>
              </div>
            </div>

            {/* Requisitos */}
            {projeto.requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Requisitos
                </h2>
                <ul className="space-y-2">
                  {projeto.requirements.split('\n').filter(Boolean).map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Habilidades Necessárias */}
            {projeto.required_skills && projeto.required_skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Habilidades Necessárias
                </h2>
                <div className="flex flex-wrap gap-2">
                  {projeto.required_skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Benefícios */}
            {projeto.benefits && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Benefícios
                </h2>
                <ul className="space-y-2">
                  {projeto.benefits.split('\n').filter(Boolean).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 size={20} className="text-gseed-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Informações do Projeto */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <DollarSign size={18} />
                    <span className="text-sm">Orçamento</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(projeto.budget_min)} - {formatCurrency(projeto.budget_max)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar size={18} />
                    <span className="text-sm">Prazo</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(projeto.deadline)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Clock size={18} />
                    <span className="text-sm">Duração Estimada</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {projeto.estimated_duration || 'A definir'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Users size={18} />
                    <span className="text-sm">Propostas</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {projeto.proposals_count || 0} recebidas
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin size={18} />
                    <span className="text-sm">Modelo de Trabalho</span>
                  </div>
                  <Badge variant="outline" className="dark:border-gray-600">
                    {projeto.work_model === 'remote' ? 'Remoto' : 
                     projeto.work_model === 'onsite' ? 'Presencial' : 'Híbrido'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Sobre a Empresa */}
            {projeto.client && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sobre a Empresa
                </h3>
                
                <div className="flex items-center gap-3 mb-4">
                  {projeto.client.avatar_url ? (
                    <img 
                      src={projeto.client.avatar_url} 
                      alt={projeto.client.company_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center">
                      <Building2 className="text-white" size={24} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {projeto.client.company_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {projeto.client.company_segment}
                    </p>
                  </div>
                </div>

                {projeto.client.company_description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {projeto.client.company_description}
                  </p>
                )}

                <div className="space-y-2">
                  {projeto.client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={16} />
                      <span>{projeto.client.email}</span>
                    </div>
                  )}
                  {projeto.client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={16} />
                      <span>{projeto.client.phone}</span>
                    </div>
                  )}
                  {projeto.client.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Globe size={16} />
                      <a 
                        href={projeto.client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gseed-600 dark:hover:text-gseed-400"
                      >
                        {projeto.client.website}
                      </a>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/profissionais/${projeto.client?.id}`)}
                >
                  Ver Perfil Completo
                </Button>
              </div>
            )}

            {/* CTA Sticky */}
            {!userProposal && (
              <div className="sticky top-24">
                <Button 
                  onClick={handleEnviarProposta}
                  size="lg"
                  className="w-full"
                >
                  Enviar Proposta
                </Button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  Responda em até 24h para aumentar suas chances
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Enviar Proposta */}
      <ModalEnviarProposta
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projeto={projeto}
        onSuccess={() => {
          setIsModalOpen(false);
          loadProjeto(); // Recarregar para atualizar proposta
        }}
      />
    </div>
  );
}

export default ProjetoDetalhes;
