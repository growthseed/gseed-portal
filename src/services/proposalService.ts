import { supabase } from '@/lib/supabase';
import { notificationService } from './notifications/notificationService';

export interface ProposalData {
  project_id: string;
  message: string;
  proposed_value: number;
  proposed_deadline: string;
  attachments?: string[];
}

export interface Proposal extends ProposalData {
  id: string;
  professional_id: string;
  user_id: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  is_viewed: boolean;
  viewed_at?: string;
  responded_at?: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
}

class ProposalService {
  async createProposal(proposalData: ProposalData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar professional_profile do usuário
    const { data: professionalProfile, error: profileError } = await supabase
      .from('professional_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !professionalProfile) {
      throw new Error('Perfil profissional não encontrado');
    }

    // Buscar informações do projeto e contratante
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        user_id,
        profiles:user_id (
          id,
          name
        )
      `)
      .eq('id', proposalData.project_id)
      .single();

    if (projectError || !project) {
      throw new Error('Projeto não encontrado');
    }

    // Criar proposta
    const { data, error } = await supabase
      .from('proposals')
      .insert([
        {
          ...proposalData,
          user_id: user.id,
          professional_id: professionalProfile.id,
        }
      ])
      .select(`
        *,
        profiles:user_id (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;

    // Enviar notificação para o contratante
    try {
      await notificationService.notifyNewProposal(
        project.user_id,
        data.profiles?.name || 'Um profissional',
        project.title,
        data.id
      );
    } catch (notifError) {
      console.error('Erro ao enviar notificação:', notifError);
      // Não falhar a criação da proposta por erro na notificação
    }

    return data;
  }

  async getProposal(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        projects (*),
        profiles:user_id (
          id,
          name,
          email,
          avatar_url
        ),
        professional_profiles:professional_id (
          id,
          title,
          skills
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProjectProposals(projectId: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        ),
        professional_profiles:professional_id (
          id,
          title,
          skills,
          hourly_rate,
          portfolio_images
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getUserProposals(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('ID do usuário não fornecido');
    }

    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        projects (
          id,
          title,
          category,
          status,
          profiles:user_id (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data;
  }

  async updateProposal(id: string, updates: Partial<ProposalData>) {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProposalStatus(
    id: string, 
    status: 'under_review' | 'accepted' | 'rejected',
    response_message?: string
  ) {
    // Buscar informações da proposta antes de atualizar
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        id,
        user_id,
        project_id,
        projects (
          id,
          title
        )
      `)
      .eq('id', id)
      .single();

    if (proposalError || !proposal) {
      throw new Error('Proposta não encontrada');
    }

    // Atualizar status
    const { data, error } = await supabase
      .from('proposals')
      .update({
        status,
        response_message,
        responded_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação para o profissional
    try {
      if (status === 'accepted') {
        await notificationService.notifyProposalAccepted(
          proposal.user_id,
          proposal.projects?.title || 'o projeto',
          proposal.id
        );
      } else if (status === 'rejected') {
        await notificationService.notifyProposalRejected(
          proposal.user_id,
          proposal.projects?.title || 'o projeto',
          proposal.id
        );
      }
    } catch (notifError) {
      console.error('Erro ao enviar notificação:', notifError);
      // Não falhar a atualização por erro na notificação
    }

    return data;
  }

  async markAsViewed(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .update({
        is_viewed: true,
        viewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async withdrawProposal(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .update({
        status: 'withdrawn',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProposal(id: string) {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const proposalService = new ProposalService();
