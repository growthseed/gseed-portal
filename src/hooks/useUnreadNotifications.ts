import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data: {
    conversation_id: string;
    message_id: string;
    sender_id: string;
    sender_name: string;
    content_preview: string;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export function useUnreadNotifications() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    async function initialize() {
      try {
        // Buscar notificações iniciais
        await fetchUnread();

        // Setup real-time subscription
        channel = supabase
          .channel('notifications-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
            },
            (payload) => {
              const newNotification = payload.new as Notification;
              
              // Adicionar apenas se for para o usuário atual
              setNotifications((prev) => [newNotification, ...prev]);
              setCount((prev) => prev + 1);
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
            },
            (payload) => {
              const updatedNotification = payload.new as Notification;
              
              setNotifications((prev) =>
                prev.map((notif) =>
                  notif.id === updatedNotification.id ? updatedNotification : notif
                )
              );

              // Atualizar contador se foi marcada como lida
              if (updatedNotification.is_read) {
                setCount((prev) => Math.max(0, prev - 1));
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Error initializing notifications:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    initialize();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  async function fetchUnread() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setCount(data?.length || 0);
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (updateError) throw updateError;

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      
      setCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }

  async function markAllAsRead() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (updateError) throw updateError;

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );
      
      setCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (deleteError) throw deleteError;

      setNotifications((prev) => 
        prev.filter((notif) => notif.id !== notificationId)
      );
      
      // Decrease count only if it was unread
      const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
      if (wasUnread) {
        setCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }

  return {
    count,
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchUnread,
  };
}
