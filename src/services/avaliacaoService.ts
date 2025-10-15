import { supabase } from '../lib/supabase';

export interface Avaliacao {
  id: string;
  professional_id: string;
  client_id: string;
  client_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CreateAvaliacaoData {
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string;
}

class AvaliacaoService {
  // Verificar se o cliente já contratou o profissional
  async hasHiredProfessional(clientId: string, professionalId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .eq('status', 'completed')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar contratação:', error);
      return false;
    }
  }

  // Verificar se o cliente já avaliou o profissional
  async hasAlreadyReviewed(clientId: string, professionalId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar avaliação:', error);
      return false;
    }
  }

  // Criar nova avaliação
  async createAvaliacao(data: CreateAvaliacaoData): Promise<Avaliacao | null> {
    try {
      // Verificar se já contratou
      const hasHired = await this.hasHiredProfessional(data.client_id, data.professional_id);
      if (!hasHired) {
        throw new Error('Você precisa ter contratado este profissional para avaliá-lo');
      }

      // Verificar se já avaliou
      const hasReviewed = await this.hasAlreadyReviewed(data.client_id, data.professional_id);
      if (hasReviewed) {
        throw new Error('Você já avaliou este profissional');
      }

      // Buscar nome do cliente
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.client_id)
        .single();

      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          professional_id: data.professional_id,
          client_id: data.client_id,
          client_name: profile?.full_name || 'Cliente',
          rating: data.rating,
          comment: data.comment
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar média de avaliação do profissional
      await this.updateProfessionalRating(data.professional_id);

      return review;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  }

  // Buscar avaliações de um profissional
  async getAvaliacoesByProfessional(professionalId: string): Promise<Avaliacao[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      return [];
    }
  }

  // Calcular média de avaliação
  async getProfessionalRating(professionalId: string): Promise<{
    average: number;
    total: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', professionalId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { average: 0, total: 0 };
      }

      const total = data.length;
      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / total;

      return { average, total };
    } catch (error) {
      console.error('Erro ao calcular rating:', error);
      return { average: 0, total: 0 };
    }
  }

  // Atualizar média de avaliação no perfil do profissional
  private async updateProfessionalRating(professionalId: string): Promise<void> {
    try {
      const { average, total } = await this.getProfessionalRating(professionalId);

      await supabase
        .from('professional_profiles')
        .update({
          average_rating: average,
          total_reviews: total
        })
        .eq('id', professionalId);
    } catch (error) {
      console.error('Erro ao atualizar rating do profissional:', error);
    }
  }
}

export const avaliacaoService = new AvaliacaoService();
