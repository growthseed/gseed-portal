import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'proposal_received' | 'proposal_accepted' | 'proposal_rejected' | 'new_message' | 'new_project' | 'message' | 'system';
  data?: any;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

class NotificationService {
  /**
   * Criar notificação
   */
  async createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Buscar notificações do usuário
   */
  async getUserNotifications(userId?: string, limit = 20) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Buscar notificações não lidas
   */
  async getUnreadNotifications(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount(userId?: string): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      return 0;
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)
      .eq('is_read', false);

    if (error) return 0;
    return count || 0;
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
  }

  /**
   * Marcar todas como lidas
   */
  async markAllAsRead(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', targetUserId)
      .eq('is_read', false);

    if (error) throw error;
  }

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }

  /**
   * Deletar todas as notificações lidas
   */
  async deleteReadNotifications(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', targetUserId)
      .eq('is_read', true);

    if (error) throw error;
  }

  /**
   * Notificar sobre nova proposta
   */
  async notifyNewProposal(projectOwnerId: string, projectTitle: string, professionalName: string, proposalId: string) {
    return this.createNotification({
      user_id: projectOwnerId,
      title: 'Nova proposta recebida!',
      message: `${professionalName} enviou uma proposta para "${projectTitle}"`,
      type: 'proposal_received',
      data: {
        proposal_id: proposalId,
        project_title: projectTitle,
        professional_name: professionalName,
      },
    });
  }

  /**
   * Notificar sobre proposta aceita
   */
  async notifyProposalAccepted(professionalId: string, projectTitle: string, proposalId: string) {
    return this.createNotification({
      user_id: professionalId,
      title: 'Proposta aceita! 🎉',
      message: `Sua proposta para "${projectTitle}" foi aceita!`,
      type: 'proposal_accepted',
      data: {
        proposal_id: proposalId,
        project_title: projectTitle,
      },
    });
  }

  /**
   * Notificar sobre proposta recusada
   */
  async notifyProposalRejected(professionalId: string, projectTitle: string, proposalId: string, reason?: string) {
    return this.createNotification({
      user_id: professionalId,
      title: 'Proposta recusada',
      message: reason || `Sua proposta para "${projectTitle}" foi recusada.`,
      type: 'proposal_rejected',
      data: {
        proposal_id: proposalId,
        project_title: projectTitle,
        reason,
      },
    });
  }

  /**
   * Notificar sobre nova mensagem
   * Nota: Esta função é chamada automaticamente pelo trigger do banco de dados
   * Mas pode ser usada manualmente se necessário
   */
  async notifyNewMessage(
    recipientId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string,
    messageId: string,
    senderId: string
  ) {
    return this.createNotification({
      user_id: recipientId,
      title: `Nova mensagem de ${senderName}`,
      message: messagePreview,
      type: 'new_message',
      data: {
        conversation_id: conversationId,
        message_id: messageId,
        sender_id: senderId,
        sender_name: senderName,
      },
    });
  }

  /**
   * Notificar sobre novo projeto relevante
   * Nota: Esta função é chamada automaticamente pelo trigger do banco de dados
   * quando um novo projeto é criado e tem match com as skills do profissional
   */
  async notifyNewProject(
    professionalId: string,
    projectTitle: string,
    projectId: string,
    matchingSkills: number
  ) {
    return this.createNotification({
      user_id: professionalId,
      title: 'Novo projeto disponível! 💼',
      message: `Um novo projeto que combina com suas habilidades: "${projectTitle}"`,
      type: 'new_project',
      data: {
        project_id: projectId,
        project_title: projectTitle,
        matching_skills: matchingSkills,
        action: 'view_project',
      },
    });
  }

  /**
   * Inscrever-se em notificações em tempo real
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const subscription = supabase
      .channel(`notifications:${userId}`)
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

    return subscription;
  }
}

export const notificationService = new NotificationService();
