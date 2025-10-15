import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Search,
  User,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { chatService, type Conversation, type ChatMessage } from '@/services/chatService';
import { supabase } from '@/lib/supabase';

interface ChatPanelProps {
  unreadCount?: number;
}

export function ChatPanel({ unreadCount: propUnreadCount = 0 }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(propUnreadCount);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar usuário atual
  useEffect(() => {
    const loadCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    loadCurrentUser();
  }, []);

  // Carregar conversas quando abrir o painel
  useEffect(() => {
    if (isOpen && currentUserId) {
      loadConversations();
      loadUnreadCount();
      setupRealtimeSubscription();
    }
  }, [isOpen, currentUserId]);

  // Carregar mensagens quando selecionar conversa
  useEffect(() => {
    if (selectedConversation && currentUserId) {
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, currentUserId]);

  // Scroll para última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      const data = await chatService.getUserConversations(currentUserId);
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await chatService.getConversationMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const loadUnreadCount = async () => {
    if (!currentUserId) return;
    
    try {
      const count = await chatService.getTotalUnreadCount(currentUserId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!currentUserId) return;
    
    try {
      await chatService.markMessagesAsRead(conversationId, currentUserId);
      await loadUnreadCount();
      await loadConversations();
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!currentUserId) return;

    // Inscrever-se para mudanças em todas as conversas do usuário
    const unsubscribe = chatService.subscribeToUserConversations(
      currentUserId,
      () => {
        loadConversations();
        loadUnreadCount();
      }
    );

    return unsubscribe;
  };

  // Inscrever-se para mensagens da conversa atual
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = chatService.subscribeToConversation(
      selectedConversation.id,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        
        // Se não for mensagem própria, tocar som ou mostrar notificação
        if (newMessage.sender_id !== currentUserId) {
          // Aqui você pode adicionar um som ou notificação visual
          markAsRead(selectedConversation.id);
        }
      }
    );

    return unsubscribe;
  }, [selectedConversation, currentUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || !currentUserId) return;

    try {
      setSending(true);
      const newMessage = await chatService.sendMessage(
        selectedConversation.id,
        currentUserId,
        message.trim()
      );
      
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      
      // Atualizar lista de conversas
      await loadConversations();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'ontem';
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedConversation) {
          setSelectedConversation(null);
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={panelRef}>
      {/* Botão do Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
      >
        <MessageCircle size={20} className="text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel Lateral */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col animate-slide-in-right">
          {/* Header do Painel */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mensagens</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Busca */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          {!selectedConversation ? (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="text-gseed-500 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                  </p>
                  {!searchTerm && (
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      Envie uma proposta para começar a conversar
                    </p>
                  )}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="w-full p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {conv.other_user?.avatar_url ? (
                            <img
                              src={conv.other_user.avatar_url}
                              alt={conv.other_user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={24} className="text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {conv.other_user?.name || 'Usuário'}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                            {conv.last_message?.created_at
                              ? formatTime(conv.last_message.created_at)
                              : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {conv.last_message?.content || 'Sem mensagens'}
                          </p>
                          {(conv.unread_count || 0) > 0 && (
                            <span className="ml-2 min-w-[20px] h-5 px-2 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            // Chat Individual
            <div className="flex-1 flex flex-col">
              {/* Header da Conversa */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <X size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {selectedConversation.other_user?.avatar_url ? (
                      <img
                        src={selectedConversation.other_user.avatar_url}
                        alt={selectedConversation.other_user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.other_user?.name || 'Usuário'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                    Início da conversa
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isOwnMessage = msg.sender_id === currentUserId;
                      const showAvatar =
                        index === 0 ||
                        messages[index - 1].sender_id !== msg.sender_id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2 mb-4 ${
                            isOwnMessage ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {!isOwnMessage && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {showAvatar ? (
                                msg.sender?.avatar_url ? (
                                  <img
                                    src={msg.sender.avatar_url}
                                    alt={msg.sender.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User size={16} className="text-gray-400 dark:text-gray-500" />
                                )
                              ) : (
                                <div className="w-8 h-8" />
                              )}
                            </div>
                          )}
                          <div
                            className={`max-w-[70%] ${
                              isOwnMessage ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-gseed-500 text-white rounded-br-sm'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                            </div>
                            <p
                              className={`text-xs text-gray-400 dark:text-gray-500 mt-1 ${
                                isOwnMessage ? 'text-right' : 'text-left'
                              }`}
                            >
                              {formatMessageTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input de Mensagem */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sending}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className="p-2 bg-gseed-500 hover:bg-gseed-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {sending ? (
                      <Loader2 size={20} className="text-white animate-spin" />
                    ) : (
                      <Send size={20} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
