import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User, Briefcase, Users } from 'lucide-react'
import { toast } from 'sonner'
import { validateForm, validateField, validationSchemas, ValidationErrors } from '@/lib/validation'
import { PasswordStrength } from '@/components/ui/PasswordStrength'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'professional' | 'contractor'>('professional')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [acceptTerms, setAcceptTerms] = useState(false)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Criar Conta no GSeed Portal
          </CardTitle>
          <CardDescription className="text-center">
            Escolha seu tipo de conta e preencha os dados
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('professional')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'professional'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Briefcase className={`mx-auto mb-2 ${
                  userType === 'professional' ? 'text-blue-600' : 'text-gray-400'
                }`} size={24} />
                <span className={`text-sm font-medium ${
                  userType === 'professional' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Profissional
                </span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('contractor')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'contractor'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className={`mx-auto mb-2 ${
                  userType === 'contractor' ? 'text-blue-600' : 'text-gray-400'
                }`} size={24} />
                <span className={`text-sm font-medium ${
                  userType === 'contractor' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Contratante
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha forte"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              {formData.password && (
                <div className="mt-3">
                  <PasswordStrength password={formData.password} showRequirements={true} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Telefone <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 mt-1" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label className="text-sm text-gray-600">
                Concordo com os{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
