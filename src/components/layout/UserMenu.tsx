import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function UserMenu({ userName, userEmail, userAvatar }: UserMenuProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login after successful logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      icon: FileText,
      label: 'My Proposals',
      onClick: () => navigate('/proposals'),
    },
    {
      icon: Briefcase,
      label: 'My Projects',
      onClick: () => navigate('/my-projects'),
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {userAvatar ? (
            <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{userName || 'User'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail || ''}</p>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 dark:text-gray-400 transition-transform hidden md:block ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {userName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Profile - First item */}
          <div className="py-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
              <User size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">My Profile</span>
            </button>
          </div>

          {/* Other items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <Icon size={18} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
