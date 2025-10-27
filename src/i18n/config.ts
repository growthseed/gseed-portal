import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import roRO from './locales/ro-RO.json';

i18n
  // Detecta idioma do navegador
  .use(LanguageDetector)
  // Passa instância i18n para react-i18next
  .use(initReactI18next)
  // Inicializa
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      'es-ES': { translation: esES },
      'ro-RO': { translation: roRO }
    },
    
    // Idioma padrão
    fallbackLng: 'pt-BR',
    
    // Idiomas suportados
    supportedLngs: ['pt-BR', 'en-US', 'es-ES', 'ro-RO'],
    
    // Namespace padrão
    defaultNS: 'translation',
    
    // Debug apenas em desenvolvimento
    debug: import.meta.env.DEV,
    
    // Interpolação
    interpolation: {
      escapeValue: false // React já faz escape
    },
    
    // Detecção de idioma
    detection: {
      // Ordem de verificação:
      // 1. querystring (?lng=pt-BR)
      // 2. localStorage
      // 3. navigator
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng'
    },
    
    // Reage a mudanças de idioma
    react: {
      useSuspense: false
    }
  });

export default i18n;
