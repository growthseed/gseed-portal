import { useState } from 'react';
import { Languages, Eye, EyeOff } from 'lucide-react';

interface TranslatedMessageProps {
  content: string;
  contentOriginal: string;
  isTranslated: boolean;
  senderName: string;
  senderLanguage: string;
  timestamp: Date;
  isOwnMessage: boolean;
}

export function TranslatedMessage({
  content,
  contentOriginal,
  isTranslated,
  senderName,
  senderLanguage,
  timestamp,
  isOwnMessage
}: TranslatedMessageProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const languageNames: Record<string, string> = {
    'pt-BR': 'Português',
    'en-US': 'English',
    'es-ES': 'Español',
    'ro-RO': 'Română',
    'ru-RU': 'Русский',
    'zh-CN': '中文',
    'ar-SA': 'العربية'
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? 'bg-gseed-600 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        {/* Cabeçalho com nome e idioma */}
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">{senderName}</span>
            {isTranslated && (
              <span className="text-xs opacity-70 flex items-center gap-1">
                <Languages size={12} />
                {languageNames[senderLanguage] || senderLanguage}
              </span>
            )}
          </div>
        )}

        {/* Conteúdo da mensagem */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {showOriginal ? contentOriginal : content}
        </p>

        {/* Rodapé com horário e opção de mostrar original */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <span className="text-xs opacity-70">
            {timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {/* Botão para alternar original/traduzido */}
          {isTranslated && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
              title={showOriginal ? 'Ver tradução' : 'Ver original'}
            >
              {showOriginal ? (
                <>
                  <Eye size={12} />
                  Tradução
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Original
                </>
              )}
            </button>
          )}
        </div>

        {/* Badge de "Traduzido automaticamente" */}
        {isTranslated && !showOriginal && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-xs opacity-60 flex items-center gap-1">
              <Languages size={10} />
              Traduzido automaticamente
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
