import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES,
  getUserLanguagePreference,
  updateUserLanguagePreference 
} from '@/services/translationService';
import { useAuth } from '@/contexts/AuthContext';

export function LanguageSelector() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [showOriginal, setShowOriginal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  async function loadUserPreferences() {
    if (!user) return;
    
    try {
      const language = await getUserLanguagePreference(user.id);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }

  async function handleLanguageChange(languageCode: string) {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserLanguagePreference(
        user.id,
        languageCode,
        autoTranslate,
        showOriginal
      );
      setSelectedLanguage(languageCode);
      setIsOpen(false);
      
      // Recarrega a página para aplicar novo idioma
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar idioma:', error);
      alert('Erro ao salvar preferência de idioma');
    } finally {
      setSaving(false);
    }
  }

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className="relative">
      {/* Botão para abrir seletor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe size={18} />
        <span className="text-2xl">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
      </button>

      {/* Dropdown de idiomas */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Selecione seu idioma
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mensagens serão traduzidas automaticamente
              </p>
            </div>

            <div className="p-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={saving}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-gseed-50 dark:bg-gseed-900/20 text-gseed-600 dark:text-gseed-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check size={18} className="text-gseed-600 dark:text-gseed-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Opções adicionais */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-4 h-4 text-gseed-600 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Tradução automática
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Traduzir mensagens automaticamente
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={showOriginal}
                  onChange={(e) => setShowOriginal(e.target.checked)}
                  className="w-4 h-4 text-gseed-600 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mostrar texto original
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permitir visualizar mensagem original
                  </p>
                </div>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
