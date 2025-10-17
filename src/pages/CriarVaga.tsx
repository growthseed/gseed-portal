import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '@/services';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  X, 
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { MultipleImageUpload } from '@/components/upload';

interface VagaData {
  titulo: string;
  descricao: string;
  anexos: string[]; // URLs das imagens
  profissao: string;
  habilidades: string[];
}

const profissoes = [
  'Designer',
  'Gestor de Tráfego',
  'Programador(a)',
  'Redator(a)',
  'Social Media',
  'Videomaker',
  'Fotógrafo(a)',
  'Dados & Analytics',
];

const habilidadesPorProfissao: Record<string, string[]> = {
  'Designer': ['UI Design', 'UX Design', 'Design Gráfico', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Branding', 'Design de Interface', 'Prototipagem'],
  'Programador(a)': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'PHP', 'Vue.js', 'Angular', 'HTML/CSS', 'SQL', 'MongoDB', 'Git'],
  'Gestor de Tráfego': ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'TikTok Ads', 'LinkedIn Ads', 'Google Analytics', 'SEO', 'Copywriting', 'Funis de Venda'],
  'Redator(a)': ['Copywriting', 'SEO', 'Criação de Conteúdo', 'Storytelling', 'Revisão de Textos', 'Roteiros', 'E-mail Marketing'],
  'Social Media': ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube', 'Planejamento de Conteúdo', 'Canva'],
  'Videomaker': ['Edição de Vídeo', 'After Effects', 'Premiere Pro', 'Final Cut', 'Motion Graphics', 'Roteiro', 'Filmagem'],
  'Fotógrafo(a)': ['Fotografia', 'Lightroom', 'Photoshop', 'Edição', 'Direção de Arte', 'Iluminação'],
  'Dados & Analytics': ['Power BI', 'Tableau', 'Excel', 'SQL', 'Python', 'Machine Learning', 'Análise de Dados'],
};

export default function CriarVaga() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VagaData>({
    titulo: '',
    descricao: '',
    anexos: [],
    profissao: '',
    habilidades: [],
  });

  const MIN_TITULO = 20;
  const MIN_DESCRICAO = 100;

  const isStep1Valid = () => formData.titulo.length >= MIN_TITULO && formData.descricao.length >= MIN_DESCRICAO;
  const isStep2Valid = () => formData.profissao !== '';
  const isStep3Valid = () => formData.habilidades.length > 0;

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid()) setCurrentStep(2);
    else if (currentStep === 2 && isStep2Valid()) setCurrentStep(3);
    else if (currentStep === 3 && isStep3Valid()) handleSubmit();
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
    setIsSubmitting(true);
    
    try {
      const projectData = {
        title: formData.titulo,
        description: formData.descricao,
        category: formData.profissao,
        required_profession: formData.profissao,
        required_skills: formData.habilidades,
        budget_type: 'open' as const,
        deadline_type: 'flexible' as const,
        location_type: 'remote' as const,
        is_urgent: false,
        is_job: true, // Marca como vaga
        attachments: formData.anexos,
      };

      const projectResult = await projectService.createProject(projectData);
      if (projectResult && projectResult.success && projectResult.data && projectResult.data.id) {
        navigate(`/projetos/${projectResult.data.id}`);
      } else if (projectResult && projectResult.data && projectResult.data.id) {
        navigate(`/projetos/${projectResult.data.id}`);
      } else {
        // fallback: try to navigate using a returned id or show error
        console.warn('createProject did not return an id', projectResult);
      }
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      alert('Erro ao publicar vaga. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHabilidadesDisponiveis = () => {
    if (!formData.profissao) return [];
    return habilidadesPorProfissao[formData.profissao] || [];
  };

  const isTituloInvalid = formData.titulo.length > 0 && formData.titulo.length < MIN_TITULO;
  const isDescricaoInvalid = formData.descricao.length > 0 && formData.descricao.length < MIN_DESCRICAO;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Publicar Vaga</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contratação de profissional</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === currentStep ? 'w-4 h-4 bg-gseed-500 ring-4 ring-gseed-100 dark:ring-gseed-900/50' : step < currentStep ? 'bg-gseed-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className={`text-xs mt-2 font-medium ${
                      step === currentStep ? 'text-gseed-600 dark:text-gseed-400' : step < currentStep ? 'text-gseed-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {step === 1 ? 'Detalhes' : step === 2 ? 'Profissão' : 'Habilidades'}
                    </span>
                  </div>
                  {index < 2 && <div className={`w-20 h-0.5 mx-3 transition-all duration-300 ${step < currentStep ? 'bg-gseed-500' : 'bg-gray-300 dark:bg-gray-600'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 - Detalhes */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fale mais sobre a sua vaga</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Descreva a posição, responsabilidades e o que espera do profissional.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Título da Vaga *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Designer Gráfico para Estúdio Criativo"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:text-white ${
                    isTituloInvalid ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : formData.titulo.length >= MIN_TITULO ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
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
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Descrição da Vaga *</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva as responsabilidades, requisitos, diferenciais da vaga e o que oferece..."
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none transition-colors dark:bg-gray-700 dark:text-white ${
                    isDescricaoInvalid ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : formData.descricao.length >= MIN_DESCRICAO ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
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
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Imagens da Vaga (Opcional)</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Adicione imagens que ajudem a entender a vaga (máx. 5 imagens)</p>
                <MultipleImageUpload
                  onUploadComplete={handleImagesUploaded}
                  currentImageUrls={formData.anexos}
                  maxImages={5}
                  folder="jobs"
                />
              </div>
            </div>
          )}

          {/* Step 2 - Profissão */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Qual profissional você está procurando?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Selecione a profissão mais adequada para esta vaga.</p>
              <div className="grid grid-cols-2 gap-3">
                {profissoes.map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setFormData({ ...formData, profissao: prof })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.profissao === prof ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20 text-gseed-900 dark:text-gseed-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow-sm'
                    }`}
                  >
                    <p className="font-medium">{prof}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 - Habilidades */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quais talentos esse profissional deve ter?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Selecione as competências necessárias para esta vaga.</p>
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

          {/* Navigation Buttons */}
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
                (currentStep === 3 && !isStep3Valid())
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
                  {currentStep === 3 ? 'Publicar Vaga' : 'Avançar'}
                  {currentStep < 3 && <ChevronRight size={20} />}
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
