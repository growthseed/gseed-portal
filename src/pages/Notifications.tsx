import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Briefcase,
  Filter,
  Search,
  Check,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type NotificationFilter = 'all' | 'new_message' | 'new_proposal' | 'proposal_accepted' | 'proposal_rejected' | 'new_project';
type ReadFilter = 'all' | 'unread' | 'read';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, refresh, loading } = useNotifications();
  
  const [typeFilter, setTypeFilter] = useState<NotificationFilter>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    // Filtro por tipo
    if (typeFilter !== 'all' && notification.type !== typeFilter) {
      return false;
    }
    
    // Filtro por lida/não lida
    if (readFilter === 'unread' && notification.is_read) {
      return false;
    }
    if (readFilter === 'read' && !notification.is_read) {
      return false;
    }
    
    // Filtro por busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Ícones por tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'new_proposal':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'proposal_accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'proposal_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'new_project':
        return <Briefcase className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Labels dos filtros
  const filterLabels: Record<NotificationFilter, string> = {
    all: 'Todas',
    new_message: 'Mensagens',
    new_proposal: 'Propostas',
    proposal_accepted: 'Aceitas',
    proposal_rejected: 'Recusadas',
    new_project: 'Projetos'
  };

  // Navegar para a notificação
  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    const data = notification.data || {};
    
    switch (notification.type) {
      case 'new_message':
        if (data.conversation_id) {
          navigate(`/mensagens?conversation=${data.conversation_id}`);
        }
        break;
      case 'new_proposal':
      case 'proposal_accepted':
      case 'proposal_rejected':
        if (data.proposal_id) {
          navigate(`/propostas/${data.proposal_id}`);
        }
        break;
      case 'new_project':
        if (data.project_id) {
          navigate(`/projetos/${data.project_id}`);
        }
        break;
    }
  };

  // Deletar notificação
  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    if (window.confirm('Deseja excluir esta notificação?')) {
      await deleteNotification(notificationId);
    }
  };

  // Marcar como lida
  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-7 w-7 text-blue-600" />
                Notificações
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? (
                  <span className="text-blue-600 font-medium">
                    {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}
                  </span>
                ) : (
                  'Todas as notificações foram lidas'
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => refresh()}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Busca */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            
            {/* Filtro por tipo */}
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(filterLabels) as NotificationFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    typeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterLabels[filter]}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-300" />

            {/* Filtro por lida */}
            <div className="flex gap-2">
              <button
                onClick={() => setReadFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  readFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setReadFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  readFilter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Não lidas
              </button>
              <button
                onClick={() => setReadFilter('read')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  readFilter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lidas
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-gray-600">
            Exibindo {filteredNotifications.length} de {notifications.length} notificações
          </div>
        </div>

        {/* Lista de notificações */}
        <div className="space-y-3">
          {loading && notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Carregando notificações...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou filtros'
                  : typeFilter !== 'all' || readFilter !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Você não tem notificações no momento'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Ícone */}
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-full ${
                      !notification.is_read ? 'bg-blue-50' : 'bg-gray-50'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-medium ${
                        !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${
                      !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>

                    {/* Badge de status */}
                    {!notification.is_read && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Nova
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex-shrink-0 flex gap-1">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        {filteredNotifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6 text-center">
            <p className="text-sm text-gray-600">
              Fim das notificações
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
