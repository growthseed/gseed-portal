import { useState, useRef, useEffect } from 'react';
import { MessageCircle, User } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
}

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'João Silva',
    lastMessage: 'Olá! Gostaria de conversar sobre o projeto...',
    time: 'há 5 min',
    unread: 2,
  },
  {
    id: '2',
    name: 'Maria Santos',
    lastMessage: 'Obrigada pelo feedback!',
    time: 'há 1 hora',
    unread: 0,
  },
  {
    id: '3',
    name: 'Pedro Costa',
    lastMessage: 'Quando podemos nos reunir?',
    time: 'ontem',
    unread: 1,
  },
];

export function ChatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats] = useState(mockChats);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
      >
        <MessageCircle size={20} className="text-white" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-white font-semibold">Mensagens</h3>
          </div>

          {/* Lista de Conversas */}
          <div className="max-h-96 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">Nenhuma conversa</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {chat.avatar ? (
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-400" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm font-medium truncate">
                          {chat.name}
                        </p>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-800 text-center">
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
              Ver todas as conversas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
