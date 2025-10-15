import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Check,
  Briefcase,
  DollarSign,
  Calendar,
  Image,
  MapPin,
  Star,
  Zap,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface CreateProjectFormProps {
  onBack: () => void
  type: 'vaga' | 'projeto'
}

// Lista de profissões
const professions = [
  'Desenvolvedor Full Stack',
  'Desenvolvedor Frontend', 
  'Desenvolvedor Backend',
  'Designer UI/UX',
  'Designer Gráfico',
  'Mobile Developer',
  'DevOps',
  'Data Scientist',
  'Marketing Digital',
  'Copywriter',
  'Videomaker',
  'Editor de Vídeo',
  'Fotógrafo',
  'Tradutor',
  'Redator',
]

// Lista de habilidades por profissão
const skillsByProfession: Record<string, string[]> = {
  'Desenvolvedor Full Stack': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Next.js'],
  'Desenvolvedor Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind', 'Sass', 'Redux', 'Next.js'],
  'Desenvolvedor Backend': ['Node.js', 'Python', 'Java', 'C#', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
  'Designer UI/UX': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing', 'User Research', 'Design System'],
  'Designer Gráfico': ['Photoshop', 'Illustrator', 'InDesign', 'CorelDRAW', 'Branding', 'Logo Design'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Firebase'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Git'],
  'Data Scientist': ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Pandas', 'Scikit-learn'],
  'Marketing Digital': ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Analytics', 'Social Media'],
  'Copywriter': ['SEO Writing', 'Blog Posts', 'Landing Pages', 'Email Copy', 'Social Media', 'Headlines'],
  'Videomaker': ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading'],
  'Editor de Vídeo': ['Premiere Pro', 'Final Cut', 'DaVinci Resolve', 'After Effects', 'Color Correction'],
  'Fotógrafo': ['Lightroom', 'Photoshop', 'Product Photography', 'Portrait', 'Event Photography'],
  'Tradutor': ['English', 'Spanish', 'French', 'German', 'Technical Translation', 'Literary'],
  'Redator': ['Blog Writing', 'Technical Writing', 'Creative Writing', 'Content Strategy', 'Research'],
}

// Estados brasileiros
const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

// Faixas de orçamento para PROJETOS
const projectBudgetRanges = [
  { id: '0-1000', label: 'R$ 0 - R$ 1.000', min: 0, max: 1000 },
  { id: '1000-3000', label: 'R$ 1.000 - R$ 3.000', min: 1000, max: 3000 },
  { id: '3000-5000', label: 'R$ 3.000 - R$ 5.000', min: 3000, max: 5000 },
  { id: '5000-10000', label: 'R$ 5.000 - R$ 10.000', min: 5000, max: 10000 },
  { id: '10000+', label: 'Acima de R$ 10.000', min: 10000, max: null },
  { id: 'open', label: 'Aberto a propostas', min: null, max: null },
]

// Faixas de salário para VAGAS
const jobSalaryRanges = [
  { id: '1000-2000', label: 'R$ 1.000 - R$ 2.000', min: 1000, max: 2000 },
  { id: '2000-4000', label: 'R$ 2.000 - R$ 4.000', min: 2000, max: 4000 },
  { id: '4000-6000', label: 'R$ 4.000 - R$ 6.000', min: 4000, max: 6000 },
  { id: '6000-10000', label: 'R$ 6.000 - R$ 10.000', min: 6000, max: 10000 },
  { id: '10000+', label: 'Acima de R$ 10.000', min: 10000, max: null },
  { id: 'open', label: 'A combinar', min: null, max: null },
]

