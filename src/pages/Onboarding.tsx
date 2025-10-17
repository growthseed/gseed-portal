import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, Camera, Check, X, Search, User, Briefcase } from 'lucide-react';
import { professionCategories, skillsList, brazilianStates } from '../data/professions';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { useEmailConfirmation } from '../hooks/useEmailConfirmation';

interface OnboardingData {
  tipo: 'profissional' | 'contratante' | null;
  nome: string;
  email: string;
  categoria: string;
  especialidade: string;
  habilidades: string[];
  sobreMim: string;
  avatarUrl: string;
  sexo: 'masculino' | 'feminino' | null;
  estado: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { emailConfirmed, sendConfirmationEmail } = useEmailConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchSkill, setSearchSkill] = useState('');
  
  const [formData, setFormData] = useState<OnboardingData>({
    tipo: null,
    nome: '',
    email: '',
    categoria: '',
    especialidade: '',
    habilidades: [],
    sobreMim: '',
    avatarUrl: '',
    sexo: null,
    estado: ''
  });

  // Buscar dados do usuário autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    };
    getUser();
  }, []);

  // Escolha do tipo (Contratante ou Profissional)
  const handleTipoSelection = (tipo: 'profissional' | 'contratante') => {
    setFormData(prev => ({ ...prev, tipo }));
    setCurrentStep(1);
  };

  // Seleção de categoria
  const handleCategoriaSelection = (categoria: string) => {
    setFormData(prev => ({ ...prev, categoria, especialidade: '' }));
    setCurrentStep(2);
  };

  // Seleção de especialidade
  const handleEspecialidadeSelection = (especialidade: string) => {
    setFormData(prev => ({ ...prev, especialidade }));
    if (formData.tipo === 'profissional') {
      setCurrentStep(3);
    } else {
      setCurrentStep(5); // Pular para perfil se for contratante
    }
  };

  // Adicionar/remover habilidade
  const toggleHabilidade = (habilidade: string) => {
    if (formData.habilidades.includes(habilidade)) {
      setFormData(prev => ({
        ...prev,
        habilidades: prev.habilidades.filter(h => h !== habilidade)
      }));
    } else if (formData.habilidades.length < 10) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, habilidade]
      }));
    } else {
    alert('Você pode selecionar no máximo 10 habilidades');
    }
  };

  // Upload de avatar
  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(file, 'avatars');
      setFormData(prev => ({ ...prev, avatarUrl: url }));
      alert('Foto carregada com sucesso!');
    } catch (error) {
      alert('Erro ao carregar foto');
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar confirmação de email
  const handleSendEmailConfirmation = async () => {
    setIsLoading(true);
    const result = await sendConfirmationEmail(formData.email);
    setIsLoading(false);
    
    if (result.success) {
      alert('Email de confirmação enviado! Verifique sua caixa de entrada.');
    } else {
      alert('Erro ao enviar email de confirmação');
    }
  };

  // Finalizar cadastro
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      // Salvar perfil no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.nome,
          bio: formData.sobreMim,
          avatar_url: formData.avatarUrl,
          state: formData.estado,
          gender: formData.sexo === 'masculino' ? 'male' : 'female',
          is_email_verified: emailConfirmed
        })
        .eq('id', user.id);

      if (!error) {
        // Criar perfil profissional se for o caso
        if (formData.tipo === 'profissional') {
          await supabase.from('professional_profiles').upsert({
            user_id: user.id,
            title: formData.especialidade,
            professional_bio: formData.sobreMim,
            skills: formData.habilidades,
            categories: [formData.categoria]
          });
        }

        alert('Cadastro realizado com sucesso!');
        setCurrentStep(6); // Ir para tela de boas-vindas
      }
    } catch (error) {
      alert('Erro ao salvar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar habilidades pela busca
  const filteredSkills = skillsList.filter(skill =>
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Step 0: Escolha do tipo */}
        {currentStep === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-2">
              Qual o seu objetivo n'O Mercado de Trabalho?
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <button
                onClick={() => handleTipoSelection('contratante')}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600 group-hover:text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Sou contratante, busco por profissionais</h3>
              </button>

              <button
                onClick={() => handleTipoSelection('profissional')}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group relative"
              >
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  ⭐ ASSINANTE
                </span>
                <User className="w-16 h-16 mx-auto mb-4 text-gray-600 group-hover:text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Sou profissional, busco por vagas e projetos</h3>
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Escolha da categoria */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-2">PASSO 1 DE 3</p>
            <h2 className="text-2xl font-bold mb-2">Conta pra gente, com o que você trabalha?</h2>
            <p className="text-gray-600 mb-6">Isso não é definitivo! Você pode editar depois.</p>
            
            <h3 className="font-semibold mb-4">Primeiro, escolha uma categoria</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {Object.keys(professionCategories).map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => handleCategoriaSelection(categoria)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-3xl mb-2">{professionCategories[categoria as keyof typeof professionCategories].icon}</div>
                  <p className="font-medium">{categoria}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(0)}
              className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Voltar
            </button>
          </div>
        )}

        {/* Step 2: Escolha da especialidade */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-2">PASSO 1 DE 3</p>
            <h2 className="text-2xl font-bold mb-2">Conta pra gente, com o que você trabalha?</h2>
            <p className="text-gray-600 mb-6">Isso não é definitivo! Você pode editar depois.</p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Primeiro, escolha uma categoria</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(professionCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData(prev => ({ ...prev, categoria: cat }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.categoria === cat 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="font-semibold mb-4">Agora, escolha sua especialidade</h3>
            
            <div className="space-y-2">
              {professionCategories[formData.categoria as keyof typeof professionCategories]?.specialties.map((esp) => (
                <button
                  key={esp}
                  onClick={() => handleEspecialidadeSelection(esp)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {esp}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setCurrentStep(formData.tipo === 'profissional' ? 3 : 5)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Seleção de habilidades (apenas para profissional) */}
        {currentStep === 3 && formData.tipo === 'profissional' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-2">PASSO 2 DE 3</p>
            <h2 className="text-2xl font-bold mb-2">Quais são suas principais habilidades?</h2>
            <p className="text-gray-600 mb-6">
              Selecione até 10 talentos que representam o seu trabalho. Isso ajudará a conectar você com oportunidades alinhadas ao seu perfil.
            </p>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Selecione os talentos abaixo"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">Máximo de 10 talentos</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {filteredSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleHabilidade(skill)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    formData.habilidades.includes(skill)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-500'
                  } ${formData.habilidades.length >= 10 && !formData.habilidades.includes(skill) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={formData.habilidades.length >= 10 && !formData.habilidades.includes(skill)}
                >
                  {skill} {formData.habilidades.includes(skill) && '+'}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={formData.habilidades.length === 0}
                className={`px-6 py-2 rounded-lg ${
                  formData.habilidades.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 4/5: Completar perfil */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-2">PASSO 3 DE 3</p>
            <h2 className="text-2xl font-bold mb-2">Deixe seu perfil ainda mais completo!</h2>
            <p className="text-gray-600 mb-6">
              Fale um pouco sobre você e adicione uma foto ao seu perfil. 
              Isso ajuda os {formData.tipo === 'profissional' ? 'contratantes' : 'profissionais'} a conhecerem melhor quem é você. 
              Mas sem pressa — você pode preencher depois. 😊
            </p>

            {/* Upload de foto */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Inclua uma foto para fortalecer sua conexão com os {formData.tipo === 'profissional' ? 'profissionais' : 'contratantes'}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-gray-400" size={32} />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Min 400×400px, PNG or JPEG</p>
              </div>
            </div>

            {/* Nome */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nome completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome"
              />
            </div>

            {/* Sexo */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sexo</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, sexo: 'masculino' }))}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.sexo === 'masculino'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  Masculino
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, sexo: 'feminino' }))}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.sexo === 'feminino'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>

            {/* Estado */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione seu estado</option>
                {brazilianStates.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>

            {/* Sobre você */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sobre você (opcional)</label>
              <textarea
                value={formData.sobreMim}
                onChange={(e) => setFormData(prev => ({ ...prev, sobreMim: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Conte um pouco sobre você e a sua história"
                maxLength={2000}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Mínimo de 100 caracteres</span>
                <span>{formData.sobreMim.length}/2000</span>
              </div>
            </div>

            {/* Confirmação de email */}
            {!emailConfirmed && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium mb-2">Confirme seu email para continuar</p>
                <div className="flex items-center gap-4">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    placeholder="seu@email.com"
                  />
                  <button
                    onClick={handleSendEmailConfirmation}
                    disabled={isLoading || !formData.email}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Enviar confirmação
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(formData.tipo === 'profissional' ? 3 : 2)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <button
                onClick={handleFinish}
                disabled={isLoading || !formData.nome || !emailConfirmed}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isLoading || !formData.nome || !emailConfirmed
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Salvando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {/* Tela de boas-vindas */}
        {currentStep === 6 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-8">
              <div className="flex justify-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-500" size={32} />
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Briefcase className="text-gray-500" size={32} />
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  🎯
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  ⚙️
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">
                Boas vindas a'O Mercado de Trabalho!
              </h1>
              <p className="text-gray-600 mb-8">
                Aqui você conecta suas habilidades às oportunidades certas.
                Para começar com o pé direito:
              </p>
            </div>

            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Complete seu perfil</h3>
                  <p className="text-sm text-gray-600">
                    Um perfil completo aumenta suas chances de ser encontrado e mostra todo o seu potencial.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Explore projetos e vagas</h3>
                  <p className="text-sm text-gray-600">
                    Descubra oportunidades alinhadas com sua experiência e interesses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  🎯
                </div>
                <div>
                  <h3 className="font-semibold">Envie propostas</h3>
                  <p className="text-sm text-gray-600">
                    Gostou de algo? Mostre interesse e envie sua proposta!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              Começar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}