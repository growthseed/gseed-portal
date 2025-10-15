import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Search, Paperclip, MoreVertical } from 'lucide-react'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [message, setMessage] = useState('')

  const chats = [
    {
      id: 0,
      name: 'João Silva',
      lastMessage: 'Ótimo, vamos agendar uma reunião',
      time: '10:30',
      unread: 2,
      online: true
    },
    {
      id: 1,
      name: 'Maria Santos',
      lastMessage: 'O projeto está em andamento',
      time: 'Ontem',
      unread: 0,
      online: false
    },
    {
      id: 2,
      name: 'Pedro Costa',
      lastMessage: 'Enviei a proposta atualizada',
      time: '2 dias',
      unread: 0,
      online: true
    }
  ]

  const messages = [
    {
      id: 1,
      sender: 'other',
      text: 'Olá, vi seu perfil e gostaria de discutir um projeto',
      time: '09:00'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Olá! Claro, pode me contar mais sobre o projeto?',
      time: '09:15'
    },
    {
      id: 3,
      sender: 'other',
      text: 'É um e-commerce completo, preciso de alguém com experiência em React e Node',
      time: '09:30'
    },
    {
      id: 4,
      sender: 'me',
      text: 'Perfeito! Tenho experiência nessas tecnologias. Qual o prazo?',
      time: '10:00'
    },
    {
      id: 5,
      sender: 'other',
      text: 'Ótimo, vamos agendar uma reunião',
      time: '10:30'
    }
  ]

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
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 text-left ${
                  selectedChat === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">{chat.name}</p>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{chat.unread}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{chats[selectedChat].name}</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                  <div className={`px-4 py-2 rounded-lg ${
                    msg.sender === 'me' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${
                    msg.sender === 'me' ? 'text-right' : 'text-left'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip size={20} />
              </Button>
              <Input
                type="text"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button size="icon">
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}