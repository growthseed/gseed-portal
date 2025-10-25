import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

type VerifyStatus = 'loading' | 'success' | 'error' | 'waiting';

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('waiting')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    // Verificar se há um usuário logado (significa que confirmou o email)
    const checkEmailConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        if (session.user.email_confirmed_at) {
          setStatus('success')
          toast.success('Email verificado com sucesso!')
          
          // Redirecionar para onboarding após 2 segundos
          setTimeout(() => {
            navigate('/onboarding')
          }, 2000)
        }
      }
    }

    checkEmailConfirmation()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        setStatus('success')
        toast.success('Email verificado com sucesso!')
        
        setTimeout(() => {
          navigate('/onboarding')
        }, 2000)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error('Por favor, informe seu email')
      return
    }
    
    setStatus('loading')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      })

      if (error) {
        toast.error('Erro ao reenviar email: ' + error.message)
        setStatus('error')
      } else {
        toast.success('Email de confirmação reenviado!')
        setStatus('waiting')
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error)
      toast.error('Erro ao reenviar email')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'waiting' && (
            <>
              <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <CardTitle className="text-2xl">Verifique seu email</CardTitle>
              <CardDescription>
                Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta.
              </CardDescription>
            </>
          )}

          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
              <CardTitle className="text-2xl">Verificando...</CardTitle>
              <CardDescription>Aguarde enquanto processamos sua solicitação</CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-2xl text-green-600">Email Verificado!</CardTitle>
              <CardDescription>Seu email foi confirmado com sucesso</CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <CardTitle className="text-2xl text-red-600">Erro</CardTitle>
              <CardDescription>Houve um problema ao processar sua solicitação</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800">
                🎉 Redirecionando para completar seu perfil em 2 segundos...
              </p>
            </div>
          )}

          {(status === 'waiting' || status === 'loading') && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 text-center space-y-2">
                  <span className="block">📧 Verifique sua caixa de entrada</span>
                  <span className="block">⏰ O email pode demorar até 5 minutos</span>
                  <span className="block">📁 Não se esqueça de verificar a pasta de SPAM</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Seu email:</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <Button
                onClick={handleResendEmail}
                disabled={!userEmail || status === 'loading'}
                className="w-full"
                variant="outline"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar Email de Confirmação
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="flex-1"
            >
              Voltar para Login
            </Button>
            
            {status === 'success' && (
              <Button
                onClick={() => navigate('/onboarding')}
                className="flex-1"
              >
                Continuar
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Email de: noreply@mail.supabase.io</p>
            <p className="mt-1">Se não receber, verifique seu SPAM</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
