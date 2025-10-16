import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { chatService, type Conversation, type ChatMessage } from '@/services/chatService';
import { Send, Search, ArrowLeft, MoreVertical, Image as ImageIcon, Paperclip } from 'lucide-react';
import { toast } from 'sonner';

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      markAsRead();
      
      // Subscrever para mensagens em tempo real
      const unsubscribe = chatService.subscribeToMessages(
        selectedConversation.id,
        (message) => {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      );

      return () => {
        chatService.unsubscribeFromMessages(unsubscribe);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCurrentUser({ ...user, ...profile });
    }
    setLoading(false);
  };

  const loadConversations = async () => {
    if (!currentUser) return;
    const convs = await chatService.getUserConversations(currentUser.id);
    setConversations(convs);
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    const msgs = await chatService.getConversationMessages(selectedConversation.id);
    setMessages(msgs);
  };

  const markAsRead = async () => {
    if (!selectedConversation || !currentUser) return;
    await chatService.markMessagesAsRead(selectedConversation.id, currentUser.id);
    // Atualizar contadores
    setConversations(convs =>
      convs.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser || sending) return;

    setSending(true);
    const message = await chatService.sendMessage(
      selectedConversation.id,
      currentUser.id,
      newMessage.trim()
    );

    if (message) {
      setNewMessage('');
      // A mensagem será adicionada via Realtime subscription
    } else {
      toast.error('Erro ao enviar mensagem');
    }
    setSending(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participant || conv.other_user;
    return participant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-gseed-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Lista de Conversas */}
      <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mensagens</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gseed-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                  selectedConversation?.id === conv.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                      {conv.participant?.avatar_url ? (
                        <img src={conv.participant.avatar_url} alt={conv.participant.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {conv.participant?.name?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conv.unread_count! > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gseed-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{conv.unread_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conv.participant?.name || 'Usuário'}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conv.last_message?.created_at 
                          ? new Date(conv.last_message.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })
                          : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.last_message?.content || 'Sem mensagens'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {selectedConversation.participant?.avatar_url ? (
                    <img src={selectedConversation.participant.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      {selectedConversation.participant?.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.participant?.name || 'Usuário'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedConversation.participant?.email}
                  </p>
                </div>
              </div>

              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma mensagem ainda. Inicie a conversa!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender_id === currentUser?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-gseed-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                            {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {isOwn && (message.read ? ' ✓✓' : ' ✓')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Paperclip size={20} />
                </button>
                
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ImageIcon size={20} />
                </button>

                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Digite uma mensagem..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-gseed-500"
                    rows={1}
                    style={{ maxHeight: '120px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
