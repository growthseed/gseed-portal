import { supabase } from '@/lib/supabase';

export interface Avaliacao {
  id: string;
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string;
  response?: string;
  response_date?: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    full_name: string;
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
    const { data, error } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        client:profiles!client_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Calcular rating médio de um profissional
   */
  async getProfessionalRating(professionalId: string): Promise<{ average: number; total: number }> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('rating')
      .eq('professional_id', professionalId);

    if (error || !data || data.length === 0) {
      return { average: 0, total: 0 };
    }

    const total = data.length;
    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / total;

    return { average, total };
  }

  /**
   * Atualizar o rating do profissional no perfil
   */
  async updateProfessionalRating(professionalId: string) {
    const { average, total } = await this.getProfessionalRating(professionalId);

    const { error } = await supabase
      .from('profiles')
      .update({
        rating: average,
        reviews_count: total
      })
      .eq('id', professionalId);

    if (error) {
      console.error('Erro ao atualizar rating do profissional:', error);
    }
  }

  /**
   * Verificar se o cliente já avaliou o profissional
   */
  async hasAlreadyReviewed(clientId: string, professionalId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('client_id', clientId)
      .eq('professional_id', professionalId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar avaliação:', error);
    }

    return !!data;
  }

  /**
   * Verificar se o cliente contratou o profissional
   * NOTA: Esta função precisa ser implementada com base no sistema de contratação
   * Por enquanto, vamos retornar true para permitir testes
   */
  async hasHiredProfessional(clientId: string, professionalId: string): Promise<boolean> {
    // TODO: Implementar verificação real quando o sistema de contratação estiver pronto
    // Por enquanto, verificamos se existe algum registro na tabela de contratos/projetos
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .eq('status', 'completed')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar contratação:', error);
      }

      // Se não houver tabela de contratos ainda, permitir avaliação por usuários autenticados
      // Isso pode ser ajustado conforme a necessidade
      return true; // Temporário para permitir testes
    } catch (error) {
      console.error('Erro ao verificar contratação:', error);
      return true; // Temporário para permitir testes
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
        response_date: new Date().toISOString()
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
