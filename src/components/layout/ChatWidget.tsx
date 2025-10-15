import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  User,
  Minimize2,
  Maximize2,
  Phone,
  Video,
  MoreVertical,
  Search,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'João Silva',
    status: 'online',
  },
  {
    id: '2',
    name: 'Maria Santos',
    status: 'online',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    status: 'away',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Olá! Como você está?',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
  {
    id: '2',
    senderId: 'me',
    content: 'Estou bem, obrigado!',
    timestamp: new Date(Date.now() - 3500000),
    read: true,
  },
  {
    id: '3',
    senderId: '1',
    content: 'Vamos conversar sobre o projeto?',
    timestamp: new Date(Date.now() - 3400000),
    read: true,
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [unreadCount] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: messageInput,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  const openChat = (contact: Contact) => {
    setSelectedContact(contact);
    setView('chat');
  };

  const closeChat = () => {
    setView('list');
    setSelectedContact(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gseed-500 hover:bg-gseed-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-50"
      >
        <MessageCircle size={24} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transition-all ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="h-14 bg-gseed-500 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-white" />
          <span className="text-white font-semibold">
            {view === 'chat' && selectedContact ? selectedContact.name : 'Mensagens'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {view === 'chat' && (
            <button
              onClick={closeChat}
              className="w-8 h-8 hover:bg-gseed-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 hover:bg-gseed-600 rounded-lg flex items-center justify-center transition-colors"
          >
            {isMinimized ? (
              <Maximize2 size={18} className="text-white" />
            ) : (
              <Minimize2 size={18} className="text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-gseed-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Lista de Contatos */}
          {view === 'list' && (
            <div className="h-[calc(600px-56px)] overflow-y-auto bg-gray-50">
              {/* Busca */}
              <div className="p-3 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gseed-500"
                  />
                </div>
              </div>

              {/* Lista */}
              <div>
                {mockContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => openChat(contact)}
                    className="w-full p-3 hover:bg-gray-100 transition-colors text-left border-b border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                            contact.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500">Clique para conversar</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Área de Chat */}
          {view === 'chat' && selectedContact && (
            <div className="h-[calc(600px-56px)] flex flex-col">
              {/* Info do Contato */}
              <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${getStatusColor(
                        selectedContact.status
                      )}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedContact.status === 'online' ? 'Online' : 'Ausente'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-gray-600" />
                  </button>
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
                    <Video size={16} className="text-gray-600" />
                  </button>
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center">
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {messages.map((message) => {
                  const isMyMessage = message.senderId === 'me';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                          isMyMessage
                            ? 'bg-gseed-500 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMyMessage ? 'text-green-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Paperclip size={18} className="text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gseed-500"
                  />
                  <button className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="w-8 h-8 bg-gseed-500 hover:bg-gseed-600 disabled:bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
