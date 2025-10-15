import { useState, useEffect } from 'react';
import { NotificationsMenu } from './NotificationsMenu';
import { ChatPanel } from './ChatPanel';
import { UserMenu } from './UserMenu';
import { EscolhaTipoModal } from '../projetos/EscolhaTipoModal';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { chatService } from '@/services/chatService';
import { supabase } from '@/lib/supabase';

interface AppHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function AppHeader({ userName, userEmail, userAvatar }: AppHeaderProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const { theme } = useTheme();
  
  // Determina qual logo usar baseado no tema
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Carregar contador de mensagens não lidas
  useEffect(() => {
    const loadChatUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const count = await chatService.getTotalUnreadCount(user.id);
        setChatUnreadCount(count);
      }
    };
    
    loadChatUnreadCount();
    
    // Atualizar contador periodicamente
    const interval = setInterval(loadChatUnreadCount, 30000); // A cada 30s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40 transition-colors">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo */}
            <div className="flex items-center">
              {/* Logo - Clique para voltar à Home */}
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                type="button"
                aria-label="Voltar para home"
              >
                {/* Logo Original Gseed em PNG */}
                <img 
                  src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                  alt="Gseed Logo"
                  className="h-8 w-auto" 
                  style={{ maxHeight: '32px' }}
                />
                
                {/* Texto Works */}
                <span className="text-2xl font-bold text-gseed-600 dark:text-gseed-400">
                  Works
                </span>
              </button>
            </div>

            {/* Right Side - Botão Criar Projetos + Notificações + Chat + Menu Usuário */}
            <div className="flex items-center gap-3">
              {/* Botão Criar Projetos */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Criar Projeto</span>
              </button>
              {/* Notificações */}
              <NotificationsMenu />
              
              {/* Chat */}
              <ChatPanel unreadCount={chatUnreadCount} />
              
              {/* Menu do Usuário */}
              <UserMenu 
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Escolha */}
      <EscolhaTipoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectVaga={() => {
          setIsModalOpen(false);
          navigate('/criar-vaga');
        }}
        onSelectProjeto={() => {
          setIsModalOpen(false);
          navigate('/criar-projeto');
        }}
      />
    </>
  );
}
