import { useState, useRef, useEffect } from 'react';
import { NotificationBadge } from '@/components/NotificationBadge';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';

/**
 * Exemplo de como integrar o sistema de notificações no Header/Navbar
 * 
 * Uso:
 * 1. Importar este componente no seu Header/Navbar
 * 2. Posicionar onde quiser (geralmente ao lado do avatar do usuário)
 * 3. Pronto! O sistema funciona automaticamente
 */
export function NotificationsContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <NotificationBadge onClick={() => setIsOpen(!isOpen)} />
      <NotificationsDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

/**
 * EXEMPLO DE USO NO HEADER:
 * 
 * import { NotificationsContainer } from '@/components/NotificationsContainer';
 * 
 * export function Header() {
 *   return (
 *     <header className="bg-white shadow">
 *       <div className="flex items-center justify-between px-6 py-4">
 *         <Logo />
 *         
 *         <div className="flex items-center gap-4">
 *           <NotificationsContainer />  <-- Adicionar aqui
 *           <UserMenu />
 *         </div>
 *       </div>
 *     </header>
 *   );
 * }
 */
