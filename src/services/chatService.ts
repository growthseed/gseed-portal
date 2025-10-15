import { supabase } from '@/lib/supabase';

export interface Conversation {
  id: string;
  project_id: string | null;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  // Dados enriquecidos
  other_user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  last_message?: {
    content: string;
    created_at: string;
  };
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: string;
  file_url: string | null;
  file_name: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
  // Dados enriquecidos
  sender?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

class ChatService {
  /**
   * Buscar ou criar conversa entre dois usuários
   */
  async getOrCreateConversation(
    userId: string,
    otherUserId: string,
    projectId?: string
  ): Promise<Conversation> {
    // Primeiro, tentar encontrar conversa existente
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('*')
      .or(
        `and(participant_1_id.eq.${userId},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${userId})`
      )
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // Se não existir, criar nova
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        participant_1_id: userId,
        participant_2_id: otherUserId,
        project_id: projectId || null,
      })
      .select()
      .single();

    if (createError) throw createError;
    return newConversation;
  }

  /**
   * Listar conversas do usuário
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    // Enriquecer com dados do outro usuário e última mensagem
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        const otherUserId =
          conv.participant_1_id === userId
            ? conv.participant_2_id
            : conv.participant_1_id;

        // Buscar dados do outro usuário
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .eq('id', otherUserId)
          .single();

        // Buscar última mensagem
        const { data: lastMessage } = await supabase
          .from('chat_messages')
          .select('content, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Contar mensagens não lidas
        const { count: unreadCount } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('read', false)
          .neq('sender_id', userId);

        return {
          ...conv,
          other_user: otherUser,
          last_message: lastMessage,
          unread_count: unreadCount || 0,
        };
      })
    );

    return enrichedConversations;
  }

  /**
   * Buscar mensagens de uma conversa
   */
  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return messages || [];
  }

  /**
   * Enviar mensagem
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: string = 'text',
    fileUrl?: string,
    fileName?: string
  ): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
        file_url: fileUrl || null,
        file_name: fileName || null,
        read: false,
      })
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    // Atualizar timestamp da conversa
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return message;
  }

  /**
   * Marcar mensagens como lidas
   */
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  /**
   * Contar mensagens não lidas totais
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    // Buscar todas as conversas do usuário
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) return 0;

    const conversationIds = conversations.map((c) => c.id);

    // Contar mensagens não lidas em todas as conversas
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .eq('read', false)
      .neq('sender_id', userId);

    return count || 0;
  }

  /**
   * Inscrever-se para novas mensagens em uma conversa (Real-time)
   */
  subscribeToConversation(
    conversationId: string,
    callback: (message: ChatMessage) => void
  ) {
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Enriquecer com dados do sender
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          callback({
            ...(payload.new as ChatMessage),
            sender,
          });
        }
      )
      .subscribe();

    // Retornar função para cancelar inscrição
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Inscrever-se para mudanças em conversas do usuário
   */
  subscribeToUserConversations(userId: string, callback: () => void) {
    const channel = supabase
      .channel(`user-conversations-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload) => {
          // Verificar se a mensagem é de uma conversa do usuário
          const { data: conversation } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', payload.new?.conversation_id || payload.old?.conversation_id)
            .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
            .single();

          if (conversation) {
            callback();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Deletar mensagem
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }

  /**
   * Buscar conversas (filtro)
   */
  async searchConversations(userId: string, searchTerm: string): Promise<Conversation[]> {
    const allConversations = await this.getUserConversations(userId);
    
    return allConversations.filter(conv => 
      conv.other_user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export const chatService = new ChatService();
