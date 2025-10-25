import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { validateForm, ValidationErrors, validationSchemas } from '@/lib/validation'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { OnboardingChoiceModal } from '@/components/onboarding/OnboardingChoiceModal'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(true) // MODAL APARECE PRIMEIRO
  const [userType, setUserType] = useState<'professional' | 'contractor' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSelectUserType = (type: 'professional' | 'contractor') => {
    setUserType(type)
    setShowModal(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar tipo de usuário
    if (!userType) {
      toast.error('Selecione o tipo de conta')
      setShowModal(true)
      return
    }

    // Validar termos de uso
    if (!acceptTerms) {
      toast.error('Você precisa aceitar os termos de uso para continuar')
      return
    }

    // Validar formulário base
    const validationErrors = validateForm(formData, validationSchemas.register)
    
    // Validação adicional: confirmar senha
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'As senhas não coincidem'
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Mostrar primeiro erro
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError)
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        user_type: userType,
        phone: formData.phone || null
      })
      toast.success('Conta criada com sucesso! Complete seu perfil.')
      navigate('/onboarding')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Se o modal estiver aberto, mostrar apenas o modal
  if (showModal) {
    return (
      <OnboardingChoiceModal
        isOpen={showModal}
        onClose={() => navigate('/')}
        onSelectContratante={() => handleSelectUserType('contractor')}
        onSelectProfissional={() => handleSelectUserType('professional')}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Criar Conta no GSeed Portal
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Você escolheu: <span className="font-semibold text-gseed-600 dark:text-gseed-400">
              {userType === 'professional' ? 'Profissional' : 'Contratante'}
            </span>
            <button 
              onClick={() => setShowModal(true)}
              className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              (trocar)
            </button>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  style={{
                    WebkitTextFillColor: 'inherit',
                    WebkitBoxShadow: '0 0 0 1000px transparent inset'
                  }}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  style={{
                    WebkitTextFillColor: 'inherit',
                    WebkitBoxShadow: '0 0 0 1000px transparent inset'
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha forte"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  style={{
                    WebkitTextFillColor: 'inherit',
                    WebkitBoxShadow: '0 0 0 1000px transparent inset'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
              {formData.password && (
                <div className="mt-3">
                  <PasswordStrength password={formData.password} showRequirements={true} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  style={{
                    WebkitTextFillColor: 'inherit',
                    WebkitBoxShadow: '0 0 0 1000px transparent inset'
                  }}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  style={{
                    WebkitTextFillColor: 'inherit',
                    WebkitBoxShadow: '0 0 0 1000px transparent inset'
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 dark:border-gray-600 mt-1 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-600" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Concordo com os{' '}
                <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Política de Privacidade
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
