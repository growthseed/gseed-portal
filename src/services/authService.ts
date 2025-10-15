import { supabase } from '@/lib/supabase';
import { brevoService } from './brevoService';

class AuthService {
  /**
   * Solicitar recuperação de senha - USA BREVO
   */
  async requestPasswordReset(email: string) {
    try {
      // 1. Verificar se email existe
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('email', email)
        .single();

      if (!profile) {
        // Não revelar se o email existe ou não (segurança)
        return {
          success: true,
          message: 'Se este email estiver cadastrado, você receberá instruções para recuperar sua senha.'
        };
      }

      // 2. Gerar link de reset via Supabase (mas NÃO envia email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // 3. Enviar email customizado via Brevo
      const resetUrl = `${window.location.origin}/reset-password`; // Supabase adiciona o token automaticamente
      try {
        await brevoService.sendPasswordResetEmail(email, resetUrl, profile.name);
      } catch (emailError) {
        console.error('Erro ao enviar email via Brevo:', emailError);
        // Continua mesmo se falhar
      }

      return {
        success: true,
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
      };
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao enviar email de recuperação'
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
      console.error('Erro ao atualizar senha:', error);
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
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao alterar senha'
      };
    }
  }

  /**
   * Enviar email de verificação - USA BREVO
   */
  async sendVerificationEmail(email: string, userName?: string) {
    try {
      // Gerar link de verificação via Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) throw error;

      // Enviar email via Brevo
      const verificationUrl = `${window.location.origin}/verify-email`;
      try {
        await brevoService.sendVerificationEmail(email, verificationUrl, userName);
      } catch (emailError) {
        console.error('Erro ao enviar email via Brevo:', emailError);
      }

      return {
        success: true,
        message: 'Email de verificação enviado!'
      };
    } catch (error: any) {
      console.error('Erro ao enviar email de verificação:', error);
      return {
        success: false,
        message: error.message || 'Erro ao enviar email'
      };
    }
  }

  /**
   * Criar conta - USA BREVO para emails
   */
  async signUpWithWelcomeEmail(email: string, password: string, name: string) {
    try {
      // 1. Criar conta no Supabase (desabilitar email automático)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) throw error;

      // 2. Enviar email de verificação via Brevo
      const verificationUrl = `${window.location.origin}/verify-email`;
      try {
        await brevoService.sendVerificationEmail(email, verificationUrl, name);
      } catch (emailError) {
        console.error('Erro ao enviar email de verificação:', emailError);
        // Continua mesmo se falhar
      }

      // 3. Enviar email de boas-vindas via Brevo
      try {
        await brevoService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
      }

      // 4. Adicionar à lista de contatos do Brevo (opcional)
      try {
        await brevoService.addContactToList(email, name, 1);
      } catch (listError) {
        console.error('Erro ao adicionar à lista:', listError);
      }

      return {
        success: true,
        data,
        message: 'Conta criada com sucesso! Verifique seu email para confirmar.'
      };
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      return {
        success: false,
        message: error.message || 'Erro ao criar conta'
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
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.message || 'Erro ao fazer login'
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
      console.error('Erro no logout:', error);
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
      console.error('Erro ao obter usuário:', error);
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
}

export const authService = new AuthService();
