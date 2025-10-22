# 🔧 FIX: OAuth URLs - Forçar portal.gseed.com.br em produção

## Problema Identificado
Os logins sociais (Google, LinkedIn, Facebook) estavam usando `https://gseed.com.br` ao invés de `https://portal.gseed.com.br` como redirect URL, causando erro 400/500.

## Solução Implementada
- ✅ Forçado uso de `https://portal.gseed.com.br/auth/callback` quando em produção
- ✅ Detecção automática do ambiente via `window.location.hostname`
- ✅ Mantido suporte para localhost e outros ambientes de desenvolvimento

## Arquivos Alterados
- `src/services/oauthService.ts` - Atualizado métodos `getRedirectUrl()` e `getSiteUrl()`

## Como Fazer o Deploy

### 1. Commitar as mudanças
```bash
cd "C:/Users/EFEITO DIGITAL/gseed-portal"
git add .
git commit -m "fix: forçar URLs corretas do portal.gseed.com.br para OAuth"
git push origin main
```

### 2. Aguardar deploy automático do Vercel (2-3 minutos)

### 3. Testar os logins sociais
- Google: https://portal.gseed.com.br/login
- LinkedIn: https://portal.gseed.com.br/login
- Facebook: https://portal.gseed.com.br/login

## Configurações Adicionais Necessárias no Supabase

Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/url-configuration

### Site URL (deve estar):
```
https://portal.gseed.com.br
```

### Redirect URLs (devem incluir):
```
https://portal.gseed.com.br/auth/callback
https://portal.gseed.com.br/onboarding
https://portal.gseed.com.br/dashboard
https://portal.gseed.com.br/login
https://portal.gseed.com.br/verify-email
```

## Verificação nos Provedores OAuth

### Google Cloud Console
https://console.cloud.google.com/apis/credentials
- Authorized redirect URIs deve incluir:
  - https://portal.gseed.com.br/auth/callback
  - https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback

### LinkedIn Developers
https://www.linkedin.com/developers/apps
- Redirect URLs deve incluir:
  - https://portal.gseed.com.br/auth/callback
  - https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback

### Facebook Developers
https://developers.facebook.com/apps
- Valid OAuth Redirect URIs deve incluir:
  - https://portal.gseed.com.br/auth/callback
  - https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback

---

**Data do Fix**: 21/10/2025
**Desenvolvedor**: Claude + Equipe GSeed
