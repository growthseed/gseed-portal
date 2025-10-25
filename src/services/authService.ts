import { supabase } from '@/lib/supabase';

// Usar variável de ambiente ou fallback para localhost
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

class AuthService {
  /**
   * Criar conta - USA EMAIL NATIVO DO SUPABASE
   * Requer confirmação de email antes de fazer login
   */
  async signUp(email: string, password: string, name: string) {
    try {
      console.log('🔵 Iniciando cadastro...', { email, name });

      // Criar conta no Supabase COM confirmação de email obrigatória
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${SITE_URL}/auth/callback`
        }
      });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        throw error;
      }

      console.log('✅ Conta criada com sucesso');

      return {
        success: true,
        data,
        message: 'Conta criada! Verifique seu email para confirmar o cadastro antes de fazer login.'
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar conta:', error);
      
      // Mensagem amigável para erros comuns
      let friendlyMessage = 'Erro ao criar conta';
      
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        friendlyMessage = 'Este email já está cadastrado. Faça login ou recupere sua senha.';
      } else if (error.message?.includes('invalid email')) {
        friendlyMessage = 'Email inválido';
      } else if (error.message?.includes('password')) {
        friendlyMessage = 'Senha muito fraca. Use pelo menos 6 caracteres';
      }

      return {
        success: false,
        message: friendlyMessage
      };
    }
  }

  /**
   * Login
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Login realizado com sucesso!'
      };
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      let friendlyMessage = 'Erro ao fazer login';
      
      if (error.message?.includes('Invalid login credentials')) {
        friendlyMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        friendlyMessage = 'Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada.';
      }

      return {
        success: false,
        message: friendlyMessage
      };
    }
  }

  /**
   * Solicitar recuperação de senha - USA EMAIL NATIVO SUPABASE
   */
  async requestPasswordReset(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/reset-password`,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
      };
    } catch (error: any) {
      console.error('❌ Erro ao solicitar recuperação:', error);
      return {
        success: false,
        message: 'Erro ao enviar email de recuperação'
      };
    }
  }

  /**
   * Atualizar senha com token
   */
  async updatePasswordWithToken(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Senha atualizada com sucesso!'
      };
    } catch (error: any) {
      console.error('❌ Erro ao atualizar senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao atualizar senha'
      };
    }
  }

  /**
   * Alterar senha (com verificação da senha atual)
   */
  async changePassword(email: string, oldPassword: string, newPassword: string) {
    try {
      // 1. Verificar se a senha atual está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword
      });

      if (signInError) {
        return {
          success: false,
          message: 'Senha atual incorreta'
        };
      }

      // 2. Atualizar para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Senha alterada com sucesso!'
      };
    } catch (error: any) {
      console.error('❌ Erro ao alterar senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao alterar senha'
      };
    }
  }

  /**
   * Logout
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: 'Logout realizado com sucesso!'
      };
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      return {
        success: false,
        message: error.message || 'Erro ao fazer logout'
      };
    }
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
  }

  /**
   * Verificar se email está em uso
   */
  async checkEmailExists(email: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      return !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Reenviar email de confirmação
   */
  async resendConfirmationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Email de confirmação reenviado!'
      };
    } catch (error: any) {
      console.error('❌ Erro ao reenviar email:', error);
      return {
        success: false,
        message: 'Erro ao reenviar email de confirmação'
      };
    }
  }
}

export const authService = new AuthService();
