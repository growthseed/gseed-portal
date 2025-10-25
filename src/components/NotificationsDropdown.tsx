import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck, Trash2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useUnreadNotifications();
  
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    await markAsRead(notification.id);
    if (notification.data?.conversation_id) {
      navigate(`/messages?conversation=${notification.data.conversation_id}`);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notificações</h3>
        </div>
        {notifications.length > 0 && (
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            <CheckCheck className="w-4 h-4" />
            Marcar todas
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma notificação nova</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1" onClick={() => handleNotificationClick(n)}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-gray-900">{n.title}</p>
                      {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.is_read && (
                      <button onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} className="p-1.5 hover:bg-gray-200 rounded">
                        <Check className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} className="p-1.5 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
