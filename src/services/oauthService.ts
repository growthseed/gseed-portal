/**
 * Serviço de Autenticação OAuth
 * Suporta: Google, LinkedIn, GitHub
 */

import { supabase } from '@/lib/supabase';

export type OAuthProvider = 'google' | 'linkedin_oidc' | 'github';

interface SignInWithOAuthOptions {
  provider: OAuthProvider;
  redirectTo?: string;
}

class OAuthService {
  /**
   * Login com provedor OAuth (Google, LinkedIn, GitHub)
   */
  async signInWithOAuth({ provider, redirectTo }: SignInWithOAuthOptions) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
      return {
        success: false,
        error: error.message || `Erro ao fazer login com ${provider}`,
      };
    }
  }

  /**
   * Login com Google
   */
  async signInWithGoogle(redirectTo?: string) {
    return this.signInWithOAuth({ provider: 'google', redirectTo });
  }

  /**
   * Login com LinkedIn
   */
  async signInWithLinkedIn(redirectTo?: string) {
    return this.signInWithOAuth({ provider: 'linkedin_oidc', redirectTo });
  }

  /**
   * Login com GitHub
   */
  async signInWithGitHub(redirectTo?: string) {
    return this.signInWithOAuth({ provider: 'github', redirectTo });
  }

  /**
   * Extrair informações do perfil OAuth
   */
  async getOAuthProfile() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata.full_name || user.user_metadata.name,
        avatarUrl: user.user_metadata.avatar_url || user.user_metadata.picture,
        provider: user.app_metadata.provider,
        providerData: user.user_metadata,
      };
    } catch (error: any) {
      console.error('Erro ao obter perfil OAuth:', error);
      return null;
    }
  }

  /**
   * Sincronizar dados do LinkedIn com perfil profissional
   */
  async syncLinkedInProfile() {
    const profile = await this.getOAuthProfile();
    
    if (!profile || profile.provider !== 'linkedin_oidc') {
      return { success: false, error: 'Não está logado com LinkedIn' };
    }

    try {
      const linkedInData = profile.providerData;
      
      // Atualizar perfil no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: linkedInData.name || profile.fullName,
          avatar_url: linkedInData.picture || profile.avatarUrl,
          bio: linkedInData.headline || null,
          location_city: linkedInData.location?.name || null,
          // Adicionar mais campos conforme necessário
        })
        .eq('id', profile.id);

      if (error) throw error;

      return { success: true, data: linkedInData };
    } catch (error: any) {
      console.error('Erro ao sincronizar perfil LinkedIn:', error);
      return { success: false, error: error.message };
    }
  }
}

export const oauthService = new OAuthService();
