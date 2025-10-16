import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, Briefcase, Users, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationsMenu } from './NotificationsMenu';
import { ChatPanel } from './ChatPanel';
import { UserMenu } from './UserMenu';
import { EscolhaTipoModal } from '../projetos/EscolhaTipoModal';

export function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadChatCount] = useState(0);

  useEffect(() => {
    // Verificar se há um usuário logado
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Buscar dados do perfil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      }
      setLoading(false);
    };

    getUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-800/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <img 
                src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
                alt="Gseed" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-gseed-600 to-gseed-800 dark:from-gseed-400 dark:to-gseed-600 bg-clip-text text-transparent">
                Works
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/projetos"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gseed-600 dark:hover:text-gseed-400 transition-colors"
            >
              <Briefcase size={18} />
              <span className="font-medium">Projetos</span>
            </Link>
            <Link 
              to="/profissionais"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gseed-600 dark:hover:text-gseed-400 transition-colors"
            >
              <Users size={18} />
              <span className="font-medium">Profissionais</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {loading ? (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : user ? (
              /* Usuário Logado - Mostrar menu completo */
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Criar Projeto</span>
                </button>
                <NotificationsMenu />
                <ChatPanel unreadCount={unreadChatCount} />
                <UserMenu 
                  userName={profile?.name || user.email}
                  userEmail={user.email}
                  userAvatar={profile?.avatar_url}
                />
              </>
            ) : (
              /* Usuário Não Logado - Mostrar botões de Login/Cadastro */
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => navigate('/cadastro')}
                  className="bg-gradient-to-r from-gseed-600 to-gseed-700 hover:from-gseed-700 hover:to-gseed-800"
                >
                  Criar Conta
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/projetos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Briefcase size={18} />
                <span className="font-medium">Projetos</span>
              </Link>
              <Link 
                to="/profissionais"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users size={18} />
                <span className="font-medium">Profissionais</span>
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              {loading ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : user ? (
                /* Mobile - Usuário Logado */
                <>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/perfil');
                    }}
                    className="w-full"
                  >
                    Meu Perfil
                  </Button>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-gseed-600 to-gseed-700 hover:from-gseed-700 hover:to-gseed-800"
                  >
                    Criar Projeto
                  </Button>
                </>
              ) : (
                /* Mobile - Usuário Não Logado */
                <>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/cadastro');
                    }}
                    className="w-full bg-gradient-to-r from-gseed-600 to-gseed-700 hover:from-gseed-700 hover:to-gseed-800"
                  >
                    Criar Conta
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>

    {/* Modal de Escolha de Tipo de Projeto */}
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
