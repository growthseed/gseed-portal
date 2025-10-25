import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  AlertCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import { MultipleImageUpload } from '@/components/upload';
import { validateField, ValidationErrors } from '@/lib/validation';
import { toast } from 'sonner';
import { professionCategories } from '@/data/professions';

interface ProjetoData {
  titulo: string;
  descricao: string;
  anexos: string[]; // URLs das imagens
  categoria: string; // Nova: categoria selecionada
  profissao: string;
  habilidades: string[];
  orcamento: string;
  prazo: 'sem_prazo' | 'com_prazo';
  dataPrazo?: string;
}



const orcamentoOpcoes = [
  { value: '0-1k', label: 'R$ 0 - R$ 1.000', min: 0, max: 1000 },
  { value: '1k-5k', label: 'R$ 1.000 - R$ 5.000', min: 1000, max: 5000 },
  { value: '5k+', label: 'Mais de R$ 5.000', min: 5000, max: null },
  { value: 'aberto', label: 'Aberto a propostas', min: null, max: null },
];

export default function CriarProjeto() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjetoData>({
    titulo: '',
    descricao: '',
    anexos: [],
    categoria: '',
    profissao: '',
    habilidades: [],
    orcamento: '',
    prazo: 'sem_prazo',
  });

  // Profissões disponíveis baseadas na categoria selecionada
  const [profissoesDisponiveis, setProfissoesDisponiveis] = useState<string[]>([]);
  
  // Atualizar profissões quando categoria mudar
  useEffect(() => {
    if (formData.categoria && professionCategories[formData.categoria as keyof typeof professionCategories]) {
      const categoria = professionCategories[formData.categoria as keyof typeof professionCategories];
      setProfissoesDisponiveis(categoria.specialties);
    } else {
      setProfissoesDisponiveis([]);
    }
  }, [formData.categoria]);

  const MIN_TITULO = 20;
  const MIN_DESCRICAO = 100;
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validação de cada etapa
  const validateStep1 = () => {
    const newErrors: ValidationErrors = {};
    
    const tituloError = validateField(formData.titulo, [
      { required: true, message: 'Título é obrigatório' },
      { minLength: MIN_TITULO, message: `Título deve ter no mínimo ${MIN_TITULO} caracteres` },
      { maxLength: 200, message: 'Título deve ter no máximo 200 caracteres' },
    ]);
    if (tituloError) newErrors.titulo = tituloError;

    const descricaoError = validateField(formData.descricao, [
      { required: true, message: 'Descrição é obrigatória' },
      { minLength: MIN_DESCRICAO, message: `Descrição deve ter no mínimo ${MIN_DESCRICAO} caracteres` },
    ]);
    if (descricaoError) newErrors.descricao = descricaoError;

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.categoria) {
      newErrors.categoria = 'Selecione uma categoria';
    }
    
    if (!formData.profissao) {
      newErrors.profissao = 'Selecione uma profissão';
    }

    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors: ValidationErrors = {};
    
    if (formData.habilidades.length === 0) {
      newErrors.habilidades = 'Selecione pelo menos uma habilidade';
    }

    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.orcamento) {
      newErrors.orcamento = 'Selecione um orçamento';
    }

    if (formData.prazo === 'com_prazo' && !formData.dataPrazo) {
      newErrors.dataPrazo = 'Selecione uma data de entrega';
    }

    return newErrors;
  };

  const isStep1Valid = () => Object.keys(validateStep1()).length === 0;
  const isStep2Valid = () => Object.keys(validateStep2()).length === 0;
  const isStep3Valid = () => Object.keys(validateStep3()).length === 0;
  const isStep4Valid = () => Object.keys(validateStep4()).length === 0;

  const handleNext = () => {
    let stepErrors: ValidationErrors = {};
    
    switch (currentStep) {
      case 1:
        stepErrors = validateStep1();
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep(2);
          setErrors({});
        } else {
          setErrors(stepErrors);
          const firstError = Object.values(stepErrors)[0];
          toast.error(firstError);
        }
        break;
      case 2:
        stepErrors = validateStep2();
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep(3);
          setErrors({});
        } else {
          setErrors(stepErrors);
          const firstError = Object.values(stepErrors)[0];
          toast.error(firstError);
        }
        break;
      case 3:
        stepErrors = validateStep3();
        if (Object.keys(stepErrors).length === 0) {
          setCurrentStep(4);
          setErrors({});
        } else {
          setErrors(stepErrors);
          const firstError = Object.values(stepErrors)[0];
          toast.error(firstError);
        }
        break;
      case 4:
        stepErrors = validateStep4();
        if (Object.keys(stepErrors).length === 0) {
          handleSubmit();
        } else {
          setErrors(stepErrors);
          const firstError = Object.values(stepErrors)[0];
          toast.error(firstError);
        }
        break;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate(-1);
  };

  const handleImagesUploaded = (urls: string[]) => {
    setFormData(prev => ({ ...prev, anexos: urls }));
  };

  const toggleHabilidade = (habilidade: string) => {
    setFormData(prev => {
      const hasHabilidade = prev.habilidades.includes(habilidade);
      if (hasHabilidade) {
        return { ...prev, habilidades: prev.habilidades.filter(h => h !== habilidade) };
      } else {
        return { ...prev, habilidades: [...prev.habilidades, habilidade] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Você precisa estar logado para criar um projeto.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mapear dados do formulário para o formato do serviço
      const selectedOrcamento = orcamentoOpcoes.find(o => o.value === formData.orcamento);
      
      const projectData = {
        user_id: user.id,
        title: formData.titulo,
        description: formData.descricao,
        category: formData.profissao,
        required_profession: formData.profissao,
        required_skills: formData.habilidades,
        budget_type: formData.orcamento === 'aberto' ? 'open' as const : 'range' as const,
        budget_min: selectedOrcamento?.min || undefined,
        budget_max: selectedOrcamento?.max || undefined,
        deadline_type: formData.prazo === 'sem_prazo' ? 'flexible' as const : 'fixed' as const,
        deadline_date: formData.dataPrazo,
        location_type: 'remote' as const,
        is_urgent: false,
        status: 'open' as const,
        attachments: formData.anexos,
      };

      const result = await projectService.createProject(projectData);
      
      if (result.success && result.data) {
        toast.success('Projeto criado com sucesso!');
        // Redirecionar para a página do projeto criado
        navigate(`/projetos/${result.data.id}`);
      } else {
        throw new Error(result.message || 'Erro ao criar projeto');
      }
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast.error(error.message || 'Erro ao publicar projeto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Habilidades disponíveis baseadas na profissão selecionada
  const getHabilidadesDisponiveis = (): string[] => {
    if (!formData.categoria || !formData.profissao) return [];
    
    const categoria = professionCategories[formData.categoria as keyof typeof professionCategories];
    return categoria?.skills || [];
  };

  const handleCategoriaChange = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      categoria,
      profissao: '', // Limpar profissão ao mudar categoria
      habilidades: [], // Limpar habilidades ao mudar categoria
    }));
    if (errors.categoria) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoria;
        return newErrors;
      });
    }
  };

  const handleProfissaoChange = (profissao: string) => {
    setFormData(prev => ({
      ...prev,
      profissao,
      habilidades: [], // Limpar habilidades ao mudar profissão
    }));
    if (errors.profissao) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profissao;
        return newErrors;
      });
    }
  };

  const isTituloInvalid = formData.titulo.length > 0 && formData.titulo.length < MIN_TITULO;
  const isDescricaoInvalid = formData.descricao.length > 0 && formData.descricao.length < MIN_DESCRICAO;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Publicar Projeto</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Demanda pontual</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === currentStep ? 'w-4 h-4 bg-gseed-500 ring-4 ring-gseed-100 dark:ring-gseed-900/50' : step < currentStep ? 'bg-gseed-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className={`text-xs mt-2 font-medium ${
                      step === currentStep ? 'text-gseed-600 dark:text-gseed-400' : step < currentStep ? 'text-gseed-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {step === 1 ? 'Detalhes' : step === 2 ? 'Profissão' : step === 3 ? 'Habilidades' : 'Orçamento'}
                    </span>
                  </div>
                  {index < 3 && <div className={`w-20 h-0.5 mx-3 transition-all duration-300 ${step < currentStep ? 'bg-gseed-500' : 'bg-gray-300 dark:bg-gray-600'}`} />}
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">O que seu projeto precisa?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Descreva seu projeto com o máximo de detalhes possível.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Título do Projeto *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => {
                    setFormData({ ...formData, titulo: e.target.value });
                    if (errors.titulo) setErrors(prev => { const newErrors = {...prev}; delete newErrors.titulo; return newErrors; });
                  }}
                  placeholder="Ex: Criação de site corporativo para empresa de tecnologia"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:text-white ${
                    errors.titulo || isTituloInvalid ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : formData.titulo.length >= MIN_TITULO ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {isTituloInvalid && <AlertCircle size={14} className="text-red-500" />}
                    <p className={`text-xs ${isTituloInvalid ? 'text-red-600 font-medium' : formData.titulo.length >= MIN_TITULO ? 'text-green-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {isTituloInvalid ? `Faltam ${MIN_TITULO - formData.titulo.length} caracteres` : formData.titulo.length >= MIN_TITULO ? '✓ Mínimo atingido' : `Mínimo ${MIN_TITULO} caracteres`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{formData.titulo.length} caracteres</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Descrição do Projeto *</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => {
                    setFormData({ ...formData, descricao: e.target.value });
                    if (errors.descricao) setErrors(prev => { const newErrors = {...prev}; delete newErrors.descricao; return newErrors; });
                  }}
                  placeholder="Descreva o escopo, objetivos, entregas esperadas e requisitos técnicos do projeto..."
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none transition-colors dark:bg-gray-700 dark:text-white ${
                    errors.descricao || isDescricaoInvalid ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : formData.descricao.length >= MIN_DESCRICAO ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {isDescricaoInvalid && <AlertCircle size={14} className="text-red-500" />}
                    <p className={`text-xs ${isDescricaoInvalid ? 'text-red-600 font-medium' : formData.descricao.length >= MIN_DESCRICAO ? 'text-green-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {isDescricaoInvalid ? `Faltam ${MIN_DESCRICAO - formData.descricao.length} caracteres` : formData.descricao.length >= MIN_DESCRICAO ? '✓ Mínimo atingido' : `Mínimo ${MIN_DESCRICAO} caracteres`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{formData.descricao.length} caracteres</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Imagens do Projeto (Opcional)</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Adicione imagens, mockups ou referências visuais (máx. 5 imagens)</p>
                <MultipleImageUpload
                  onUploadComplete={handleImagesUploaded}
                  currentImageUrls={formData.anexos}
                  maxImages={5}
                  folder="projects"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Qual profissional você está procurando?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Selecione a categoria e a profissão mais adequada para executar este projeto.</p>
              
              {/* Seleção de Categoria */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Categoria *
                </label>
                {errors.categoria && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.categoria}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(professionCategories).map(([categoria, dados]) => (
                    <button
                      key={categoria}
                      onClick={() => handleCategoriaChange(categoria)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.categoria === categoria 
                          ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dados.icon}</span>
                        <p className="font-medium">{categoria}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Profissão - Aparece apenas após selecionar categoria */}
              {formData.categoria && profissoesDisponiveis.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Profissão/Especialidade *
                  </label>
                  {errors.profissao && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.profissao}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profissoesDisponiveis.map((prof) => (
                      <button
                        key={prof}
                        onClick={() => handleProfissaoChange(prof)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.profissao === prof 
                            ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                        }`}
                      >
                        <p className="font-medium">{prof}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quais talentos esse profissional deve ter?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Selecione as competências necessárias para este projeto.</p>
              {errors.habilidades && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.habilidades}</p>
                </div>
              )}
              {formData.habilidades.length > 0 && (
                <div className="mb-6 p-4 bg-gseed-50 dark:bg-gseed-900/20 rounded-lg border border-gseed-200 dark:border-gseed-800">
                  <p className="text-sm font-medium text-gseed-900 dark:text-gseed-400 mb-3">Selecionadas ({formData.habilidades.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.habilidades.map((hab) => (
                      <button key={hab} onClick={() => toggleHabilidade(hab)} className="px-3 py-1.5 bg-gseed-500 text-white rounded-full text-sm font-medium hover:bg-gseed-600 transition-colors flex items-center gap-1">
                        {hab}<X size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {getHabilidadesDisponiveis().map((hab) => {
                  const isSelected = formData.habilidades.includes(hab);
                  return (
                    <button key={hab} onClick={() => toggleHabilidade(hab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected ? 'bg-gseed-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                      {hab}{isSelected && ' +'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Qual será o orçamento do projeto?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Defina a faixa de investimento e o prazo de entrega.</p>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Orçamento *</label>
                {errors.orcamento && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.orcamento}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {orcamentoOpcoes.map((opcao) => (
                    <button key={opcao.value} onClick={() => setFormData({ ...formData, orcamento: opcao.value })} className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.orcamento === opcao.value ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                    }`}>
                      <p className="font-medium">{opcao.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Prazo de Entrega *</label>
                <div className="flex gap-3 mb-4">
                  <button onClick={() => setFormData({ ...formData, prazo: 'sem_prazo', dataPrazo: undefined })} className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    formData.prazo === 'sem_prazo' ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                  }`}>
                    <p className="font-medium">Sem prazo</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prazo flexível de acordo com disponibilidade</p>
                  </button>
                  <button onClick={() => setFormData({ ...formData, prazo: 'com_prazo' })} className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    formData.prazo === 'com_prazo' ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                  }`}>
                    <p className="font-medium">Prazo de entrega definido</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Data específica para conclusão do projeto</p>
                  </button>
                </div>
                {formData.prazo === 'com_prazo' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Data de Entrega</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dataPrazo || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, dataPrazo: e.target.value });
                          if (errors.dataPrazo) setErrors(prev => { const newErrors = {...prev}; delete newErrors.dataPrazo; return newErrors; });
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                          errors.dataPrazo ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {errors.dataPrazo && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.dataPrazo}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handlePrevious} 
              className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              <ChevronLeft size={20} />Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep === 1 && !isStep1Valid()) || 
                (currentStep === 2 && !isStep2Valid()) || 
                (currentStep === 3 && !isStep3Valid()) || 
                (currentStep === 4 && !isStep4Valid())
              }
              className="flex items-center gap-2 px-8 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gseed-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  {currentStep === 4 ? 'Publicar Projeto' : 'Avançar'}
                  {currentStep < 4 && <ChevronRight size={20} />}
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
