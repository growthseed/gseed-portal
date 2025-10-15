import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  FolderOpen,
  DollarSign,
  Calendar,
} from 'lucide-react';

interface ProjetoFormData {
  titulo: string;
  descricao: string;
  anexos: File[];
  profissao: string;
  habilidades: string[];
  orcamento: 'faixa1' | 'faixa2' | 'faixa3' | 'aberto' | '';
  prazo: 'sem_prazo' | 'com_prazo' | '';
  prazoData?: string;
}

interface CreateProjetoFormProps {
  onClose: () => void;
  onSubmit: (data: ProjetoFormData) => void;
}

export function CreateProjetoForm({ onClose, onSubmit }: CreateProjetoFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjetoFormData>({
    titulo: '',
    descricao: '',
    anexos: [],
    profissao: '',
    habilidades: [],
    orcamento: '',
    prazo: '',
  });

  // Lista de profissões
  const profissoes = [
    'Designer Gráfico',
    'Desenvolvedor Web',
    'Desenvolvedor Mobile',
    'Programador(a)',
    'Dados & Analytics',
    'Redator(a)',
    'Copywriter',
    'Fotógrafo',
    'Videomaker',
    'Social Media Manager',
    'Consultor de Marketing',
    'Especialista em SEO',
    'Editor de Vídeo',
    'Ilustrador(a)',
    'UX/UI Designer',
    'Product Manager',
    'Arquiteto',
    'Engenheiro',
  ].sort();

  // Habilidades por categoria
  const habilidadesPorProfissao: Record<string, string[]> = {
    'Programador(a)': [
      'Site',
      'Landing page',
      'Desenvolvimento Front-end',
      'E-commerce',
      'Back-end',
      'API',
      'React',
      'Node.js',
      'Python',
      'PHP',
      'WordPress',
    ],
    'Dados & Analytics': [
      'Power BI',
      'Machine Learning',
      'Python',
      'SQL',
      'Data Science',
      'Excel Avançado',
      'Tableau',
      'Estatística',
    ],
    'Designer Gráfico': [
      'Logotipo',
      'Identidade Visual',
      'Banner',
      'Material Impresso',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Figma',
      'Canva',
    ],
    // ... mais categorias conforme necessário
  };

  const getHabilidades = () => {
    return habilidadesPorProfissao[formData.profissao] || [
      'Comunicação',
      'Trabalho em Equipe',
      'Organização',
      'Criatividade',
      'Proatividade',
    ];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        anexos: [...formData.anexos, ...Array.from(e.target.files)],
      });
    }
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      anexos: formData.anexos.filter((_, i) => i !== index),
    });
  };

  const toggleHabilidade = (hab: string) => {
    if (formData.habilidades.includes(hab)) {
      setFormData({
        ...formData,
        habilidades: formData.habilidades.filter((h) => h !== hab),
      });
    } else {
      setFormData({
        ...formData,
        habilidades: [...formData.habilidades, hab],
      });
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.titulo.length >= 20 && formData.descricao.length >= 100;
    }
    if (step === 2) {
      return formData.profissao !== '';
    }
    if (step === 3) {
      return formData.habilidades.length > 0;
    }
    if (step === 4) {
      const hasOrcamento = formData.orcamento !== '';
      const hasPrazo = formData.prazo !== '';
      const validPrazo =
        formData.prazo !== 'com_prazo' || (formData.prazoData && formData.prazoData !== '');
      return hasOrcamento && hasPrazo && validPrazo;
    }
    return false;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gseed-500 rounded-lg flex items-center justify-center">
                <FolderOpen size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Criar Projeto
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Passo {step} de 4
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step >= s
                    ? 'bg-gseed-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Passo 1: Título e Descrição */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                O que seu projeto vai precisar?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Descreva detalhadamente o que precisa ser feito
              </p>

              {/* Título */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ex: Criação de site corporativo para empresa de tecnologia"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.titulo.length}/20 caracteres mínimos
                </p>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  rows={8}
                  placeholder="Descreva o escopo do projeto, objetivos, entregáveis esperados e qualquer detalhe relevante..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.descricao.length}/100 caracteres mínimos
                </p>
              </div>

              {/* Anexos */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Anexos (Opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Arraste arquivos ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png"
                    multiple
                    className="hidden"
                    id="file-upload-projeto"
                  />
                  <label
                    htmlFor="file-upload-projeto"
                    className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Selecionar Arquivos
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Apenas JPEG e PNG
                  </p>
                </div>

                {/* Lista de arquivos */}
                {formData.anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.anexos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {file.name}
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Passo 2: Profissão */}
          {step === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Qual profissional você está procurando?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Escolha a profissão que melhor se encaixa no projeto
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profissoes.map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setFormData({ ...formData, profissao: prof })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.profissao === prof
                        ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {prof}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Passo 3: Habilidades */}
          {step === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quais talentos esse profissional deve ter?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Selecione pelo menos uma habilidade necessária
              </p>

              <div className="flex flex-wrap gap-3">
                {getHabilidades().map((hab) => (
                  <button
                    key={hab}
                    onClick={() => toggleHabilidade(hab)}
                    className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                      formData.habilidades.includes(hab)
                        ? 'border-gseed-500 bg-gseed-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gseed-300'
                    }`}
                  >
                    {formData.habilidades.includes(hab) && (
                      <Check size={16} className="inline mr-1" />
                    )}
                    {hab}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {formData.habilidades.length} habilidade(s) selecionada(s)
              </p>
            </div>
          )}

          {/* Passo 4: Orçamento e Prazo */}
          {step === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Qual será o orçamento do projeto?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Defina o orçamento e o prazo de entrega
              </p>

              {/* Orçamento */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                  <DollarSign size={18} className="inline mr-1" />
                  Orçamento *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'faixa1', label: 'R$ 0 – 1 mil', desc: 'Pequeno projeto' },
                    { value: 'faixa2', label: 'R$ 1 – 5 mil', desc: 'Projeto médio' },
                    { value: 'faixa3', label: '> R$ 5 mil', desc: 'Grande projeto' },
                    { value: 'aberto', label: 'Aberto a proposta', desc: 'Negociável' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          orcamento: option.value as any,
                        })
                      }
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.orcamento === option.value
                          ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prazo */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                  <Calendar size={18} className="inline mr-1" />
                  Prazo de Entrega *
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, prazo: 'sem_prazo', prazoData: undefined })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.prazo === 'sem_prazo'
                        ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">Sem prazo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Flexível
                    </p>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, prazo: 'com_prazo' })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.prazo === 'com_prazo'
                        ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">
                      Prazo definido
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Data específica
                    </p>
                  </button>
                </div>

                {formData.prazo === 'com_prazo' && (
                  <div>
                    <input
                      type="date"
                      value={formData.prazoData || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, prazoData: e.target.value })
                      }
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Avançar
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="px-8 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check size={20} />
              Publicar Projeto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
