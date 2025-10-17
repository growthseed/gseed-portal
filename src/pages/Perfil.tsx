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
  CheckCircle,
  Star,
  Image as ImageIcon,
  Award,
  Loader2
} from 'lucide-react';
import { ImageUpload, MultipleImageUpload } from '../components/upload';
import { supabase } from '../lib/supabase';
import { professionCategories, brazilianStates } from '../data/professions';
import { CHURCH_STATES, getChurchesByState } from '../constants/churches';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setYear(y);
      setMonth(m);
      setDay(d);
    }
  }, [value]);

  const handleChange = (newDay: string, newMonth: string, newYear: string) => {
    if (newDay && newMonth && newYear) {
      onChange(`${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 75 }, (_, i) => currentYear - 18 - i);

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        value={day}
        onChange={(e) => {
          setDay(e.target.value);
          handleChange(e.target.value, month, year);
        }}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
      >
        <option value="">Dia</option>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <select
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
          handleChange(day, e.target.value, year);
        }}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
      >
        <option value="">Mês</option>
        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>

      <select
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
          handleChange(day, month, e.target.value);
        }}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
      >
        <option value="">Ano</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

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
  customProfession?: string;
  date_of_birth?: string;
  church?: string;
  is_asdrm_member?: boolean;
  gender?: 'male' | 'female' | null;
  skills?: string[];
  portfolio_images?: string[];
  whatsapp?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
}

export default function Perfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [churchState, setChurchState] = useState<string>('');
  const [availableChurches, setAvailableChurches] = useState<string[]>([]);
  const [isProfessional, setIsProfessional] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'professional' | 'portfolio'>('info');
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (churchState) {
      setAvailableChurches(getChurchesByState(churchState));
    }
  }, [churchState]);

  // Inicializar churchState quando o perfil carregar
  useEffect(() => {
    if (profile?.state && !churchState) {
      setChurchState(profile.state);
      setAvailableChurches(getChurchesByState(profile.state));
    }
  }, [profile?.state]);

  const loadProfile = async () => {
    try {
      console.log('📥 Carregando perfil...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: professionalData } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('✅ Perfil carregado:', { profileData, professionalData });
      
      if (profileData) {
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
          skills: professionalData?.skills || [],
          whatsapp: professionalData?.whatsapp || profileData.phone,
          portfolio_images: professionalData?.portfolio_images || []
        });

        // Carregar serviços se for profissional
        if (hasProfessionalProfile) {
          const { data: servicesData } = await supabase
            .from('professional_services')
            .select('*')
            .eq('professional_id', user.id);
          
          if (servicesData) {
            setServices(servicesData);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Campos sempre obrigatórios
    if (!profile?.name?.trim()) newErrors.name = 'Nome é obrigatório';
    if (!profile?.date_of_birth) newErrors.date_of_birth = 'Data de nascimento é obrigatória';
    if (!profile?.church) newErrors.church = 'Igreja é obrigatória';
    if (!profile?.city?.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!profile?.state) newErrors.state = 'Estado é obrigatório';
    if (!profile?.gender) newErrors.gender = 'Gênero é obrigatório';
    if (!profile?.whatsapp?.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório';
    
    // Campos obrigatórios SE for profissional
    if (isProfessional) {
      if (!profile?.category) newErrors.category = 'Categoria profissional é obrigatória';
      if (!profile?.profession) newErrors.profession = 'Profissão é obrigatória';
      if (profile?.profession === 'Outros' && !profile?.customProfession?.trim()) {
        newErrors.customProfession = 'Especifique sua profissão';
      }
    }
    
    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      setErrors(newErrors);
      toast.error(`Preencha os ${errorCount} campos obrigatórios marcados com *`);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!profile) return;
    
    console.log('🚀 Iniciando salvamento do perfil...');
    console.log('👤 É profissional?', isProfessional);
    
    if (!validateProfile()) {
      return;
    }
    
    setSaving(true);
    try {
      console.log('📤 Atualizando tabela profiles...');
      
      const profileUpdate = {
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

      console.log('📋 Dados para profiles:', profileUpdate);

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', profile.id);

      if (profileError) {
        console.error('❌ Erro ao atualizar profiles:', profileError);
        throw profileError;
      }

      console.log('✅ Tabela profiles atualizada');

      // Gerenciar perfil profissional
      if (isProfessional) {
        console.log('🔍 Verificando perfil profissional...');
        
        const { data: existingProf } = await supabase
          .from('professional_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .maybeSingle();

        const profData = {
          user_id: profile.id,
          title: profile.profession || '',
          categories: profile.category ? [profile.category] : [],
          skills: profile.skills || [],
          portfolio_images: profile.portfolio_images || [],
          custom_profession: profile.profession === 'Outros' ? profile.customProfession : null,
          whatsapp: profile.whatsapp
        };

        console.log('📤 Dados para professional_profiles:', profData);

        if (existingProf) {
          console.log('🔄 Atualizando perfil profissional existente...');
          const { error } = await supabase
            .from('professional_profiles')
            .update(profData)
            .eq('user_id', profile.id);
          
          if (error) {
            console.error('❌ Erro ao atualizar professional_profiles:', error);
            throw error;
          }
        } else {
          console.log('➕ Criando novo perfil profissional...');
          const { error } = await supabase
            .from('professional_profiles')
            .insert(profData);
          
          if (error) {
            console.error('❌ Erro ao criar professional_profiles:', error);
            throw error;
          }
        }
        
        console.log('✅ professional_profiles atualizado');
      } else {
        // Se desativou o perfil profissional, remover dados
        console.log('🗑️ Removendo perfil profissional...');
        await supabase
          .from('professional_profiles')
          .delete()
          .eq('user_id', profile.id);
      }
      
      setEditing(false);
      setErrors({});
      toast.success('Perfil atualizado com sucesso!');
      console.log('🎉 Salvamento concluído!');
    } catch (error: any) {
      console.error('❌ Erro ao salvar:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      toast.error('Erro ao salvar: ' + (error?.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const copyProfileLink = () => {
    const link = `${window.location.origin}/profissionais/${profile?.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validações
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setProfile({ ...profile!, avatar_url: publicUrl });
      toast.success('Avatar atualizado!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addService = async () => {
    if (!newService.title || !newService.description || !newService.price) {
      toast.error('Preencha todos os campos do serviço');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('professional_services')
        .insert({
          professional_id: profile?.id,
          title: newService.title,
          description: newService.description,
          price: newService.price
        })
        .select()
        .single();

      if (error) throw error;

      setServices([...services, data]);
      setNewService({ title: '', description: '', price: '' });
      toast.success('Serviço adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast.error('Erro ao adicionar serviço');
    }
  };

  const removeService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('professional_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Serviço removido!');
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      toast.error('Erro ao remover serviço');
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
            <div className="flex gap-2">
              {isProfessional && (
                <button
                  onClick={copyProfileLink}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Copy size={16} />
                  Copiar Link
                </button>
              )}
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gseed-500 text-white rounded-lg hover:bg-gseed-600"
                >
                  <Edit3 size={16} />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gseed-500 text-white rounded-lg hover:bg-gseed-600 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {editing ? (
                <label className="cursor-pointer block group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                  
                  <div className="relative w-32 h-32">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name} 
                        className="w-32 h-32 rounded-full object-cover border-3 border-gray-200 dark:border-gray-700 group-hover:border-gseed-500 transition-colors" 
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-gseed-400 to-gseed-600 rounded-full flex items-center justify-center border-3 border-gray-200 dark:border-gray-700 group-hover:border-gseed-500 transition-colors">
                        <span className="text-white text-4xl font-semibold">
                          {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={24} />
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                    <Camera size={12} />
                    Clique para alterar
                  </p>
                </label>
              ) : (
                <>
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name} 
                      className="w-32 h-32 rounded-full object-cover border-3 border-gray-200 dark:border-gray-700" 
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-gseed-400 to-gseed-600 rounded-full flex items-center justify-center border-3 border-gray-200 dark:border-gray-700">
                      <span className="text-white text-4xl font-semibold">
                        {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              {isProfessional && profile.profession && (
                <p className="text-gseed-600 font-medium mt-1">{profile.profession}</p>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Perfil Profissional */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Star className="text-gseed-500" size={20} />
                  Ativar Perfil Profissional
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Ative para oferecer seus serviços e aparecer na busca de profissionais
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isProfessional}
                  onChange={(e) => {
                    setIsProfessional(e.target.checked);
                    if (!e.target.checked) {
                      setActiveTab('info');
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 mb-6">
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

        {/* Tab: Informações Básicas */}
        {activeTab === 'info' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border ${
                    errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Data Nascimento */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar size={16} />
                  Data de Nascimento <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={profile.date_of_birth}
                  onChange={(date) => setProfile({ ...profile, date_of_birth: date })}
                  disabled={!editing}
                />
                {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                  <UsersIcon size={16} />
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' })}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border ${
                    errors.gender ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              {/* Estado + Cidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin size={16} />
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={profile.state || ''}
                    onChange={(e) => {
                      setProfile({ ...profile, state: e.target.value, city: '', church: '' });
                      setChurchState(e.target.value);
                    }}
                    disabled={!editing}
                    className={`w-full px-4 py-2 border ${
                      errors.state ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                  >
                    <option value="">Selecione</option>
                    {brazilianStates.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    disabled={!editing}
                    placeholder="Digite sua cidade"
                    className={`w-full px-4 py-2 border ${
                      errors.city ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Igreja */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                  <Church size={16} />
                  Igreja que Frequenta <span className="text-red-500">*</span>
                </label>
                {!churchState && editing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Selecione o estado primeiro para ver as igrejas disponíveis
                  </p>
                )}
                <select
                  value={profile.church || ''}
                  onChange={(e) => setProfile({ ...profile, church: e.target.value })}
                  disabled={!editing || !churchState}
                  className={`w-full px-4 py-2 border ${
                    errors.church ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                >
                  <option value="">Selecione</option>
                  {availableChurches.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.church && <p className="text-red-500 text-sm mt-1">{errors.church}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={profile.whatsapp || ''}
                  onChange={(e) => setProfile({ ...profile, whatsapp: masks.phone(e.target.value) })}
                  disabled={!editing}
                  placeholder="(00) 00000-0000"
                  className={`w-full px-4 py-2 border ${
                    errors.whatsapp ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
              </div>

              {/* Membro ASDRM - Campo interno, não obrigatório */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.is_asdrm_member}
                  onChange={(e) => setProfile({ ...profile, is_asdrm_member: e.target.checked })}
                  disabled={!editing}
                  className="w-4 h-4 text-gseed-600 rounded"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Sou membro da ASDMR</label>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Sobre mim
                </label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!editing}
                  rows={4}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab: Profissional */}
        {activeTab === 'professional' && isProfessional && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={16} />
                  Categoria Profissional {isProfessional && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={profile.category || ''}
                  onChange={(e) => {
                    setProfile({ ...profile, category: e.target.value, profession: '' });
                  }}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border ${
                    errors.category ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                >
                  <option value="">Selecione</option>
                  {professionCategories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Profissão */}
              {profile.category && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                    Profissão {isProfessional && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={profile.profession || ''}
                    onChange={(e) => setProfile({ ...profile, profession: e.target.value, customProfession: '' })}
                    disabled={!editing}
                    className={`w-full px-4 py-2 border ${
                      errors.profession ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                  >
                    <option value="">Selecione</option>
                    {professionCategories
                      .find(c => c.name === profile.category)
                      ?.professions.map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                  </select>
                  {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
                </div>
              )}

              {/* Profissão Customizada */}
              {profile.profession === 'Outros' && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                    Especifique sua Profissão {isProfessional && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={profile.customProfession || ''}
                    onChange={(e) => setProfile({ ...profile, customProfession: e.target.value })}
                    disabled={!editing}
                    placeholder="Digite sua profissão"
                    className={`w-full px-4 py-2 border ${
                      errors.customProfession ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50`}
                  />
                  {errors.customProfession && <p className="text-red-500 text-sm mt-1">{errors.customProfession}</p>}
                </div>
              )}

              {/* Serviços */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award size={18} />
                    Meus Serviços
                  </h3>
                </div>

                {services.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {services.map(service => (
                      <div key={service.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{service.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                            <p className="text-gseed-600 font-medium mt-2">{service.price}</p>
                          </div>
                          {editing && (
                            <button
                              onClick={() => removeService(service.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editing && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                      type="text"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="Título do serviço"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    />
                    <textarea
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Descrição do serviço"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="R$ 0,00"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      />
                      <button
                        onClick={addService}
                        className="px-4 py-2 bg-gseed-500 text-white rounded-lg hover:bg-gseed-600 flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab: Portfólio */}
        {activeTab === 'portfolio' && isProfessional && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon size={18} />
              Galeria de Trabalhos
            </h3>
            
            {editing ? (
              <MultipleImageUpload
                currentImages={profile.portfolio_images || []}
                onUploadComplete={(urls) => setProfile({ ...profile, portfolio_images: urls })}
                maxImages={10}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio_images && profile.portfolio_images.length > 0 ? (
                  profile.portfolio_images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Trabalho ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhuma imagem adicionada ainda
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
