import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database.types';

interface ProjectFilters {
  search?: string;
  category?: string;
  work_model?: 'remote' | 'onsite' | 'hybrid';
  min_budget?: number;
  max_budget?: number;
  location?: string;
  skills?: string[];
}

class ProjectService {
  /**
   * Buscar todos os projetos com filtros
   */
  async getAll(filters?: ProjectFilters) {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:profiles!user_id (
            id,
            name,
            email,
            avatar_url,
            company_name,
            phone,
            website
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.work_model) {
        query = query.eq('location_type', filters.work_model);
      }

      if (filters?.min_budget) {
        query = query.gte('budget_min', filters.min_budget);
      }

      if (filters?.max_budget) {
        query = query.lte('budget_max', filters.max_budget);
      }

      if (filters?.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_state.ilike.%${filters.location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: `${data?.length || 0} projetos encontrados`
      };
    } catch (error: any) {
      console.error('Erro ao buscar projetos:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Erro ao buscar projetos'
      };
    }
  }

  /**
   * Buscar projeto por ID com dados do cliente
   */
  async getById(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!user_id (
            id,
            name,
            email,
            avatar_url,
            company_name,
            company_segment:bio,
            company_description:bio,
            phone,
            website
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Projeto encontrado'
      };
    } catch (error: any) {
      console.error('Erro ao buscar projeto:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao buscar projeto'
      };
    }
  }

  /**
   * Criar novo projeto
   */
  async create(projectData: Partial<Project>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Projeto criado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao criar projeto'
      };
    }
  }

  /**
   * Atualizar projeto
   */
  async update(projectId: string, updates: Partial<Project>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Projeto atualizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao atualizar projeto:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao atualizar projeto'
      };
    }
  }

  /**
   * Deletar projeto
   */
  async delete(projectId: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      return {
        success: true,
        message: 'Projeto deletado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao deletar projeto:', error);
      return {
        success: false,
        message: error.message || 'Erro ao deletar projeto'
      };
    }
  }

  /**
   * Incrementar visualizações do projeto
   */
  async incrementViews(projectId: string) {
    try {
      const { data: project } = await supabase
        .from('projects')
        .select('views_count')
        .eq('id', projectId)
        .single();

      if (project) {
        await supabase
          .from('projects')
          .update({ 
            views_count: (project.views_count || 0) + 1 
          })
          .eq('id', projectId);
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
   * Incrementar contador de propostas
   */
  async incrementProposals(projectId: string) {
    try {
      const { data: project } = await supabase
        .from('projects')
        .select('proposals_count')
        .eq('id', projectId)
        .single();

      if (project) {
        await supabase
          .from('projects')
          .update({ 
            proposals_count: (project.proposals_count || 0) + 1 
          })
          .eq('id', projectId);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao incrementar propostas:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Alias para create() - mantém compatibilidade
   */
  async createProject(projectData: Partial<Project>) {
    return this.create(projectData);
  }

  /**
   * Buscar projetos de um usuário específico
   */
  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: `${data?.length || 0} projetos encontrados`
      };
    } catch (error: any) {
      console.error('Erro ao buscar projetos do usuário:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Erro ao buscar projetos'
      };
    }
  }
}

export const projectService = new ProjectService();
