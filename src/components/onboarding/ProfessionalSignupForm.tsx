import { useState } from 'react';
import { professionalService } from '@/services';
import { supabase } from '@/lib/supabase';
import { 
  Palette, 
  Code, 
  TrendingUp, 
  FileText, 
  Monitor, 
  Scale,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Loader2
} from 'lucide-react';
import { AvatarUpload, MultipleImageUpload } from '@/components/upload';

interface ProfessionalSignupFormProps {
  onComplete: (data: ProfessionalData) => void;
  onBack: () => void;
}

export interface ProfessionalData {
  categoria: string;
  especialidade: string;
  habilidades: string[];
  sobreMim?: string;
  avatarUrl?: string;
  portfolioImages?: string[];
}

const categorias = [
  {
    id: 'design',
    nome: 'Design e Criativos',
    icon: Palette,
    especialidades: [
      'Designer Gráfico',
      'Designer de UI/UX',
      'Designer de Produto',
      'Ilustrador(a)',
      'Motion Designer',
      'Editor de Vídeo',
      'Fotógrafo',
      'Animador(a) 3D',
    ],
  },
  {
    id: 'tech',
    nome: 'Programação e Tecnologia',
    icon: Code,
    especialidades: [
      'Programador(a)',
      'Desenvolvedor Web',
      'Desenvolvedor Mobile',
      'Dados & Analytics',
      'IA para Programação e Tecnologia',
      'DevOps',
      'QA/Tester',
      'Gerente de Projetos',
    ],
  },
  {
    id: 'marketing',
    nome: 'Marketing e Vendas',
    icon: TrendingUp,
    especialidades: [
      'Gestor(a) de tráfego',
      'Marketing Digital',
      'Vendas',
      'Consultor(a)',
      'Coprodutor | Gestor de Marketing Digital',
      'Social Media',
      'SEO Specialist',
      'Growth Hacker',
    ],
  },
  {
    id: 'content',
    nome: 'Conteúdo e Tradução',
    icon: FileText,
    especialidades: [
      'Copywriter',
      'Redator(a)',
      'Tradutor(a)',
      'Revisor(a)',
      'Roteirista',
      'Produtor de Conteúdo',
    ],
  },
  {
    id: 'admin',
    nome: 'Assistência Administrativa',
    icon: Monitor,
    especialidades: [
      'Suporte',
      'Assistente Virtual',
      'BPO Financeiro',
      'Atendimento ao Cliente',
      'Secretariado',
    ],
  },
  {
    id: 'juridico',
    nome: 'Jurídico',
    icon: Scale,
    especialidades: [
      'Advogado(a)',
      'Contador(a)',
      'Consultor Jurídico',
      'Analista Fiscal',
    ],
  },
];

