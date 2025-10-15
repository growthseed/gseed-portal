import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Loader2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService, type Notification } from '@/services/notificationService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type FilterType = 'all' | 'unread' | 'proposal' | 'project' | 'message' | 'system' | 'payment';

export default function Notificacoes() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications(100);
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const unsubscribe = notificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success(newNotification.title);
      }
    );

    return unsubscribe;
  };

  const applyFilter = () => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.is_read);
    } else if (filter !== 'all') {
      filtered = notifications.filter(n => n.type === filter);
    }

    setFilteredNotifications(filtered);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Navegar baseado no tipo
    if (notification.data?.proposalId) {
      navigate('/propostas');
    } else if (notification.data?.projectId) {
      navigate(`/projetos/${notification.data.projectId}`);
    } else if (notification.data?.conversationId) {
      navigate('/chat');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('Todas marcadas como lidas');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao marcar como lidas');
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notificação deletada');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao deletar notificação');
    }
  };

  const deleteAllRead = async () => {
    if (!confirm('Deseja realmente deletar todas as notificações lidas?')) return;

    try {
      await notificationService.deleteAllRead();
      setNotifications(prev => prev.filter(n => !n.is_read));
      toast.success('Notificações lidas deletadas');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao deletar notificações');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    if (days === 1) return 'ontem';
    if (days < 7) return `há ${days} dias`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal': return '📝';
      case 'project': return '💼';
      case 'message': return '💬';
      case 'payment': return '💰';
      default: return '🔔';
    }
  };

  const filters: { type: FilterType; label: string; count?: number }[] = [
    { type: 'all', label: 'Todas', count: notifications.length },
    { type: 'unread', label: 'Não lidas', count: unreadCount },
    { type: 'proposal', label: 'Propostas' },
    { type: 'project', label: 'Projetos' },
    { type: 'message', label: 'Mensagens' },
    { type: 'system', label: 'Sistema' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-gseed-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell size={32} className="text-gseed-500" />
              Notificações
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-gseed-500 text-white text-sm font-bold rounded-full">
                {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe todas as atualizações do seus projetos e propostas
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f.type}
                  onClick={() => setFilter(f.type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.type
                      ? 'bg-gseed-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && ` (${f.count})`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <CheckCheck size={16} />
                Marcar todas como lida
              </button>
            )}
            {notifications.some(n => n.is_read) && (
              <button
                onClick={deleteAllRead}
                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/30 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Limpar lidas
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Bell size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread'
                  ? 'Você está em dia! 🎉'
                  : 'Quando houver novidades, elas aparecerão aqui.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all text-left ${
                  !notification.is_read
                    ? 'ring-2 ring-gseed-500/20 bg-gseed-50/50 dark:bg-gseed-900/10'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-gray-900 dark:text-white font-semibold">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <div className="w-3 h-3 rounded-full bg-gseed-500 flex-shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(notification.created_at)}
                      </span>
                      <button
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Deletar notificação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
