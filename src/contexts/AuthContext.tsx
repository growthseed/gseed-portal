import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      // Mensagens de erro mais amigáveis
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos')
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Confirme seu email antes de fazer login. Verifique sua caixa de entrada.')
      } else {
        toast.error(error.message || 'Erro ao fazer login')
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('🔵 Iniciando cadastro...', { email, metadata })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('❌ Erro Supabase:', error)
        
        // Tratar erro específico de envio de email
        if (error.message?.includes('sending confirmation email') || 
            error.message?.includes('Error sending email')) {
          console.warn('⚠️ Conta criada mas email não enviado')
          toast.warning('Conta criada! Não foi possível enviar email de confirmação. Você já pode fazer login.')
          // Não bloquear o cadastro - deixar o usuário continuar
          return
        }
        
        throw error
      }
      
      console.log('✅ Resposta Supabase:', data)
      
      // Verificar se precisa de confirmação de email
      if (data.user && !data.session) {
        // Email de confirmação foi enviado
        toast.info('Cadastro realizado! Verifique seu email para confirmar sua conta.')
      } else if (data.user && data.session) {
        // Usuário criado e já está logado (confirmação desabilitada)
        toast.success('Cadastro realizado com sucesso!')
      } else {
        // Caso inesperado
        toast.success('Cadastro iniciado com sucesso!')
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao criar conta:', error)
      
      // Mensagens de erro mais amigáveis
      if (error.message?.includes('already registered') || 
          error.message?.includes('User already registered')) {
        toast.error('Este email já está cadastrado. Faça login ou recupere sua senha.')
      } else if (error.message?.includes('invalid email')) {
        toast.error('Email inválido')
      } else if (error.message?.includes('password')) {
        toast.error('Senha muito fraca. Use pelo menos 6 caracteres com letras e números')
      } else {
        toast.error(error.message || 'Erro ao fazer cadastro')
      }
      
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logout realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout')
      throw error
    }
  }

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      })
      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
