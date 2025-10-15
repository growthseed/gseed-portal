import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'proposal' | 'project' | 'message' | 'system' | 'payment';
  data?: Record<string, any>;
}

class NotificationService {
  /**
   * Criar uma nova notificação
   */
  async createNotification(data: CreateNotificationData) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  /**
   * Buscar notificações do usuário atual
   */
  async getUserNotifications(limit = 50, onlyUnread = false) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (onlyUnread) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro ao contar notificações:', error);
      return 0;
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      throw error;
    }
  }

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  /**
   * Deletar todas as notificações lidas
   */
  async deleteAllRead() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('is_read', true);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar notificações lidas:', error);
      throw error;
    }
  }

  /**
   * Subscrever para novas notificações em tempo real
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // ========== NOTIFICAÇÕES ESPECÍFICAS ==========

  /**
   * Notificar contratante sobre nova proposta
   */
  async notifyNewProposal(contractorId: string, professionalName: string, projectTitle: string, proposalId: string) {
    return this.createNotification({
      user_id: contractorId,
      title: 'Nova Proposta Recebida',
      message: `${professionalName} enviou uma proposta para o projeto "${projectTitle}"`,
      type: 'proposal',
      data: {
        proposalId,
        action: 'new_proposal',
      },
    });
  }

  /**
   * Notificar profissional sobre proposta aceita
   */
  async notifyProposalAccepted(professionalId: string, projectTitle: string, proposalId: string) {
    return this.createNotification({
      user_id: professionalId,
      title: '🎉 Proposta Aceita!',
      message: `Sua proposta para o projeto "${projectTitle}" foi aceita!`,
      type: 'proposal',
      data: {
        proposalId,
        action: 'proposal_accepted',
      },
    });
  }

  /**
   * Notificar profissional sobre proposta recusada
   */
  async notifyProposalRejected(professionalId: string, projectTitle: string, proposalId: string) {
    return this.createNotification({
      user_id: professionalId,
      title: 'Proposta Recusada',
      message: `Sua proposta para o projeto "${projectTitle}" foi recusada.`,
      type: 'proposal',
      data: {
        proposalId,
        action: 'proposal_rejected',
      },
    });
  }

  /**
   * Notificar sobre nova mensagem
   */
  async notifyNewMessage(userId: string, senderName: string, conversationId: string) {
    return this.createNotification({
      user_id: userId,
      title: 'Nova Mensagem',
      message: `${senderName} enviou uma nova mensagem`,
      type: 'message',
      data: {
        conversationId,
        action: 'new_message',
      },
    });
  }

  /**
   * Notificar sobre novo projeto relevante
   */
  async notifyNewProject(professionalId: string, projectTitle: string, projectId: string) {
    return this.createNotification({
      user_id: professionalId,
      title: 'Novo Projeto Disponível',
      message: `Um novo projeto que combina com seu perfil: "${projectTitle}"`,
      type: 'project',
      data: {
        projectId,
        action: 'new_project',
      },
    });
  }
}

export const notificationService = new NotificationService();
