import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(true)
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
    
    if (!userType) {
      toast.error(t('auth.register.selectUserType'))
      setShowModal(true)
      return
    }

    if (!acceptTerms) {
      toast.error(t('auth.register.acceptTermsRequired'))
      return
    }

    const validationErrors = validateForm(formData, validationSchemas.register)
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = t('auth.errors.passwordsDontMatch')
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
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
      toast.success(t('auth.register.accountCreated'))
      navigate('/onboarding')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

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
            {t('auth.register.title')}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            {t('auth.register.youChose')} <span className="font-semibold text-gseed-600 dark:text-gseed-400">
              {userType === 'professional' ? t('auth.register.professional') : t('auth.register.contractor')}
            </span>
            <button 
              onClick={() => setShowModal(true)}
              className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('auth.register.change')}
            </button>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="text"
                  placeholder={t('auth.register.fullNamePlaceholder')}
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
                {t('auth.register.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
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
                {t('auth.register.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.register.passwordPlaceholder')}
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
                {t('auth.register.confirmPasswordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
                {t('auth.register.phone')} <span className="text-gray-400 dark:text-gray-500">{t('auth.register.phoneOptional')}</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder={t('auth.register.phonePlaceholder')}
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
                {t('auth.register.agreeToTerms')}{' '}
                <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('auth.register.termsOfUse')}
                </Link>{' '}
                {t('auth.register.and')}{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('auth.register.privacyPolicy')}
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
              {loading ? t('auth.register.creatingAccount') : t('auth.register.createAccountButton')}
            </Button>
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              {t('auth.register.haveAccount')}{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {t('auth.register.signInLink')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
