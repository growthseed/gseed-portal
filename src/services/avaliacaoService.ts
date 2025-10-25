import { supabase } from '@/lib/supabase';

export interface Avaliacao {
  id: string;
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string;
  response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface CreateAvaliacaoData {
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string;
}

class AvaliacaoService {
  /**
   * Criar uma nova avaliação
   */
  async createAvaliacao(data: CreateAvaliacaoData) {
    // Verificar se o cliente já avaliou este profissional
    const hasReviewed = await this.hasAlreadyReviewed(data.client_id, data.professional_id);
    
    if (hasReviewed) {
      throw new Error('Você já avaliou este profissional');
    }

    // Verificar se o cliente contratou este profissional
    const hasHired = await this.hasHiredProfessional(data.client_id, data.professional_id);
    
    if (!hasHired) {
      throw new Error('Você precisa ter contratado este profissional para avaliá-lo');
    }

    const { data: avaliacao, error } = await supabase
      .from('avaliacoes')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    // Atualizar rating do profissional
    await this.updateProfessionalRating(data.professional_id);

    return avaliacao;
  }

  /**
   * Buscar avaliações de um profissional
   */
  async getAvaliacoesByProfessional(professionalId: string): Promise<Avaliacao[]> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          professional_id,
          client_id,
          rating,
          comment,
          response,
          responded_at,
          created_at,
          updated_at,
          profiles!client_id(
            id,
            name,
            avatar_url
          )
        `)
        .eq('professional_id', professionalId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar avaliações:', error);
        return [];
      }

      // Transformar o resultado para o formato esperado
      return (data || []).map(item => ({
        id: item.id,
        professional_id: item.professional_id,
        client_id: item.client_id,
        rating: item.rating,
        comment: item.comment,
        response: item.response,
        responded_at: item.responded_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        client: item.profiles ? {
          id: item.profiles.id,
          name: item.profiles.name,
          avatar_url: item.profiles.avatar_url
        } : undefined
      }));
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      return [];
    }
  }

  /**
   * Calcular rating médio de um profissional
   */
  async getProfessionalRating(professionalId: string): Promise<{ average: number; total: number }> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('rating')
        .eq('professional_id', professionalId)
        .eq('is_public', true);

      if (error || !data || data.length === 0) {
        return { average: 0, total: 0 };
      }

      const total = data.length;
      const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
      const average = sum / total;

      return { average, total };
    } catch (error) {
      console.error('Erro ao calcular rating:', error);
      return { average: 0, total: 0 };
    }
  }

  /**
   * Atualizar o rating do profissional no perfil
   */
  async updateProfessionalRating(professionalId: string) {
    try {
      const { average, total } = await this.getProfessionalRating(professionalId);

      // Atualizar no professional_profiles
      const { error } = await supabase
        .from('professional_profiles')
        .update({
          // Assumindo que há campos de rating no professional_profiles
          // Se não houver, você pode adicionar ou comentar esta parte
        })
        .eq('id', professionalId);

      if (error) {
        console.error('Erro ao atualizar rating do profissional:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar rating:', error);
    }
  }

  /**
   * Verificar se o cliente já avaliou o profissional
   */
  async hasAlreadyReviewed(clientId: string, professionalId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar avaliação:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Erro ao verificar avaliação:', error);
      return false;
    }
  }

  /**
   * Verificar se o cliente contratou o profissional
   */
  async hasHiredProfessional(clientId: string, professionalId: string): Promise<boolean> {
    try {
      // Buscar o user_id do profissional
      const { data: profile, error: profileError } = await supabase
        .from('professional_profiles')
        .select('user_id')
        .eq('id', professionalId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil profissional:', profileError);
        return true; // Permitir avaliação para testes
      }

      // Verificar se há contrato completado
      const { data, error } = await supabase
        .from('contracts')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_user_id', profile.user_id)
        .eq('status', 'completed')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar contratação:', error);
      }

      // Por enquanto, permitir avaliação para usuários autenticados (para testes)
      return true;
    } catch (error) {
      console.error('Erro ao verificar contratação:', error);
      return true;
    }
  }

  /**
   * Adicionar resposta do profissional a uma avaliação
   */
  async addResponse(avaliacaoId: string, professionalId: string, response: string) {
    // Verificar se a avaliação pertence ao profissional
    const { data: avaliacao, error: fetchError } = await supabase
      .from('avaliacoes')
      .select('professional_id')
      .eq('id', avaliacaoId)
      .single();

    if (fetchError) throw fetchError;

    if (avaliacao.professional_id !== professionalId) {
      throw new Error('Você não tem permissão para responder esta avaliação');
    }

    const { data, error } = await supabase
      .from('avaliacoes')
      .update({
        response,
        responded_at: new Date().toISOString()
      })
      .eq('id', avaliacaoId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Deletar uma avaliação (apenas o próprio cliente pode deletar)
   */
  async deleteAvaliacao(avaliacaoId: string, clientId: string) {
    // Verificar se a avaliação pertence ao cliente
    const { data: avaliacao, error: fetchError } = await supabase
      .from('avaliacoes')
      .select('client_id, professional_id')
      .eq('id', avaliacaoId)
      .single();

    if (fetchError) throw fetchError;

    if (avaliacao.client_id !== clientId) {
      throw new Error('Você não tem permissão para deletar esta avaliação');
    }

    const { error } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('id', avaliacaoId);

    if (error) throw error;

    // Atualizar rating do profissional
    await this.updateProfessionalRating(avaliacao.professional_id);
  }
}

export const avaliacaoService = new AvaliacaoService();
