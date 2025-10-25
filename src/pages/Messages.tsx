import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Search, Paperclip, MoreVertical, Loader2 } from 'lucide-react'
import { chatService, type Conversation, type ChatMessage } from '@/services/chatService'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Carregar usuário atual
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    loadUser()
  }, [])

  // Carregar conversas
  useEffect(() => {
    if (!currentUserId) return

    const loadConversations = async () => {
      try {
        setLoading(true)
        const convs = await chatService.getUserConversations(currentUserId)
        setConversations(convs)
        
        // Selecionar primeira conversa se existir
        if (convs.length > 0 && !selectedChat) {
          setSelectedChat(convs[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar conversas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()

    // Inscrever-se para atualizações de conversas
    const unsubscribe = chatService.subscribeToUserConversations(
      currentUserId,
      loadConversations
    )

    return () => unsubscribe()
  }, [currentUserId])

  // Carregar mensagens da conversa selecionada
  useEffect(() => {
    if (!selectedChat || !currentUserId) return

    const loadMessages = async () => {
      try {
        const msgs = await chatService.getConversationMessages(selectedChat)
        setMessages(msgs)
        
        // Marcar mensagens como lidas
        await chatService.markMessagesAsRead(selectedChat, currentUserId)
        
        // Scroll para o fim
        setTimeout(scrollToBottom, 100)
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error)
      }
    }

    loadMessages()

    // Inscrever-se para novas mensagens em tempo real
    unsubscribeRef.current = chatService.subscribeToConversation(
      selectedChat,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage])
        
        // Marcar como lida se for mensagem de outro usuário
        if (newMessage.sender_id !== currentUserId) {
          chatService.markMessagesAsRead(selectedChat, currentUserId)
        }
        
        // Scroll para o fim
        setTimeout(scrollToBottom, 100)
      }
    )

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [selectedChat, currentUserId])

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !currentUserId || sending) return

    try {
      setSending(true)
      await chatService.sendMessage(
        selectedChat,
        currentUserId,
        message.trim()
      )
      setMessage('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setSending(false)
    }
  }

  // Formatar tempo relativo
  const formatTime = (date: string) => {
    try {
      const messageDate = new Date(date)
      const now = new Date()
      const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return format(messageDate, 'HH:mm')
      } else if (diffInHours < 48) {
        return 'Ontem'
      } else if (diffInHours < 168) {
        return format(messageDate, 'EEEE', { locale: ptBR })
      } else {
        return format(messageDate, 'dd/MM/yyyy')
      }
    } catch {
      return ''
    }
  }

  // Filtrar conversas por busca
  const filteredConversations = conversations.filter(conv => 
    !searchTerm || 
    conv.other_user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedConversation = conversations.find(c => c.id === selectedChat)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Você precisa estar logado para acessar as mensagens.</p>
        </Card>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h3 className="text-xl font-semibold mb-2">Nenhuma conversa ainda</h3>
          <p className="text-gray-600">
            Suas conversas aparecerão aqui quando você começar a enviar mensagens para outros usuários.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Chat List */}
        <div className="w-80 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar conversas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {filteredConversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 text-left transition-colors ${
                  selectedChat === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {chat.other_user?.avatar_url ? (
                      <img
                        src={chat.other_user.avatar_url}
                        alt={chat.other_user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {chat.other_user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900 truncate">
                        {chat.other_user?.name || 'Usuário Desconhecido'}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {chat.last_message?.created_at ? formatTime(chat.last_message.created_at) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.last_message?.content || 'Sem mensagens ainda'}
                    </p>
                  </div>
                  {(chat.unread_count ?? 0) > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">
                        {chat.unread_count}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {selectedConversation.other_user?.avatar_url ? (
                      <img
                        src={selectedConversation.other_user.avatar_url}
                        alt={selectedConversation.other_user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {selectedConversation.other_user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedConversation.other_user?.name || 'Usuário Desconhecido'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => {
                  const isMyMessage = msg.sender_id === currentUserId
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-md">
                        <div className={`px-4 py-2 rounded-lg ${
                          isMyMessage
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}>
                          <p className="break-words">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${
                          isMyMessage ? 'text-right' : 'text-left'
                        }`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t p-4">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    disabled
                  >
                    <Paperclip size={20} />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    disabled={sending || !message.trim()}
                  >
                    {sending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-gray-500 text-lg">
                  Selecione uma conversa para começar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
