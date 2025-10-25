import { Bell } from 'lucide-react';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

interface NotificationBadgeProps {
  onClick?: () => void;
  className?: string;
}

export function NotificationBadge({ onClick, className = '' }: NotificationBadgeProps) {
  const { count, loading } = useUnreadNotifications();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Notificações"
    >
      <Bell className="w-6 h-6 text-gray-600" />
      
      {!loading && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}

      {loading && (
        <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          <span className="animate-spin">⋯</span>
        </span>
      )}
    </button>
  );
}
