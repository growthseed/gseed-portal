import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database.types';

interface ProfessionalFilters {
  search?: string;
  skills?: string[];
  location?: string;
  min_rate?: number;
  max_rate?: number;
  min_rating?: number;
  is_available?: boolean;
  is_asdrm_member?: boolean;
}

class ProfessionalService {
  /**
   * Buscar todos os profissionais com filtros
   */
  async getAll(filters?: ProfessionalFilters) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          professional:professional_profiles!user_id (
            title,
            professional_bio,
            skills,
            hourly_rate,
            availability,
            views_count
          )
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
      }

      if (filters?.location) {
        query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
      }

      if (filters?.is_asdrm_member !== undefined) {
        query = query.eq('is_asdrm_member', filters.is_asdrm_member);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filtros adicionais no lado do cliente (para campos do professional_profiles)
      let filteredData = data || [];

      if (filters?.min_rate && filters.min_rate > 0) {
        filteredData = filteredData.filter(p => 
          p.professional?.hourly_rate && p.professional.hourly_rate >= filters.min_rate!
        );
      }

      if (filters?.max_rate && filters.max_rate > 0) {
        filteredData = filteredData.filter(p => 
          p.professional?.hourly_rate && p.professional.hourly_rate <= filters.max_rate!
        );
      }

      if (filters?.is_available !== undefined) {
        filteredData = filteredData.filter(p => 
          p.professional?.availability === 'freelance' || p.professional?.availability === 'part_time'
        );
      }

      return {
        success: true,
        data: filteredData,
        message: `${filteredData.length} profissionais encontrados`
      };
    } catch (error: any) {
      console.error('Erro ao buscar profissionais:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Erro ao buscar profissionais'
      };
    }
  }

  /**
   * Buscar profissional por ID
   */
  async getById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          professional:professional_profiles!user_id (
            *
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Mesclar dados do perfil profissional no perfil principal
      const mergedData = {
        ...data,
        professional_title: data.professional?.title,
        professional_bio: data.professional?.professional_bio,
        skills: data.professional?.skills || [],
        hourly_rate: data.professional?.hourly_rate,
        availability: data.professional?.availability,
        is_available: data.professional?.availability === 'freelance' || data.professional?.availability === 'part_time',
        views_count: data.professional?.views_count || 0,
        portfolio: data.professional?.portfolio_images || [],
        services: [], // TODO: Implementar quando tivermos tabela de serviços
        rating: null, // TODO: Calcular quando tivermos reviews
        reviews_count: 0, // TODO: Contar quando tivermos reviews
        completed_projects: 0, // TODO: Contar quando tivermos projetos concluídos
        response_time: '< 1h', // TODO: Calcular quando tivermos mensagens
        success_rate: 100, // TODO: Calcular quando tivermos projetos
        availability_hours: 40, // TODO: Pegar do perfil profissional
      };

      return {
        success: true,
        data: mergedData,
        message: 'Profissional encontrado'
      };
    } catch (error: any) {
      console.error('Erro ao buscar profissional:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao buscar profissional'
      };
    }
  }

  /**
   * Criar perfil básico (compatibilidade)
   */
  async createProfile(userId: string, profileData: Partial<Profile>) {
    return this.update(userId, profileData);
  }

  /**
   * Criar perfil profissional
   */
  async createProfessionalProfile(userId: string, professionalData: any) {
    return this.updateProfessional(userId, professionalData);
  }

  /**
   * Atualizar perfil
   */
  async update(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Perfil atualizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao atualizar perfil'
      };
    }
  }

  /**
   * Atualizar perfil profissional
   */
  async updateProfessional(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .upsert({ 
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Perfil profissional atualizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil profissional:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao atualizar perfil profissional'
      };
    }
  }

  /**
   * Incrementar visualizações do perfil
   */
  async incrementViews(userId: string) {
    try {
      // Incrementar no perfil profissional
      const { data: professional } = await supabase
        .from('professional_profiles')
        .select('views_count')
        .eq('user_id', userId)
        .single();

      if (professional) {
        await supabase
          .from('professional_profiles')
          .update({ 
            views_count: (professional.views_count || 0) + 1 
          })
          .eq('user_id', userId);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao incrementar visualizações:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Buscar profissionais por habilidade
   */
  async getBySkill(skill: string) {
    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profile:profiles!user_id (
            *
          )
        `)
        .contains('skills', [skill]);

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: `${data?.length || 0} profissionais encontrados`
      };
    } catch (error: any) {
      console.error('Erro ao buscar profissionais por habilidade:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Erro ao buscar profissionais'
      };
    }
  }
}

export const professionalService = new ProfessionalService();
