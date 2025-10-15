import { supabase } from '@/lib/supabase';

export interface UserPreferences {
  // Notificações Email
  email_notifications: boolean;
  email_new_proposals: boolean;
  email_messages: boolean;
  email_project_updates: boolean;
  
  // Notificações Push
  push_notifications: boolean;
  push_new_proposals: boolean;
  push_messages: boolean;
  push_project_updates: boolean;
  
  // Privacidade
  profile_visibility: 'public' | 'private' | 'connections_only';
  show_email_public: boolean;
  show_phone_public: boolean;
  show_whatsapp_public: boolean;
  
  // Marketing
  marketing_emails: boolean;
}

class PreferencesService {
  /**
   * Obter preferências do usuário
   */
  async getPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      // Se não existir, retornar valores padrão
      if (!data) {
        return {
          success: true,
          data: this.getDefaultPreferences(),
          message: 'Usando preferências padrão'
        };
      }

      return {
        success: true,
        data,
        message: 'Preferências carregadas'
      };
    } catch (error: any) {
      console.error('Erro ao carregar preferências:', error);
      return {
        success: false,
        message: error.message || 'Erro ao carregar preferências',
        data: this.getDefaultPreferences()
      };
    }
  }

  /**
   * Salvar ou atualizar preferências
   */
  async savePreferences(userId: string, preferences: Partial<UserPreferences>) {
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Atualizar
        const { error } = await supabase
          .from('user_preferences')
          .update(preferences)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Inserir
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            ...preferences
          });

        if (error) throw error;
      }

      return {
        success: true,
        message: 'Preferências salvas com sucesso!'
      };
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error);
      return {
        success: false,
        message: error.message || 'Erro ao salvar preferências'
      };
    }
  }

  /**
   * Preferências padrão
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      email_notifications: true,
      email_new_proposals: true,
      email_messages: true,
      email_project_updates: true,
      
      push_notifications: true,
      push_new_proposals: true,
      push_messages: true,
      push_project_updates: true,
      
      profile_visibility: 'public',
      show_email_public: false,
      show_phone_public: false,
      show_whatsapp_public: true,
      
      marketing_emails: false
    };
  }
}

export const preferencesService = new PreferencesService();
