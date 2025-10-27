import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'en-US', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'ro-RO', name: 'Română', flag: '🇷🇴', nativeName: 'Română' }
] as const;

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline';
  showLabel?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'dropdown',
  showLabel = true 
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(
    lang => lang.code === i18n.language
  ) || LANGUAGES[0];

  const changeLanguage = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem('i18nextLng', languageCode);
  };

  if (variant === 'inline') {
    return (
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              i18n.language === lang.code
                ? 'bg-gseed-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={lang.nativeName}
          >
            <span className="text-lg">{lang.flag}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-xl">{currentLanguage.flag}</span>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage.nativeName}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white px-2">
                Select Language
              </h3>
            </div>
            <div className="p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-gseed-50 dark:bg-gseed-900/20 text-gseed-600 dark:text-gseed-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{lang.nativeName}</div>
                      <div className="text-xs opacity-70">{lang.name}</div>
                    </div>
                  </div>
                  {i18n.language === lang.code && (
                    <Check size={18} className="text-gseed-600 dark:text-gseed-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
