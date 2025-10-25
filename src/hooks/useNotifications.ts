import { useState, useEffect } from 'react';
import { notificationService, type Notification } from '@/services/notifications/notificationService';
import { notificationSoundService } from '@/services/notificationSound';
import { desktopNotificationService } from '@/services/desktopNotification';
import { supabase } from '@/lib/supabase';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allNotifications, count] = await Promise.all([
        notificationService.getUserNotifications(),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(allNotifications);
      setUnreadCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Atualizar estado local
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Atualizar estado local
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          is_read: true,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Atualizar estado local
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Subscribe to real-time notifications
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const subscription = notificationService.subscribeToNotifications(
          user.id,
          (newNotification: Notification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Tocar som de notificação
            notificationSoundService.play();
            
            // Mostrar desktop notification
            const data = newNotification.data || {};
            
            switch (newNotification.type) {
              case 'new_message':
                if (data.sender_name && data.conversation_id) {
                  desktopNotificationService.showMessageNotification(
                    data.sender_name,
                    newNotification.message,
                    data.conversation_id
                  );
                }
                break;
              
              case 'proposal_received':
                if (data.professional_name && data.project_title && data.proposal_id) {
                  desktopNotificationService.showProposalNotification(
                    data.professional_name,
                    data.project_title,
                    data.proposal_id
                  );
                }
                break;
              
              case 'proposal_accepted':
                if (data.project_title && data.proposal_id) {
                  desktopNotificationService.showProposalAcceptedNotification(
                    data.project_title,
                    data.proposal_id
                  );
                }
                break;
              
              case 'proposal_rejected':
                if (data.project_title && data.proposal_id) {
                  desktopNotificationService.showProposalRejectedNotification(
                    data.project_title,
                    data.proposal_id
                  );
                }
                break;
              
              case 'new_project':
                if (data.project_title && data.project_id && data.matching_skills) {
                  desktopNotificationService.showNewProjectNotification(
                    data.project_title,
                    data.matching_skills,
                    data.project_id
                  );
                }
                break;
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    setupSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
  };
}
