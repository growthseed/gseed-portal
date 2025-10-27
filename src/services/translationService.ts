import { supabase } from '@/lib/supabase';

// Configuração da API de Tradução
const TRANSLATION_API = {
  provider: 'google', // 'google' | 'deepl' | 'azure'
  apiKey: import.meta.env.VITE_TRANSLATION_API_KEY,
  endpoint: 'https://translation.googleapis.com/language/translate/v2'
};

export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

export interface ChatMessageTranslated {
  id: string;
  content: string;                    // Texto no idioma do usuário
  contentOriginal: string;            // Texto original
  contentLanguage: string;            // Idioma original (pt-BR, ro-RO)
  isTranslated: boolean;              // Se está traduzido
  showOriginal?: boolean;             // Se deve mostrar original em tooltip
  sender: {
    id: string;
    name: string;
    language: string;
  };
}

/**
 * Detecta o idioma de um texto
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch(
      `${TRANSLATION_API.endpoint}/detect?key=${TRANSLATION_API.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text })
      }
    );

    const data = await response.json();
    const detected = data.data.detections[0][0];
    
    // Converte de 'pt' para 'pt-BR', 'en' para 'en-US', etc
    return normalizeLanguageCode(detected.language);
  } catch (error) {
    console.error('Erro ao detectar idioma:', error);
    return 'pt-BR'; // Fallback
  }
}

/**
 * Traduz um texto para o idioma alvo
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult> {
  try {
    const params = new URLSearchParams({
      key: TRANSLATION_API.apiKey,
      q: text,
      target: targetLanguage.split('-')[0], // pt-BR → pt
      format: 'text'
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage.split('-')[0]);
    }

    const response = await fetch(
      `${TRANSLATION_API.endpoint}?${params.toString()}`,
      { method: 'POST' }
    );

    const data = await response.json();
    const translation = data.data.translations[0];

    return {
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage || sourceLanguage || 'unknown',
      confidence: 1.0
    };
  } catch (error) {
    console.error('Erro ao traduzir texto:', error);
    throw new Error('Falha na tradução');
  }
}

/**
 * Traduz e salva uma mensagem no chat
 */
export async function sendTranslatedMessage(
  conversationId: string,
  senderId: string,
  content: string,
  targetUserLanguage: string
): Promise<ChatMessageTranslated> {
  try {
    // 1. Detecta idioma do remetente
    const senderLanguage = await detectLanguage(content);
    
    console.log('📝 Mensagem original:', content);
    console.log('🌍 Idioma detectado:', senderLanguage);
    console.log('🎯 Traduzir para:', targetUserLanguage);

    // 2. Traduz para o idioma do destinatário (se diferente)
    let translations: Record<string, string> = {};
    
    if (senderLanguage !== targetUserLanguage) {
      const result = await translateText(content, targetUserLanguage, senderLanguage);
      translations[targetUserLanguage] = result.translatedText;
      console.log('✅ Tradução:', result.translatedText);
    }

    // 3. Salva no banco com traduções
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content_original: content,
        content_language: senderLanguage,
        translations: translations,
        type: 'text',
        read: false
      })
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    // 4. Retorna mensagem formatada
    const isTranslated = senderLanguage !== targetUserLanguage;
    
    return {
      id: data.id,
      content: isTranslated ? translations[targetUserLanguage] : content,
      contentOriginal: content,
      contentLanguage: senderLanguage,
      isTranslated,
      showOriginal: isTranslated,
      sender: {
        id: data.sender.id,
        name: data.sender.name,
        language: senderLanguage
      }
    };
  } catch (error) {
    console.error('Erro ao enviar mensagem traduzida:', error);
    throw error;
  }
}

/**
 * Carrega mensagens com tradução para o idioma do usuário
 */
export async function loadTranslatedMessages(
  conversationId: string,
  userLanguage: string,
  limit: number = 50
): Promise<ChatMessageTranslated[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey (
          id,
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Traduz mensagens que ainda não têm tradução para o idioma do usuário
    const messages = await Promise.all(
      data.map(async (msg) => {
        const needsTranslation = 
          msg.content_language !== userLanguage && 
          !msg.translations[userLanguage];

        let content = msg.content_original;

        if (needsTranslation) {
          // Traduz on-demand
          const result = await translateText(
            msg.content_original,
            userLanguage,
            msg.content_language
          );
          content = result.translatedText;

          // Salva tradução no banco para cache
          await supabase
            .from('chat_messages')
            .update({
              translations: {
                ...msg.translations,
                [userLanguage]: result.translatedText
              }
            })
            .eq('id', msg.id);
        } else if (msg.translations[userLanguage]) {
          content = msg.translations[userLanguage];
        }

        return {
          id: msg.id,
          content,
          contentOriginal: msg.content_original,
          contentLanguage: msg.content_language,
          isTranslated: msg.content_language !== userLanguage,
          showOriginal: msg.content_language !== userLanguage,
          sender: {
            id: msg.sender.id,
            name: msg.sender.name,
            language: msg.content_language
          }
        };
      })
    );

    return messages;
  } catch (error) {
    console.error('Erro ao carregar mensagens traduzidas:', error);
    throw error;
  }
}

/**
 * Obtém preferência de idioma do usuário
 */
export async function getUserLanguagePreference(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('user_language_preferences')
      .select('primary_language')
      .eq('user_id', userId)
      .single();

    if (error || !data) return 'pt-BR'; // Fallback

    return data.primary_language;
  } catch (error) {
    console.error('Erro ao obter preferência de idioma:', error);
    return 'pt-BR';
  }
}

/**
 * Atualiza preferência de idioma do usuário
 */
export async function updateUserLanguagePreference(
  userId: string,
  language: string,
  autoTranslate: boolean = true,
  showOriginal: boolean = true
): Promise<void> {
  try {
    await supabase
      .from('user_language_preferences')
      .upsert({
        user_id: userId,
        primary_language: language,
        auto_translate: autoTranslate,
        show_original: showOriginal,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erro ao atualizar preferência de idioma:', error);
    throw error;
  }
}

/**
 * Normaliza código de idioma (pt → pt-BR, en → en-US)
 */
function normalizeLanguageCode(code: string): string {
  const map: Record<string, string> = {
    'pt': 'pt-BR',
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'ro': 'ro-RO',
    'ru': 'ru-RU',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'ar': 'ar-SA'
  };

  return map[code] || `${code}-${code.toUpperCase()}`;
}

/**
 * Lista de idiomas suportados
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ro-RO', name: 'Română', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'he-IL', name: 'עברית', flag: '🇮🇱' },
  { code: 'uk-UA', name: 'Українська', flag: '🇺🇦' }
] as const;