const habilidadesPorEspecialidade: Record<string, string[]> = {
  'Designer Gráfico': ['Photoshop', 'Illustrator', 'InDesign', 'CorelDRAW', 'Figma', 'Identidade Visual', 'Branding', 'Design Editorial', 'Tipografia', 'Ilustração', 'Canva', 'Logo Design', 'Design de Embalagens'],
  'Designer de UI/UX': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframes', 'User Research', 'Interface Design', 'Design System', 'Usabilidade'],
  'Designer de Produto': ['Figma', 'Sketch', 'Product Design', 'User Flow', 'MVP Design', 'Design Thinking', 'Prototipagem', 'Design Sprint'],
  'Ilustrador(a)': ['Ilustração Digital', 'Procreate', 'Photoshop', 'Illustrator', 'Desenho à mão', 'Character Design', 'Arte Vetorial'],
  'Motion Designer': ['After Effects', 'Premiere Pro', 'Motion Graphics', 'Animação 2D', 'Cinema 4D', 'Animation', 'Video Editing'],
  'Editor de Vídeo': ['Premiere Pro', 'After Effects', 'Final Cut', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading', 'Edição', 'CapCut'],
  'Fotógrafo': ['Fotografia de eventos', 'Fotografia de produtos', 'Edição', 'Lightroom', 'Photoshop', 'Iluminação', 'Retratos', 'Fotografia Social'],
  'Animador(a) 3D': ['Blender', 'Maya', 'Cinema 4D', '3D Modeling', 'Animação 3D', 'Rendering', 'Texturização'],
  'Programador(a)': ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript', 'Git', 'APIs', 'PHP', 'C#', 'SQL'],
  'Desenvolvedor Web': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Next.js', 'WordPress', 'Responsive Design', 'SEO', 'Tailwind CSS'],
  'Desenvolvedor Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile UI', 'App Development'],
  'Dados & Analytics': ['SQL', 'Python', 'Power BI', 'Excel', 'Google Analytics', 'Data Analysis', 'Tableau', 'Business Intelligence'],
  'IA para Programação e Tecnologia': ['ChatGPT', 'Prompt Engineering', 'Python', 'Machine Learning', 'AI Integration', 'Automação', 'APIs'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Git', 'Terraform', 'Monitoring'],
  'QA/Tester': ['Testes Manuais', 'Testes Automatizados', 'Selenium', 'Cypress', 'Quality Assurance', 'Bug Testing', 'Test Cases'],
  'Gerente de Projetos': ['Scrum', 'Agile', 'Jira', 'Gestão de Equipes', 'Planning', 'Roadmap', 'Kanban', 'Product Management'],
  'Gestor(a) de tráfego': ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'TikTok Ads', 'Analytics', 'Funil de Vendas', 'Copywriting', 'ROI', 'Pixel', 'Google Tag Manager', 'Remarketing'],
  'Marketing Digital': ['E-mail marketing', 'Funil', 'SEO', 'Estratégia de lançamento', 'Estratégia de branding', 'Consultoria', 'Growth', 'Marketing de Conteúdo', 'Automação', 'CRM', 'Inbound Marketing'],
  'Vendas': ['Prospecção', 'Fechamento', 'Negociação', 'CRM', 'Inside Sales', 'Vendas B2B', 'Vendas B2C', 'Outbound', 'Consultoria de Vendas'],
  'Consultor(a)': ['Consultoria Estratégica', 'Business Intelligence', 'Diagnóstico', 'Planejamento', 'Análise de Mercado', 'Mentoria'],
  'Coprodutor | Gestor de Marketing Digital': ['Lançamentos', 'Gestão de Campanhas', 'Funis', 'E-mail Marketing', 'Tráfego Pago', 'Copywriting', 'Estratégia Digital', 'KPIs'],
  'Social Media': ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Twitter', 'Canva', 'Planejamento de conteúdo', 'Análise de métricas', 'Reels', 'Stories', 'Community Management'],
  'SEO Specialist': ['SEO', 'Google Search Console', 'Keywords', 'Link Building', 'SEO Técnico', 'SEO On-page', 'Analytics', 'Otimização'],
  'Growth Hacker': ['Growth', 'Análise de Dados', 'Testes A/B', 'Métricas', 'Funis', 'Automação', 'Product-Led Growth', 'Conversão'],
  'Copywriter': ['Copy de vendas', 'Headlines', 'Storytelling', 'E-mail marketing', 'Landing pages', 'VSL', 'Scripts', 'Copywriting Persuasivo'],
  'Redator(a)': ['SEO', 'Blog posts', 'Artigos', 'Revisão', 'Conteúdo para redes', 'E-books', 'Ghostwriting', 'Escrita Criativa', 'Roteiros'],
  'Tradutor(a)': ['Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Localização', 'Tradução técnica', 'Legendagem', 'Revisão'],
  'Revisor(a)': ['Revisão de texto', 'Gramática', 'ABNT', 'Ortografia', 'Edição', 'Correção', 'Normas técnicas'],
  'Roteirista': ['Roteiros', 'Scripts', 'Storytelling', 'Narrativa', 'VSL', 'Vídeos', 'Documentários', 'Webséries'],
  'Produtor de Conteúdo': ['Criação de Conteúdo', 'Planejamento', 'Redação', 'Edição', 'Social Media', 'Blog', 'Vídeos', 'Podcasts'],
  'Suporte': ['Atendimento ao Cliente', 'Tickets', 'Chat', 'E-mail', 'Resolução de Problemas', 'CRM', 'Zendesk'],
  'Assistente Virtual': ['Gestão de agenda', 'E-mails', 'Atendimento', 'Organização', 'Excel', 'Google Workspace', 'Planilhas', 'Administração'],
  'BPO Financeiro': ['Contas a pagar', 'Contas a receber', 'Fluxo de caixa', 'Conciliação', 'Excel', 'Relatórios', 'Gestão Financeira'],
  'Atendimento ao Cliente': ['Suporte', 'Chat', 'WhatsApp', 'Telefone', 'E-mail', 'SAC', 'Customer Success', 'Relacionamento'],
  'Secretariado': ['Agendamento', 'Gestão de documentos', 'Organização', 'Excel', 'Word', 'PowerPoint', 'Comunicação'],
  'Advogado(a)': ['Contratos', 'Propriedade intelectual', 'Assessoria', 'LGPD', 'Registro de marca', 'Direito de imagem', 'Consultoria Jurídica'],
  'Contador(a)': ['Contabilidade', 'Impostos', 'Folha de pagamento', 'Planejamento tributário', 'Balanço', 'DRE', 'Compliance', 'Declarações'],
  'Consultor Jurídico': ['Consultoria', 'Contratos', 'Compliance', 'Due Diligence', 'Assessoria', 'Direito Empresarial'],
  'Analista Fiscal': ['Impostos', 'Apuração', 'Declarações', 'Compliance Fiscal', 'SPED', 'Nota Fiscal', 'Tributos'],
};

