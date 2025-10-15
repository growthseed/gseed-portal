import { useEffect, useState } from 'react';
import { validateField, commonRules, ValidationErrors, masks } from '@/lib/validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Briefcase, 
  MapPin, 
  Save,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  Copy,
  Calendar,
  Church,
  Users as UsersIcon,
  CheckCircle
} from 'lucide-react';
import { AvatarUpload, ImageUpload, MultipleImageUpload } from '../components/upload';
import { DatePicker } from '../components/DatePicker';
import { supabase } from '../lib/supabase';
import { professionCategories, brazilianStates } from '../data/professions';
import { CHURCH_STATES, getChurchesByState } from '../constants/churches';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  city?: string;
  state?: string;
  region?: string;
  profession?: string;
  category?: string;
  customProfession?: string; // Profissão personalizada quando seleciona "Outros"
  date_of_birth?: string;
  church?: string;
  is_asdrm_member?: boolean;
  gender?: 'male' | 'female' | null;
  hourly_rate?: number;
  skills?: string[];
  portfolio_images?: string[];
  services?: Service[];
  links?: SocialLink[];
  faqs?: FAQ[];
  is_professional?: boolean;
  is_contractor?: boolean;
  rating?: number;
  total_reviews?: number;
  total_projects?: number;
  member_since?: string;
  whatsapp?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Perfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'professional' | 'portfolio'>('info');
  const [isProfessional, setIsProfessional] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [churchState, setChurchState] = useState<string>('');
  const [availableChurches, setAvailableChurches] = useState<string[]>([]);
  
  // Form states
  const [newService, setNewService] = useState({ title: '', description: '', price: '', delivery_time: '' });
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Buscar dados básicos
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Buscar dados profissionais (pode não existir ainda)
      const { data: professionalData, error: profError } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Ignorar erro se não encontrar (é esperado para novos usuários)
      if (profError && profError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil profissional:', profError);
      }
      
      if (profileData) {
        // Verificar se tem perfil profissional
        const hasProfessionalProfile = !!professionalData;
        setIsProfessional(hasProfessionalProfile);
        
        setProfile({
          id: profileData.id,
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          cover_url: profileData.cover_url,
          city: profileData.city,
          state: profileData.state,
          region: profileData.region,
          profession: professionalData?.title || '',
          customProfession: professionalData?.custom_profession,
          category: professionalData?.categories?.[0] || '',
          date_of_birth: profileData.date_of_birth,
          church: profileData.church,
          is_asdrm_member: profileData.is_asdrm_member || false,
          gender: profileData.gender || null,
          is_professional: hasProfessionalProfile,
          is_contractor: false,
          rating: 4.8,
          total_reviews: 127,
          total_projects: 43,
          member_since: new Date(profileData.created_at).getFullYear().toString(),
          services: [],
          links: [],
          faqs: [],
          skills: professionalData?.skills || [],
          whatsapp: professionalData?.whatsapp || profileData.phone,
          portfolio_images: professionalData?.portfolio_images || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    // Validar campos obrigatórios
    const newErrors: ValidationErrors = {};
    
    // Validações básicas (sempre obrigatórias)
    const nameError = validateField(profile.name, [
      { required: true, message: 'Nome é obrigatório' },
      { minLength: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
    ]);
    if (nameError) newErrors.name = nameError;
    
    // Campos obrigatórios do perfil básico
    if (!profile.date_of_birth) {
      newErrors.date_of_birth = 'Data de nascimento é obrigatória';
    }
    
    if (!profile.church || profile.church.trim() === '') {
      newErrors.church = 'Igreja é obrigatória';
    }
    
    if (!profile.city || profile.city.trim() === '') {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!profile.state || profile.state.trim() === '') {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (!profile.whatsapp || profile.whatsapp.trim() === '') {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else {
      const whatsappError = validateField(profile.whatsapp, [commonRules.phone]);
      if (whatsappError) newErrors.whatsapp = whatsappError;
    }
    
    if (!profile.gender || profile.gender === null) {
      newErrors.gender = 'Gênero é obrigatório';
    }
    
    if (profile.phone) {
      const phoneError = validateField(profile.phone, [commonRules.phone]);
      if (phoneError) newErrors.phone = phoneError;
    }
    
    if (profile.bio && profile.bio.length > 500) {
      newErrors.bio = 'Bio deve ter no máximo 500 caracteres';
    }
    
    // Validações específicas para perfil profissional
    if (isProfessional) {
      if (!profile.category || profile.category.trim() === '') {
        newErrors.category = 'Categoria profissional é obrigatória';
      }
      
      if (!profile.profession || profile.profession.trim() === '') {
        newErrors.profession = 'Profissão é obrigatória';
      }
      
      if (profile.profession === 'Outros' && (!profile.customProfession || profile.customProfession.trim() === '')) {
        newErrors.customProfession = 'Especifique sua profissão';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const errorCount = Object.keys(newErrors).length;
      toast.error(
        errorCount === 1 
          ? Object.values(newErrors)[0] 
          : `Preencha os ${errorCount} campos obrigatórios marcados com *`
      );
      return;
    }
    
    setSaving(true);
    try {
      console.log('🚀 Iniciando salvamento do perfil...');
      console.log('📋 Profile ID:', profile.id);
      
      // Validar UUID
      const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
      };

      if (!isValidUUID(profile.id)) {
        throw new Error('UUID do usuário inválido: ' + profile.id);
      }
      
      // 1. Atualizar dados básicos em profiles
      const profileUpdateData = { 
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        city: profile.city,
        state: profile.state,
        region: profile.region,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        church: profile.church,
        is_asdrm_member: profile.is_asdrm_member,
        gender: profile.gender
      };
      
      console.log('📤 Atualizando tabela profiles:', profileUpdateData);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', profile.id);

      if (profileError) {
        console.error('❌ Erro ao atualizar profiles:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
        throw profileError;
      }
      
      console.log('✅ Tabela profiles atualizada com sucesso');

      // 2. Atualizar ou criar professional_profiles (APENAS se for profissional)
      if (isProfessional) {
        console.log('🔍 Verificando se existe registro em professional_profiles...');
      
      const { data: existingProfessional, error: checkError } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Erro ao verificar professional_profiles:', checkError);
      }
      
      console.log('🔎 Registro existente:', existingProfessional ? 'SIM (id: ' + existingProfessional.id + ')' : 'NÃO');

      // Preparar dados profissionais - remover campos undefined
      const professionalData: Record<string, any> = {
        user_id: profile.id,
        title: profile.profession || '',
        categories: profile.category ? [profile.category] : [],
        skills: profile.skills || [],
        portfolio_images: profile.portfolio_images || []
      };
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (profile.customProfession) {
        professionalData.custom_profession = profile.customProfession;
      }
      if (profile.whatsapp) {
        professionalData.whatsapp = profile.whatsapp;
      }
      
      // Remover undefined
      Object.keys(professionalData).forEach(key => {
        if (professionalData[key] === undefined) {
          delete professionalData[key];
        }
      });
      
      console.log('📤 Dados para professional_profiles:', JSON.stringify(professionalData, null, 2));

      if (existingProfessional) {
        // Atualizar registro existente
        console.log('🔄 Atualizando registro existente...');
        
        const { data: updateData, error: professionalError } = await supabase
          .from('professional_profiles')
          .update(professionalData)
          .eq('user_id', profile.id)
          .select();

        if (professionalError) {
          console.error('❌ Erro COMPLETO ao atualizar professional_profiles:', {
            message: professionalError.message,
            details: professionalError.details,
            hint: professionalError.hint,
            code: professionalError.code,
            dadosEnviados: professionalData
          });
          throw professionalError;
        }
        
        console.log('✅ professional_profiles atualizado:', updateData);
      } else {
        // Criar novo registro
        console.log('➕ Criando novo registro...');
        
        const { data: insertData, error: professionalError } = await supabase
          .from('professional_profiles')
          .insert(professionalData)
          .select();

        if (professionalError) {
          console.error('❌ Erro COMPLETO ao inserir professional_profiles:', {
            message: professionalError.message,
            details: professionalError.details,
            hint: professionalError.hint,
            code: professionalError.code,
            dadosEnviados: professionalData
          });
          throw professionalError;
        }
        
        console.log('✅ professional_profiles criado:', insertData);
      }
    } else {
      console.log('ℹ️ Usuário não é profissional, pulando atualização de professional_profiles');
      
      // Se tinha perfil profissional e desmarcou, deletar
      const { data: existingProf } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();
      
      if (existingProf) {
        console.log('🗑️ Removendo perfil profissional...');
        await supabase
          .from('professional_profiles')
          .delete()
          .eq('user_id', profile.id);
        console.log('✅ Perfil profissional removido');
      }
    }
      
      console.log('🎉 Salvamento concluído com sucesso!');
      setEditing(false);
      setErrors({});
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('💥 Erro ao salvar:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      toast.error('Erro ao salvar alterações: ' + (error?.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (!newService.title || !newService.price) return;
    
    const service: Service = {
      id: Date.now().toString(),
      title: newService.title,
      description: newService.description,
      price: parseFloat(newService.price),
      delivery_time: newService.delivery_time
    };
    
    setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), service] } : null);
    setNewService({ title: '', description: '', price: '', delivery_time: '' });
    setShowAddService(false);
  };

  const removeService = (id: string) => {
    setProfile(prev => prev ? { 
      ...prev, 
      services: prev.services?.filter(s => s.id !== id) 
    } : null);
  };

  const addFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) return;
    
    setProfile(prev => prev ? { 
      ...prev, 
      faqs: [...(prev.faqs || []), newFAQ] 
    } : null);
    setNewFAQ({ question: '', answer: '' });
    setShowAddFAQ(false);
  };

  const copyProfileLink = () => {
    const url = `${window.location.origin}/profissionais/${profile?.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado!');
  };

  // Verificar se o perfil está completo
  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(
      profile.name &&
      profile.date_of_birth &&
      profile.church &&
      profile.city &&
      profile.state &&
      profile.gender &&
      profile.whatsapp &&
      profile.is_asdrm_member !== undefined
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gseed-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {profile.name || 'Usuário'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas informações pessoais e profissionais
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isProfessional && (
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy size={18} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Copiar link</span>
              </button>
            )}
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? (
                'Salvando...'
              ) : editing ? (
                <><Save size={18} /> Salvar</>
              ) : (
                <><Edit3 size={18} /> Editar Perfil</>
              )}
            </button>
          </div>
        </div>

        {/* Alerta de Perfil Incompleto */}
        {!isProfileComplete() && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle className="text-yellow-600 dark:text-yellow-500" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Complete seu perfil</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Preencha todas as informações básicas para ter acesso completo à plataforma.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Card do Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
              {/* Cover */}
              <div className="h-24 relative">
                {profile.cover_url ? (
                  <img src={profile.cover_url} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gseed-500 to-gseed-600" />
                )}
                {editing && (
                  <div className="absolute top-2 right-2">
                    <ImageUpload
                      onUploadComplete={(url) => setProfile({ ...profile, cover_url: url })}
                      currentImageUrl={profile.cover_url}
                      folder="covers"
                      buttonText=""
                      showPreview={false}
                      className="opacity-80 hover:opacity-100"
                    />
                  </div>
                )}
              </div>

              {/* Avatar e Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  {editing ? (
                    <AvatarUpload
                      currentAvatarUrl={profile.avatar_url}
                      userId={profile.id}
                      onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
                      size={96}
                      autoSave={false}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={32} className="text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => {
                        setProfile({ ...profile, name: e.target.value });
                        if (errors.name) setErrors(prev => { const newErrors = {...prev}; delete newErrors.name; return newErrors; });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="Seu nome"
                    />
                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
                    
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria {isProfessional && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={profile.category || ''}
                      onChange={(e) => {
                        setProfile({ ...profile, category: e.target.value });
                        if (errors.category) setErrors(prev => { const newErrors = {...prev}; delete newErrors.category; return newErrors; });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.category ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                    >
                      <option value="" className="dark:bg-gray-700">Selecione uma categoria</option>
                      {Object.keys(professionCategories).map(cat => (
                        <option key={cat} value={cat} className="dark:bg-gray-700">{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category}</p>}

                    {profile.category && (
                      <>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">
                          Profissão {isProfessional && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={profile.profession || ''}
                          onChange={(e) => {
                            setProfile({ ...profile, profession: e.target.value });
                            if (errors.profession) setErrors(prev => { const newErrors = {...prev}; delete newErrors.profession; return newErrors; });
                            // Se não for "Outros", limpa o campo custom
                            if (e.target.value !== 'Outros') {
                              setProfile(prev => ({ ...prev, customProfession: undefined }));
                            }
                          }}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.profession ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                          } dark:bg-gray-700 dark:text-white`}
                        >
                          <option value="" className="dark:bg-gray-700">Selecione uma profissão</option>
                          {professionCategories[profile.category as keyof typeof professionCategories]?.specialties.map(spec => (
                            <option key={spec} value={spec} className="dark:bg-gray-700">{spec}</option>
                          ))}
                        </select>
                        {errors.profession && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.profession}</p>}
                        
                        {/* Campo custom quando selecionar "Outros" */}
                        {profile.profession === 'Outros' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={profile.customProfession || ''}
                              onChange={(e) => {
                                setProfile({ ...profile, customProfession: e.target.value });
                                if (errors.customProfession) setErrors(prev => { const newErrors = {...prev}; delete newErrors.customProfession; return newErrors; });
                              }}
                              placeholder="Digite sua profissão"
                              className={`w-full px-3 py-2 border rounded-lg ${
                                errors.customProfession ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                              } dark:bg-gray-700 dark:text-white`}
                            />
                            {errors.customProfession && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.customProfession}</p>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.profession === 'Outros' && profile.customProfession 
                        ? profile.customProfession 
                        : profile.profession || 'Profissão não definida'
                      }
                    </p>
                  </>
                )}

                {/* Location */}
                <div className="mt-4">
                  {profile.city && profile.state && !editing && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={16} />
                      <span className="text-sm">{profile.city}, {profile.state}</span>
                    </div>
                  )}
                </div>

                {/* Save/Cancel when editing */}
                {editing && (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full px-4 py-2.5 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        loadProfile();
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-gseed-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Informações Básicas
                </button>
                {isProfessional && (
                  <>
                    <button
                      onClick={() => setActiveTab('professional')}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                        activeTab === 'professional'
                          ? 'bg-gseed-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Profissional
                    </button>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                        activeTab === 'portfolio'
                          ? 'bg-gseed-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Portfólio
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info Tab - INFORMAÇÕES BÁSICAS */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Toggle Perfil Profissional */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        ⭐ Ativar Perfil Profissional
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Ative para oferecer seus serviços na plataforma
                      </p>
                    </div>
                    {editing && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isProfessional}
                          onChange={(e) => setIsProfessional(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Completar Perfil */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complete seu Perfil</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Data de Nascimento <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={profile.date_of_birth || ''}
                        onChange={(date) => setProfile({ ...profile, date_of_birth: date })}
                        disabled={!editing}
                      />
                    </div>

                    {/* Igreja que Frequenta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Church size={16} />
                        Igreja que Frequenta <span className="text-red-500">*</span>
                      </label>
                      {editing ? (
                        <div className="space-y-2">
                          <select
                            value={churchState}
                            onChange={(e) => {
                              setChurchState(e.target.value);
                              setAvailableChurches(getChurchesByState(e.target.value));
                              setProfile({ ...profile, church: '' });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                          >
                            <option value="">Selecione o estado</option>
                            {CHURCH_STATES.map(state => (
                              <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                          </select>
                          {churchState && (
                            <select
                              value={profile.church || ''}
                              onChange={(e) => setProfile({ ...profile, church: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                            >
                              <option value="">Selecione a igreja</option>
                              {availableChurches.map(church => (
                                <option key={church} value={church}>{church}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={profile.church || ''}
                          disabled
                          placeholder="Nome da sua igreja"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        Cidade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profile.city || ''}
                        onChange={(e) => {
                          setProfile({ ...profile, city: e.target.value });
                          if (errors.city) setErrors(prev => { const newErrors = {...prev}; delete newErrors.city; return newErrors; });
                        }}
                        disabled={!editing}
                        placeholder="Sua cidade"
                        className={`w-full px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.city ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.city && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.city}</p>}
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado (UF) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={profile.state || ''}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" className="dark:bg-gray-700">Selecione o estado</option>
                        {brazilianStates.map(state => (
                          <option key={state.value} value={state.value} className="dark:bg-gray-700">
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gênero */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gênero <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={profile.gender || ''}
                        onChange={(e) => {
                          setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | null });
                          if (errors.gender) setErrors(prev => { const newErrors = {...prev}; delete newErrors.gender; return newErrors; });
                        }}
                        disabled={!editing}
                        className={`w-full px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.gender ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white`}
                      >
                        <option value="" className="dark:bg-gray-700">Selecione seu gênero</option>
                        <option value="male" className="dark:bg-gray-700">Masculino</option>
                        <option value="female" className="dark:bg-gray-700">Feminino</option>
                      </select>
                      {errors.gender && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.gender}</p>}
                    </div>

                    {/* Membro da ASDMR */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer h-full pt-7">
                        <input
                          type="checkbox"
                          checked={profile.is_asdrm_member || false}
                          onChange={(e) => setProfile({ ...profile, is_asdrm_member: e.target.checked })}
                          disabled={!editing}
                          className="w-5 h-5 text-gseed-600 border-gray-300 rounded focus:ring-gseed-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <UsersIcon size={16} />
                          Sou membro da ASDMR
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sobre mim */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sobre mim</h3>
                  {editing ? (
                    <>
                      <textarea
                        value={profile.bio || ''}
                        onChange={(e) => {
                          setProfile({ ...profile, bio: e.target.value });
                          if (errors.bio) setErrors(prev => { const newErrors = {...prev}; delete newErrors.bio; return newErrors; });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg resize-none ${
                          errors.bio ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white`}
                        rows={4}
                        placeholder="Conte sobre você e sua experiência..."
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          profile.bio && profile.bio.length > 450 ? 'text-orange-600' : 'text-gray-500'
                        }`}>{profile.bio?.length || 0}/500 caracteres</span>
                        {errors.bio && <p className="text-sm text-red-600 dark:text-red-400">{errors.bio}</p>}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.bio || 'Nenhuma descrição adicionada ainda.'}
                    </p>
                  )}
                </div>

                {/* Contato */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações de Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={profile.whatsapp || ''}
                        onChange={(e) => {
                          const masked = masks.phone(e.target.value);
                          setProfile({ ...profile, whatsapp: masked });
                          if (errors.whatsapp) setErrors(prev => { const newErrors = {...prev}; delete newErrors.whatsapp; return newErrors; });
                        }}
                        disabled={!editing}
                        placeholder="(00) 00000-0000"
                        className={`w-full px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.whatsapp ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.whatsapp && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => {
                          const masked = masks.phone(e.target.value);
                          setProfile({ ...profile, phone: masked });
                          if (errors.phone) setErrors(prev => { const newErrors = {...prev}; delete newErrors.phone; return newErrors; });
                        }}
                        disabled={!editing}
                        placeholder="(00) 00000-0000"
                        className={`w-full px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                {/* Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills?.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma habilidade adicionada</p>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Serviços</h3>
                    {editing && (
                      <button
                        onClick={() => setShowAddService(!showAddService)}
                        className="flex items-center gap-2 text-sm text-gseed-600 hover:text-gseed-700 font-medium"
                      >
                        <Plus size={16} />
                        Adicionar serviço
                      </button>
                    )}
                  </div>

                  {showAddService && editing && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newService.title}
                          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                          placeholder="Título do serviço"
                        />
                        <textarea
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm resize-none"
                          rows={3}
                          placeholder="Descrição do serviço"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                            placeholder="Preço (R$)"
                          />
                          <input
                            type="text"
                            value={newService.delivery_time}
                            onChange={(e) => setNewService({ ...newService, delivery_time: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                            placeholder="Prazo de entrega"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addService}
                            className="px-4 py-2 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg text-sm font-medium"
                          >
                            Adicionar
                          </button>
                          <button
                            onClick={() => {
                              setShowAddService(false);
                              setNewService({ title: '', description: '', price: '', delivery_time: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.services && profile.services.length > 0 ? (
                    <div className="space-y-3">
                      {profile.services.map((service) => (
                        <div key={service.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{service.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm font-semibold text-gseed-600">R$ {service.price}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{service.delivery_time}</span>
                              </div>
                            </div>
                            {editing && (
                              <button
                                onClick={() => removeService(service.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                      <p className="text-gray-500 dark:text-gray-400">
                        Você ainda não adicionou nenhum serviço
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfólio</h3>
                  
                  {editing ? (
                    <MultipleImageUpload
                      onUploadComplete={(urls) => setProfile({ ...profile, portfolio_images: urls })}
                      currentImageUrls={profile.portfolio_images}
                      maxImages={10}
                      folder="portfolio"
                    />
                  ) : (
                    profile.portfolio_images && profile.portfolio_images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.portfolio_images.map((img, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Camera className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhuma imagem no portfólio
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Adicione imagens dos seus trabalhos
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">F.A.Q</h3>
                    {editing && (
                      <button
                        onClick={() => setShowAddFAQ(!showAddFAQ)}
                        className="flex items-center gap-2 text-sm text-gseed-600 hover:text-gseed-700 font-medium"
                      >
                        <Plus size={16} />
                        Adicionar pergunta
                      </button>
                    )}
                  </div>

                  {showAddFAQ && editing && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newFAQ.question}
                          onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                          placeholder="Pergunta"
                        />
                        <textarea
                          value={newFAQ.answer}
                          onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm resize-none"
                          rows={3}
                          placeholder="Resposta"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={addFAQ}
                            className="px-4 py-2 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg text-sm font-medium"
                          >
                            Adicionar
                          </button>
                          <button
                            onClick={() => {
                              setShowAddFAQ(false);
                              setNewFAQ({ question: '', answer: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.faqs && profile.faqs.length > 0 ? (
                    <div className="space-y-3">
                      {profile.faqs.map((faq, index) => (
                        <details key={index} className="group">
                          <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                            <ChevronDown className="text-gray-500 group-open:rotate-180 transition-transform" size={20} />
                          </summary>
                          <div className="p-4 text-gray-600 dark:text-gray-400">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Nenhuma pergunta frequente adicionada
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
