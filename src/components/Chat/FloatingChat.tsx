import { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { supabase } from '@/lib/supabase';
import type { ChatMessage, Profile } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FloatingChatProps {
  recipientId: string;
  onClose: () => void;
}

export function FloatingChat({ recipientId, onClose }: FloatingChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializingRef = useRef(false);

  // Carregar recipient
  useEffect(() => {
    if (!user || !recipientId) return;
    loadRecipient();
  }, [user, recipientId]);

  // Inicializar conversa - apenas uma vez
  useEffect(() => {
    if (!user || !recipientId || initializingRef.current) return;
    
    initializingRef.current = true;
    initializeConversation();
  }, [user, recipientId]);

  // Carregar mensagens quando conversationId estiver pronto
  useEffect(() => {
    if (!conversationId || !user) return;
    
    console.log('[FloatingChat] conversationId definido, carregando mensagens...');
    loadMessages();
    
    // Subscribe to new messages
    const unsubscribe = chatService.subscribeToConversation(
      conversationId,
      (message) => {
        console.log('[FloatingChat] Nova mensagem recebida via realtime:', message);
        setMessages(prev => {
          // Evitar duplicatas
          if (prev.some(m => m.id === message.id)) {
            console.log('[FloatingChat] Mensagem duplicada ignorada:', message.id);
            return prev;
          }
          console.log('[FloatingChat] Adicionando mensagem ao estado');
          return [...prev, message];
        });
        scrollToBottom();
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [conversationId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const loadRecipient = async () => {
    if (!recipientId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (error) throw error;
      setRecipient(data);
    } catch (error) {
      console.error('[FloatingChat] Erro ao carregar destinatário:', error);
    }
  };

  const initializeConversation = async () => {
    if (!user || !recipientId) {
      console.warn('[FloatingChat] user ou recipientId não definidos');
      return;
    }
    
    console.log('[FloatingChat] Inicializando conversa...', { userId: user.id, recipientId });
    
    try {
      const conversation = await chatService.getOrCreateConversation(
        user.id,
        recipientId
      );
      console.log('[FloatingChat] Conversa inicializada:', conversation);
      setConversationId(conversation.id);
    } catch (error) {
      console.error('[FloatingChat] Erro ao inicializar conversa:', error);
    } finally {
      initializingRef.current = false;
    }
  };

  const loadMessages = async () => {
    if (!conversationId) {
      console.warn('[FloatingChat] conversationId ainda não definido');
      return;
    }
    
    console.log('[FloatingChat] Carregando mensagens...', { conversationId });
    setLoading(true);
    try {
      const msgs = await chatService.getConversationMessages(conversationId);
      console.log('[FloatingChat] Mensagens carregadas:', msgs.length, msgs);
      setMessages(msgs);
      
      // Marcar como lidas
      if (user) {
        await chatService.markMessagesAsRead(conversationId, user.id);
      }
    } catch (error) {
      console.error('[FloatingChat] Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !conversationId || !newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    console.log('[FloatingChat] 📤 Enviando mensagem...', {
      conversationId,
      senderId: user.id,
      content: messageContent
    });

    setNewMessage(''); // Limpar imediatamente para melhor UX
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setSending(true);
    try {
      console.log('[FloatingChat] Chamando chatService.sendMessage...');
      const sentMessage = await chatService.sendMessage(
        conversationId,
        user.id,
        messageContent
      );
      
      console.log('[FloatingChat] ✅ Mensagem enviada com sucesso:', sentMessage);
      
      // Verificar se a mensagem foi realmente salva no banco
      console.log('[FloatingChat] 🔍 Verificando se mensagem foi salva...');
      const { data: verification, error: verifyError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', sentMessage.id)
        .maybeSingle();
      
      if (verifyError) {
        console.error('[FloatingChat] ❌ Erro ao verificar mensagem:', verifyError);
      } else if (verification) {
        console.log('[FloatingChat] ✅ Mensagem confirmada no banco:', verification);
      } else {
        console.error('[FloatingChat] ❌ Mensagem NÃO encontrada no banco!');
      }

      scrollToBottom();
    } catch (error: any) {
      console.error('[FloatingChat] ❌ Erro ao enviar mensagem:', error);
      console.error('[FloatingChat] Detalhes do erro:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      
      setNewMessage(messageContent); // Restaurar mensagem em caso de erro
      alert(`Erro ao enviar mensagem: ${error?.message || 'Erro desconhecido'}`);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (error) {
      return '';
    }
  };

  if (!recipient) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 right-4 w-96 bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl border-t-4 border-gseed-500 flex flex-col transition-all duration-200 ${
        isMinimized ? 'h-14' : 'h-[600px]'
      }`}
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gseed-500 to-gseed-600 rounded-t-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {recipient.avatar_url ? (
            <img 
              src={recipient.avatar_url} 
              alt={recipient.full_name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {recipient.full_name?.charAt(0) || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {recipient.full_name}
            </h3>
            <p className="text-xs text-white/80">
              {recipient.professional_title || 'Profissional'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 size={18} className="text-white" />
            ) : (
              <Minimize2 size={18} className="text-white" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Fechar"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gseed-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Carregando conversa...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Nenhuma mensagem ainda
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Envie uma mensagem para começar a conversa
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isMine
                          ? 'bg-gseed-500 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isMine ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                        {isMine && (message.read || message.is_read) && ' • Lida'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={sending || !conversationId}
                  className="w-full resize-none min-h-[44px] max-h-32 px-3 py-2 pr-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gseed-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Adicionar emoji"
                    disabled
                  >
                    <Smile size={18} className="text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Anexar arquivo"
                    disabled
                  >
                    <Paperclip size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim() || sending || !conversationId}
                className="h-11 w-11 flex-shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