export default function CreateProjectForm({ onBack, type }: CreateProjectFormProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Definir número total de steps baseado no tipo
  const totalSteps = type === 'vaga' ? 4 : 5
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    profession: '',
    skills: [] as string[],
    experienceLevel: '', // junior, mid, senior
    budgetRange: '',
    locationType: '', // remote, onsite, hybrid
    city: '',
    state: '',
    hasDeadline: false,
    deadline: '',
    isUrgent: false,
    attachments: [] as File[],
  })

  // Validações por step
  const canProceed = () => {
    switch(currentStep) {
      case 1: // Informações básicas
        return formData.title.length >= 20 && formData.description.length >= 100
      
      case 2: // Profissão e Experiência
        return formData.profession !== '' && formData.experienceLevel !== ''
      
      case 3: // Habilidades
        return formData.skills.length > 0
      
      case 4: // Localização (só para vagas) ou Orçamento (para projetos)
        if (type === 'vaga') {
          // Para vagas: precisa ter localização
          return formData.locationType !== '' && 
                 (formData.locationType === 'remote' || 
                  (formData.city !== '' && formData.state !== ''))
        } else {
          // Para projetos: vai para o step 5 que é orçamento
          return formData.locationType !== '' && 
                 (formData.locationType === 'remote' || 
                  (formData.city !== '' && formData.state !== ''))
        }
      
      case 5: // Orçamento e prazo (só projetos)
        return formData.budgetRange !== '' && 
               (!formData.hasDeadline || formData.deadline !== '')
      
      default:
        return true
    }
  }

  // Navegação entre steps
  const nextStep = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      toast.error('Preencha todos os campos obrigatórios')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Toggle skill
  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Tipo de arquivo não permitido`)
        return false
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: Arquivo muito grande (máx: 5MB)`)
        return false
      }
      
      return true
    })
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }))
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // Submit form
  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Você precisa estar logado para criar um projeto')
        navigate('/login')
        return
      }

      // Upload attachments if any
      const uploadedUrls: string[] = []
      
      if (formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('project-attachments')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Erro ao fazer upload:', uploadError)
            toast.error(`Erro ao fazer upload de ${file.name}`)
            continue
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('project-attachments')
            .getPublicUrl(fileName)
          
          uploadedUrls.push(publicUrl)
        }
      }

      // Get budget values
      const budgetRanges = type === 'projeto' ? projectBudgetRanges : jobSalaryRanges
      const budget = budgetRanges.find(b => b.id === formData.budgetRange)
      
      // Prepare data for insert
      const projectData = {
        title: formData.title,
        description: formData.description,
        type: type,
        profession: formData.profession,
        skills: formData.skills,
        experience_level: formData.experienceLevel,
        location_type: formData.locationType,
        city: formData.locationType !== 'remote' ? formData.city : null,
        state: formData.locationType !== 'remote' ? formData.state : null,
        budget_min: budget?.min,
        budget_max: budget?.max,
        budget_negotiable: formData.budgetRange === 'open',
        deadline: formData.hasDeadline ? formData.deadline : null,
        is_urgent: formData.isUrgent,
        attachments: uploadedUrls.length > 0 ? uploadedUrls : null,
        status: 'open',
        user_id: user.id,
      }

      // Insert into database
      const { error } = await supabase
        .from('projects')
        .insert(projectData)

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      toast.success(`${type === 'vaga' ? 'Vaga' : 'Projeto'} criado com sucesso!`)
      navigate('/meus-projetos')
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error)
      toast.error(error.message || 'Erro ao criar projeto')
    } finally {
      setLoading(false)
    }
  }

  // Labels dos steps
  const getStepLabels = () => {
    if (type === 'vaga') {
      return ['Informações', 'Profissão', 'Habilidades', 'Salário']
    } else {
      return ['Informações', 'Profissão', 'Habilidades', 'Localização', 'Orçamento']
    }
  }

  const stepLabels = getStepLabels()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-gseed-600 dark:text-gseed-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {type === 'vaga' ? 'Nova Vaga' : 'Novo Projeto'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1
                return (
                  <div
                    key={step}
                    className={`flex-1 ${step < totalSteps ? 'mr-2' : ''}`}
                  >
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        step <= currentStep 
                          ? 'bg-gseed-600 dark:bg-gseed-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between">
              {stepLabels.map((label, index) => (
                <span 
                  key={index} 
                  className={`text-xs ${
                    index + 1 <= currentStep 
                      ? 'text-gseed-600 dark:text-gseed-400 font-medium' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Informações Básicas
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Descreva claramente o que você está buscando
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título {type === 'vaga' ? 'da Vaga' : 'do Projeto'} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent transition-colors"
                  placeholder={type === 'vaga' 
                    ? 'Ex: Desenvolvedor Full Stack - React e Node.js'
                    : 'Ex: Desenvolvimento de E-commerce para Loja de Roupas'
                  }
                />
                <p className={`text-xs mt-1 ${
                  formData.title.length >= 20 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {formData.title.length}/20 caracteres (mínimo)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent resize-none transition-colors"
                  placeholder={type === 'vaga'
                    ? 'Descreva as responsabilidades, requisitos e benefícios da vaga...'
                    : 'Descreva detalhadamente o que precisa ser feito, requisitos técnicos, prazo esperado...'
                  }
                />
                <p className={`text-xs mt-1 ${
                  formData.description.length >= 100 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {formData.description.length}/100 caracteres (mínimo)
                </p>
              </div>

              {/* Urgency Flag */}
              {type === 'projeto' && (
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 dark:focus:ring-orange-400 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className="text-orange-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Marcar como urgente
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Projetos urgentes recebem mais destaque e são priorizados nas buscas
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anexos (Opcional)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload size={40} className="text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para enviar ou arraste arquivos aqui
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Imagens, PDF ou DOC (máx. 5MB cada)
                    </span>
                  </label>
                </div>

                {/* Attached files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Image size={20} className="text-gray-400 dark:text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 block">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <X size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Profession & Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Profissão e Nível de Experiência
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecione a profissão e o nível de experiência desejado
                </p>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profissão *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {professions.map((profession) => (
                    <button
                      key={profession}
                      onClick={() => setFormData({ ...formData, profession, skills: [] })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.profession === profession
                          ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        formData.profession === profession
                          ? 'text-gseed-700 dark:text-gseed-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {profession}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Nível de Experiência *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'junior', label: 'Júnior', icon: '👶', desc: '0-2 anos' },
                    { value: 'mid', label: 'Pleno', icon: '🧑', desc: '2-5 anos' },
                    { value: 'senior', label: 'Sênior', icon: '👴', desc: '5+ anos' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.experienceLevel === level.value
                          ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <div className="text-2xl mb-2">{level.icon}</div>
                      <div className={`text-sm font-medium mb-1 ${
                        formData.experienceLevel === level.value
                          ? 'text-gseed-700 dark:text-gseed-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {level.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Habilidades Necessárias
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecione as habilidades importantes para {type === 'vaga' ? 'esta vaga' : 'este projeto'}
                </p>
              </div>

              {formData.profession ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(skillsByProfession[formData.profession] || []).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.skills.includes(skill)
                            ? 'bg-gseed-600 dark:bg-gseed-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {formData.skills.includes(skill) && (
                          <Check size={16} className="inline mr-1" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="p-4 bg-gseed-50 dark:bg-gseed-900/30 border border-gseed-200 dark:border-gseed-800 rounded-lg">
                      <p className="text-sm text-gseed-700 dark:text-gseed-400 font-medium">
                        ✓ {formData.skills.length} habilidades selecionadas:
                      </p>
                      <p className="text-sm text-gseed-600 dark:text-gseed-500 mt-1">
                        {formData.skills.join(', ')}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Star size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Selecione uma profissão no passo anterior para ver as habilidades
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Location (Para ambos) ou Budget (só para Vagas) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {type === 'projeto' ? (
                // Para projetos: Localização
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Localização do Trabalho
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Onde o trabalho será realizado?
                    </p>
                  </div>

                  {/* Location Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tipo de Localização *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'remote', label: 'Remoto', icon: '🏠', desc: '100% online' },
                        { value: 'onsite', label: 'Presencial', icon: '🏢', desc: 'No local' },
                        { value: 'hybrid', label: 'Híbrido', icon: '🔀', desc: 'Misto' }
                      ].map((locType) => (
                        <button
                          key={locType.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            locationType: locType.value,
                            // Limpar cidade/estado se remoto
                            city: locType.value === 'remote' ? '' : formData.city,
                            state: locType.value === 'remote' ? '' : formData.state
                          })}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            formData.locationType === locType.value
                              ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                          }`}
                        >
                          <div className="text-2xl mb-2">{locType.icon}</div>
                          <div className={`text-sm font-medium mb-1 ${
                            formData.locationType === locType.value
                              ? 'text-gseed-700 dark:text-gseed-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {locType.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {locType.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City & State (se não for remoto) */}
                  {formData.locationType && formData.locationType !== 'remote' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent"
                          placeholder="Ex: São Paulo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Para vagas: Localização + Salário juntos
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Localização e Salário
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Defina onde será o trabalho e a faixa salarial
                    </p>
                  </div>

                  {/* Location Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tipo de Trabalho *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'remote', label: 'Remoto', icon: '🏠', desc: '100% online' },
                        { value: 'onsite', label: 'Presencial', icon: '🏢', desc: 'No local' },
                        { value: 'hybrid', label: 'Híbrido', icon: '🔀', desc: 'Misto' }
                      ].map((locType) => (
                        <button
                          key={locType.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            locationType: locType.value,
                            city: locType.value === 'remote' ? '' : formData.city,
                            state: locType.value === 'remote' ? '' : formData.state
                          })}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            formData.locationType === locType.value
                              ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                          }`}
                        >
                          <div className="text-2xl mb-2">{locType.icon}</div>
                          <div className={`text-sm font-medium mb-1 ${
                            formData.locationType === locType.value
                              ? 'text-gseed-700 dark:text-gseed-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {locType.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {locType.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City & State */}
                  {formData.locationType && formData.locationType !== 'remote' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent"
                          placeholder="Ex: São Paulo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Faixa Salarial (Mensal) *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {jobSalaryRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setFormData({ ...formData, budgetRange: range.id })}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            formData.budgetRange === range.id
                              ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                          }`}
                        >
                          <DollarSign size={20} className={`mx-auto mb-2 ${
                            formData.budgetRange === range.id
                              ? 'text-gseed-600 dark:text-gseed-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.budgetRange === range.id
                              ? 'text-gseed-700 dark:text-gseed-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {range.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5: Budget & Deadline (Só para Projetos) */}
          {currentStep === 5 && type === 'projeto' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Orçamento e Prazo
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Defina o investimento e quando precisa do projeto pronto
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Orçamento do Projeto *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {projectBudgetRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setFormData({ ...formData, budgetRange: range.id })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.budgetRange === range.id
                          ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <DollarSign size={20} className={`mx-auto mb-2 ${
                        formData.budgetRange === range.id
                          ? 'text-gseed-600 dark:text-gseed-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.budgetRange === range.id
                          ? 'text-gseed-700 dark:text-gseed-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {range.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Prazo de Entrega
                </label>
                
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    !formData.hasDeadline 
                      ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                  }`}>
                    <input
                      type="radio"
                      checked={!formData.hasDeadline}
                      onChange={() => setFormData({ ...formData, hasDeadline: false, deadline: '' })}
                      className="w-4 h-4 text-gseed-600 focus:ring-gseed-500"
                    />
                    <div>
                      <span className={`text-sm font-medium ${
                        !formData.hasDeadline 
                          ? 'text-gseed-700 dark:text-gseed-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Sem prazo definido
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Negociar prazo com o profissional contratado
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.hasDeadline 
                      ? 'border-gseed-500 dark:border-gseed-400 bg-gseed-50 dark:bg-gseed-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                  }`}>
                    <input
                      type="radio"
                      checked={formData.hasDeadline}
                      onChange={() => setFormData({ ...formData, hasDeadline: true })}
                      className="w-4 h-4 text-gseed-600 focus:ring-gseed-500"
                    />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${
                        formData.hasDeadline 
                          ? 'text-gseed-700 dark:text-gseed-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Com prazo definido
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 mb-2">
                        Especifique a data limite de entrega
                      </p>
                      {formData.hasDeadline && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gseed-600 dark:text-gseed-400" />
                          <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-gseed-500 dark:focus:ring-gseed-400 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong className="block mb-1">Dica para definir orçamento:</strong>
                  <p>
                    Projetos com orçamento definido tendem a receber mais propostas de qualidade. 
                    Se não tem certeza do valor, escolha "Aberto a propostas" e negocie com os profissionais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Anterior</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-gseed-600 dark:bg-gseed-500 text-white hover:bg-gseed-700 dark:hover:bg-gseed-600 shadow-sm hover:shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Próximo</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed() && !loading
                    ? 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 shadow-sm hover:shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Criar {type === 'vaga' ? 'Vaga' : 'Projeto'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