const todasHabilidades = Array.from(new Set(Object.values(habilidadesPorEspecialidade).flat())).sort();

export function ProfessionalSignupForm({ onComplete, onBack }: ProfessionalSignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfessionalData>>({
    habilidades: [],
  });
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [searchHabilidade, setSearchHabilidade] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [bioLength, setBioLength] = useState(0);

  const MAX_HABILIDADES = 10;

  const handleSelectCategoria = (categoriaId: string) => {
    setSelectedCategoria(categoriaId);
    setFormData(prev => ({ ...prev, categoria: categorias.find(c => c.id === categoriaId)?.nome }));
  };

  const handleSelectEspecialidade = (especialidade: string) => {
    setFormData(prev => ({ ...prev, especialidade }));
  };

  const toggleHabilidade = (habilidade: string) => {
    setFormData(prev => {
      const habilidades = prev.habilidades || [];
      if (habilidades.includes(habilidade)) {
        return { ...prev, habilidades: habilidades.filter(h => h !== habilidade) };
      } else if (habilidades.length < MAX_HABILIDADES) {
        return { ...prev, habilidades: [...habilidades, habilidade] };
      }
      return prev;
    });
  };



  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 2000) {
      setFormData(prev => ({ ...prev, sobreMim: text }));
      setBioLength(text.length);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !formData.especialidade) {
      alert('Por favor, selecione uma especialidade');
      return;
    }
    if (currentStep === 2 && (!formData.habilidades || formData.habilidades.length === 0)) {
      alert('Por favor, selecione pelo menos uma habilidade');
      return;
    }
    if (currentStep === 3) {
      if (formData.sobreMim && formData.sobreMim.length > 0 && formData.sobreMim.length < 100) {
        alert('Por favor, escreva pelo menos 100 caracteres sobre você, ou deixe em branco');
        return;
      }
      
      setIsSubmitting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');



        const profileData = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          email: user.email!,
          categoria: formData.categoria!,
          especialidade: formData.especialidade!,
          habilidades: formData.habilidades!,
          bio: formData.sobreMim,
          avatar_url: avatarUrl || undefined,
          portfolio_images: portfolioImages.length > 0 ? portfolioImages : undefined,
        };

        await professionalService.createProfile(profileData);
        onComplete(formData as ProfessionalData);
      } catch (error) {
        console.error('Erro ao criar perfil:', error);
        alert('Erro ao finalizar cadastro. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCategoria = () => {
    return categorias.find(c => c.id === selectedCategoria);
  };

  const getHabilidadesSugeridas = () => {
    if (!formData.especialidade) return [];
    return habilidadesPorEspecialidade[formData.especialidade] || [];
  };

  const getHabilidadesFiltradas = () => {
    const sugeridas = getHabilidadesSugeridas();
    
    if (!searchHabilidade.trim()) {
      return sugeridas;
    }

    const termoBusca = searchHabilidade.toLowerCase().trim();
    const sugeridasFiltradas = sugeridas.filter(h => h.toLowerCase().includes(termoBusca));

    if (sugeridasFiltradas.length > 0) {
      return sugeridasFiltradas;
    }

    return todasHabilidades.filter(h => h.toLowerCase().includes(termoBusca)).slice(0, 20);
  };

  const habilidadesParaMostrar = getHabilidadesFiltradas();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl my-8">
        
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-gseed-500 to-gseed-600 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          
          {currentStep === 1 && (
            <div>
              <div className="mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">PASSO 1 DE 3</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Conta pra gente, com o que você trabalha?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Isso não é definitivo! Você pode editar depois.
                </p>
              </div>

              {!selectedCategoria && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Primeiro, escolha uma categoria
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categorias.map((categoria) => {
                      const Icon = categoria.icon;
                      return (
                        <button
                          key={categoria.id}
                          onClick={() => handleSelectCategoria(categoria.id)}
                          className="group p-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-gseed-500 hover:bg-gseed-50 dark:hover:bg-gseed-900/20 transition-all duration-200 text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center group-hover:bg-gseed-500 transition-colors">
                            <Icon className="text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors" size={24} />
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {categoria.nome}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedCategoria && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={() => setSelectedCategoria(null)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      Voltar para categorias
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      {(() => {
                        const Icon = getCategoria()?.icon || Palette;
                        return (
                          <div className="w-12 h-12 bg-gseed-500 rounded-xl flex items-center justify-center">
                            <Icon className="text-white" size={24} />
                          </div>
                        );
                      })()}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getCategoria()?.nome}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Agora, escolha sua especialidade</p>
                  </div>

                  <div className="space-y-2">
                    {getCategoria()?.especialidades.map((especialidade) => (
                      <label
                        key={especialidade}
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-gseed-500 hover:bg-gseed-50 dark:hover:bg-gseed-900/20 cursor-pointer transition-all"
                      >
                        <input
                          type="radio"
                          name="especialidade"
                          value={especialidade}
                          checked={formData.especialidade === especialidade}
                          onChange={(e) => handleSelectEspecialidade(e.target.value)}
                          className="w-5 h-5 text-gseed-600 focus:ring-gseed-500"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{especialidade}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">PASSO 2 DE 3</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Quais são suas principais habilidades?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione até {MAX_HABILIDADES} talentos que representam o seu trabalho.
                </p>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar habilidades..."
                  value={searchHabilidade}
                  onChange={(e) => setSearchHabilidade(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecionadas: <span className="font-semibold text-gseed-600 dark:text-gseed-400">{formData.habilidades?.length || 0}/{MAX_HABILIDADES}</span>
                </p>
                {formData.habilidades && formData.habilidades.length >= MAX_HABILIDADES && (
                  <p className="text-sm text-amber-600 font-medium">
                    ✓ Máximo atingido
                  </p>
                )}
              </div>

              {formData.habilidades && formData.habilidades.length > 0 && (
                <div className="mb-6 p-4 bg-gseed-50 dark:bg-gseed-900/20 border-2 border-gseed-200 dark:border-gseed-800 rounded-xl">
                  <p className="text-sm font-semibold text-gseed-800 dark:text-gseed-400 mb-3">✓ Suas habilidades selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.habilidades.map((hab) => (
                      <button
                        key={hab}
                        onClick={() => toggleHabilidade(hab)}
                        className="flex items-center gap-2 px-4 py-2 bg-gseed-500 text-white rounded-full hover:bg-gseed-600 transition-colors shadow-sm hover:shadow-md font-medium text-sm"
                      >
                        <span>{hab}</span>
                        <X size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {searchHabilidade ? `📍 Resultados para "${searchHabilidade}":` : '💡 Habilidades sugeridas para você:'}
                </p>
                
                {habilidadesParaMostrar.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {habilidadesParaMostrar.map((hab) => {
                      const isSelected = formData.habilidades?.includes(hab);
                      const canSelect = (formData.habilidades?.length || 0) < MAX_HABILIDADES;
                      
                      return (
                        <button
                          key={hab}
                          onClick={() => toggleHabilidade(hab)}
                          disabled={!isSelected && !canSelect}
                          className={`px-4 py-2.5 rounded-full font-medium transition-all text-sm shadow-sm ${
                            isSelected
                              ? 'bg-gseed-500 text-white ring-2 ring-gseed-300'
                              : canSelect
                              ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-gseed-400 hover:bg-gseed-50 dark:hover:bg-gseed-900/20'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-2 border-gray-100 dark:border-gray-700'
                          }`}
                        >
                          {hab}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-2">
                      Nenhuma habilidade encontrada para "{searchHabilidade}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">PASSO 3 DE 3 - QUASE LÁ! 🎉</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Deixe seu perfil ainda mais completo!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fale um pouco sobre você e adicione uma foto. (Ambos opcionais)
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Foto de Perfil <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <div className="flex justify-center">
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    onUploadComplete={(url) => setAvatarUrl(url)}
                    size={120}
                    autoSave={false}
                    className=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sobre você <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Conte sobre sua experiência, diferenciais e objetivos profissionais.
                </p>
                <textarea
                  value={formData.sobreMim || ''}
                  onChange={handleBioChange}
                  placeholder="Ex: Sou designer gráfico há 5 anos, especializado em identidade visual..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">
                    {bioLength === 0 && (
                      <span className="text-gray-400">
                        💡 Dica: Uma boa descrição tem entre 100-500 caracteres
                      </span>
                    )}
                    {bioLength > 0 && bioLength < 100 && (
                      <span className="text-amber-600">
                        Mínimo recomendado: 100 caracteres (faltam {100 - bioLength})
                      </span>
                    )}
                    {bioLength >= 100 && (
                      <span className="text-green-600">
                        ✓ Ótimo! Descrição completa
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    {bioLength}/2000
                  </p>
                </div>
              </div>

              {/* Portfólio */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Portfólio <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Adicione até 5 imagens dos seus melhores trabalhos.
                </p>
                <MultipleImageUpload
                  onUploadComplete={(urls) => setPortfolioImages(urls)}
                  currentImageUrls={portfolioImages}
                  maxImages={5}
                  folder={`portfolios`}
                  maxSizeMB={5}
                  className=""
                />
              </div>

              <div className="mt-6 p-4 bg-gseed-50 dark:bg-gseed-900/20 border border-gseed-200 dark:border-gseed-800 rounded-lg">
                <p className="text-sm text-gseed-800 dark:text-gseed-400">
                  <span className="font-semibold">✨ Perfis completos</span> têm até <span className="font-semibold">3x mais chances</span> de receberem propostas!
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              <ChevronLeft size={20} />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep === 1 && !formData.especialidade) ||
                (currentStep === 2 && (!formData.habilidades || formData.habilidades.length === 0))
              }
              className="flex items-center gap-2 px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  {currentStep === 3 ? '🎉 Finalizar Cadastro' : 'Continuar'}
                  {currentStep < 3 && <ChevronRight size={20} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
