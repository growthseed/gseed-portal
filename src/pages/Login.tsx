import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { validateForm, validationSchemas, ValidationErrors } from '@/lib/validation'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

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
    
    const validationErrors = validateForm(formData, validationSchemas.login)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError)
      return
    }

    setLoading(true)
    try {
      await signIn(formData.email, formData.password)
      navigate('/perfil')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">G</span>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {t('auth.login.title')}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.login.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-gseed-500 focus:border-gseed-500 dark:focus:ring-gseed-400 dark:focus:border-gseed-400 ${
                    errors.email ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
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
                {t('auth.login.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-gseed-500 focus:border-gseed-500 dark:focus:ring-gseed-400 dark:focus:border-gseed-400 ${
                    errors.password ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' : ''
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 dark:border-gray-600 text-gseed-600 focus:ring-gseed-500 dark:bg-gray-700 dark:checked:bg-gseed-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('auth.login.rememberMe')}</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-gseed-600 dark:text-gseed-400 hover:underline"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gseed-600 hover:bg-gseed-700 text-white" 
              disabled={loading}
            >
              {loading ? t('auth.login.signingIn') : t('auth.login.signInButton')}
            </Button>
            
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <Link 
                to="/register" 
                className="text-gseed-600 dark:text-gseed-400 hover:underline font-medium"
              >
                {t('auth.login.signUpLink')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
