import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Briefcase, 
  Mail, 
  Phone,
  Globe,
  MessageCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { professionalService } from '@/services/professionalService';
import { avaliacaoService } from '@/services/avaliacaoService';
import type { Avaliacao } from '@/services/avaliacaoService';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database.types';
import AvaliacaoForm from '@/components/Avaliacoes/AvaliacaoForm';
import AvaliacaoList from '@/components/Avaliacoes/AvaliacaoList';

export function ProfissionalDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [profissional, setProfissional] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    loadProfissional();
    checkAuth();
    loadAvaliacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (currentUser && id) {
      checkCanReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    setCurrentUser(user);
  };

  const loadAvaliacoes = async () => {
    if (!id) return;
    
    setLoadingReviews(true);
    try {
      const reviews = await avaliacaoService.getAvaliacoesByProfessional(id);
      const rating = await avaliacaoService.getProfessionalRating(id);
      
      setAvaliacoes(reviews);
      setAverageRating(rating.average);
      setTotalAvaliacoes(rating.total);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkCanReview = async () => {
    if (!currentUser || !id) return;
    
    try {
      const hasHired = await avaliacaoService.hasHiredProfessional(currentUser.id, id);
      const hasReviewed = await avaliacaoService.hasAlreadyReviewed(currentUser.id, id);
      
      setCanReview(hasHired && !hasReviewed);
    } catch (error) {
      console.error('Erro ao verificar permissão de avaliação:', error);
    }
  };

  const handleSubmitReview = async (data: { rating: number; comment: string }) => {
    if (!currentUser || !id) return;
    
    try {
      await avaliacaoService.createAvaliacao({
        professional_id: id,
        client_id: currentUser.id,
        rating: data.rating,
        comment: data.comment
      });
      
      setShowReviewForm(false);
      await loadAvaliacoes();
      await checkCanReview();
      
      alert('Avaliação enviada com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar avaliação');
    }
  };

  const loadProfissional = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await professionalService.getById(id);
      
      if (result.success && result.data) {
        setProfissional(result.data);
        
        // Incrementar visualizações
        await professionalService.incrementViews(id);
      } else {
        setError(result.message || 'Profissional não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar profissional');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profissional) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profissional não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/profissionais')}>
            Voltar para Profissionais
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Cover */}
      <div className="bg-gradient-to-r from-gseed-500 to-gseed-600 h-48 relative">
        {profissional.cover_url && (
          <img 
            src={profissional.cover_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 -mt-20 relative">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profissional.avatar_url ? (
                  <img 
                    src={profissional.avatar_url} 
                    alt={profissional.full_name}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white dark:ring-gray-800">
                    {profissional.full_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {profissional.full_name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      {profissional.professional_title || 'Profissional'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {profissional.location_city && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{profissional.location_city}, {profissional.location_state}</span>
                        </div>
                      )}
                      
                      {profissional.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{profissional.rating.toFixed(1)}</span>
                          <span>({profissional.reviews_count || 0} avaliações)</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{profissional.completed_projects || 0} projetos concluídos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="gap-2">
                      <MessageCircle size={20} />
                      Enviar Mensagem
                    </Button>
                    <Button variant="outline" size="lg">
                      Contratar
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profissional.response_time || '< 1h'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tempo de resposta
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profissional.success_rate || 100}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Taxa de sucesso
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(profissional.hourly_rate)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Valor/hora
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="sobre" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="sobre" className="space-y-6">
                {/* Bio */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sobre Mim
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {profissional.bio || 'Nenhuma descrição disponível.'}
                  </p>
                </div>

                {/* Habilidades */}
                {profissional.skills && profissional.skills.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profissional.skills.map((skill, index) => (
                        <Badge key={index}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Serviços */}
                {profissional.services && profissional.services.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Serviços Oferecidos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profissional.services.map((service, index) => (
                        <div 
                          key={index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gseed-500 dark:hover:border-gseed-500 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {service}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                {profissional.portfolio && profissional.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profissional.portfolio.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <img 
                          src={item} 
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhum item no portfólio ainda
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="avaliacoes" className="space-y-4">
                {canReview && !showReviewForm && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <Button 
                      onClick={() => setShowReviewForm(true)}
                      className="w-full"
                    >
                      Avaliar Profissional
                    </Button>
                  </div>
                )}

                {showReviewForm && (
                  <AvaliacaoForm
                    professionalId={id!}
                    onSubmit={handleSubmitReview}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}

                {loadingReviews ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Carregando avaliações...</p>
                  </div>
                ) : (
                  <AvaliacaoList
                    avaliacoes={avaliacoes}
                    averageRating={averageRating}
                    totalAvaliacoes={totalAvaliacoes}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Informações de Contato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações de Contato
              </h3>
              
              <div className="space-y-3">
                {profissional.email && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Mail size={18} className="text-gray-400" />
                    <a href={`mailto:${profissional.email}`} className="hover:text-gseed-600 dark:hover:text-gseed-400">
                      {profissional.email}
                    </a>
                  </div>
                )}
                
                {profissional.phone && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Phone size={18} className="text-gray-400" />
                    {!isAuthenticated ? (
                      <button
                        onClick={() => navigate('/login')}
                        className="text-gseed-600 hover:text-gseed-700 dark:text-gseed-400 dark:hover:text-gseed-300 underline"
                      >
                        Faça login para ver o contato
                      </button>
                    ) : showWhatsApp ? (
                      <a href={`tel:${profissional.phone}`} className="hover:text-gseed-600 dark:hover:text-gseed-400">
                        {profissional.phone}
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowWhatsApp(true)}
                        className="text-gseed-600 hover:text-gseed-700 dark:text-gseed-400 dark:hover:text-gseed-300 underline"
                      >
                        Revelar WhatsApp
                      </button>
                    )}
                  </div>
                )}
                
                {profissional.website && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Globe size={18} className="text-gray-400" />
                    <a 
                      href={profissional.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gseed-600 dark:hover:text-gseed-400 flex items-center gap-1"
                    >
                      Website
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Disponibilidade
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas/semana</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profissional.availability_hours || 'Flexível'}h
                  </span>
                </div>
              </div>
            </div>

            {/* Membro ASDMR */}
            {profissional.is_asdrm_member && (
              <div className="bg-gradient-to-br from-gseed-50 to-gseed-100 dark:from-gseed-900/20 dark:to-gseed-800/20 rounded-lg border-2 border-gseed-500 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gseed-500 flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Membro ASDMR
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Profissional verificado
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfissionalDetalhes;
