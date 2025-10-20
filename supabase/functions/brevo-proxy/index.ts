// Edge Function para fazer proxy das requisições ao Brevo
// Resolve problemas de CORS e restrições de IP

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const BREVO_API_URL = 'https://api.brevo.com/v3'

// CORS configurável: Produção e Dev
const ALLOWED_ORIGINS = [
  'https://portal.gseed.com.br',
  'http://localhost:3000',
  'http://localhost:5173'
];

// Função para verificar origem permitida
function getAllowedOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) return ALLOWED_ORIGINS[0]; // Fallback para produção
  
  // Se origem está na lista, retorna ela
  if (ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Fallback para produção
  return ALLOWED_ORIGINS[0];
}

serve(async (req) => {
  const requestOrigin = req.headers.get('origin');
  const allowedOrigin = getAllowedOrigin(requestOrigin);
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle CORS preflight (obrigatório para browsers)
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { action, params } = await req.json();

    console.log('[Brevo Proxy] Action:', action);
    console.log('[Brevo Proxy] Origin:', requestOrigin);
    console.log('[Brevo Proxy] API Key presente:', !!BREVO_API_KEY);

    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY não configurada no ambiente');
    }

    let endpoint = '';
    let method = 'POST';
    let body: any = {};

    switch (action) {
      case 'sendEmail':
        endpoint = '/smtp/email';
        body = {
          sender: params.sender || {
            email: 'noreply@gseedworks.com.br',
            name: 'Gseed Works'
          },
          to: params.to,
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent,
          templateId: params.templateId,
          params: params.params
        };
        break;
      
      case 'addContact':
        endpoint = '/contacts';
        body = {
          email: params.email,
          attributes: params.attributes,
          listIds: params.listIds,
          updateEnabled: params.updateEnabled !== false
        };
        break;
      
      case 'getAccount':
        endpoint = '/account';
        method = 'GET';
        break;
      
      default:
        throw new Error(`Ação inválida: ${action}`);
    }

    console.log('[Brevo Proxy] Chamando:', `${BREVO_API_URL}${endpoint}`);

    const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
      method,
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    console.log('[Brevo Proxy] Status:', response.status);
    console.log('[Brevo Proxy] Response:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      throw new Error(data.message || `Erro ${response.status} na API do Brevo`);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Brevo Proxy] Erro:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
