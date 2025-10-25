# ✅ CHECKLIST PÓS-DEPLOY - OAuth Fix

Execute este checklist **DEPOIS** que o deploy terminar no Vercel.

---

## 📋 PASSO 1: Verificar Deploy no Vercel

1. Acesse: https://vercel.com/
2. Procure o projeto **gseed-portal**
3. Verifique se o último deployment tem status **"Ready"** ✅
4. Clique no deployment e veja se mostra: `fix: forcar URLs corretas do portal.gseed.com.br`

---

## 📋 PASSO 2: Configurar Redirect URLs no Supabase

**URL:** https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/url-configuration

### Site URL:
```
https://portal.gseed.com.br
```
(SEM barra no final!)

### Redirect URLs (clique "Add URL" para cada uma):
```
✅ https://portal.gseed.com.br/auth/callback
✅ https://portal.gseed.com.br/onboarding
✅ https://portal.gseed.com.br/dashboard
✅ https://portal.gseed.com.br/login
✅ https://portal.gseed.com.br/verify-email
```

Clique em **"Save"** no final!

---

## 📋 PASSO 3: Verificar Provedores OAuth no Supabase

**URL:** https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/providers

Confirme que cada provedor está **ENABLED** e com credenciais preenchidas:

### ✅ Google
- [ ] Status: Enabled (verde)
- [ ] Client ID: preenchido
- [ ] Client Secret: preenchido

### ✅ LinkedIn (OIDC)
- [ ] Status: Enabled (verde)
- [ ] Client ID: preenchido
- [ ] Client Secret: preenchido

### ✅ Facebook
- [ ] Status: Enabled (verde)
- [ ] Client ID (App ID): preenchido
- [ ] Client Secret: preenchido

---

## 📋 PASSO 4: Verificar URLs nos Provedores

### 🔵 Google Cloud Console
**URL:** https://console.cloud.google.com/apis/credentials

1. Clique no seu **OAuth 2.0 Client ID**
2. Em **"Authorized redirect URIs"**, confirme:
   ```
   ✅ https://portal.gseed.com.br/auth/callback
   ✅ https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
   ```
3. Em **"Authorized JavaScript origins"**:
   ```
   ✅ https://portal.gseed.com.br
   ```

---

### 💼 LinkedIn Developers
**URL:** https://www.linkedin.com/developers/apps

1. Clique no app **GSeed Portal**
2. Aba **"Auth"**
3. Em **"Redirect URLs"**, confirme:
   ```
   ✅ https://portal.gseed.com.br/auth/callback
   ✅ https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
   ```

---

### 📘 Facebook Developers
**URL:** https://developers.facebook.com/apps

1. Clique no app **GSeed Portal**
2. Menu: **"Casos de uso" → "Login do Facebook" → "Configurações"**
3. Em **"URIs de redirecionamento do OAuth válidos"**, confirme:
   ```
   ✅ https://portal.gseed.com.br/auth/callback
   ✅ https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
   ```
4. **IMPORTANTE:** Verifique se o app está em modo **"Ativo"** (não "desenvolvimento")

---

## 🧪 PASSO 5: TESTAR OS LOGINS

Abra em uma **aba anônima** (Ctrl+Shift+N):

```
https://portal.gseed.com.br/login
```

### Teste cada botão:

#### ✅ Teste 1: Login com Google
- [ ] Clica no botão "Continuar com Google"
- [ ] Abre popup do Google
- [ ] Seleciona conta
- [ ] Redireciona para `/auth/callback`
- [ ] Redireciona para `/onboarding` ou `/dashboard`
- [ ] **Sem erros no console**

#### ✅ Teste 2: Login com LinkedIn
- [ ] Clica no botão "Continuar com LinkedIn"
- [ ] Abre página do LinkedIn
- [ ] Faz login
- [ ] Redireciona para `/auth/callback`
- [ ] Redireciona para `/onboarding` ou `/dashboard`
- [ ] **Sem erros no console**

#### ✅ Teste 3: Login com Facebook
- [ ] Clica no botão "Continuar com Facebook"
- [ ] Abre popup do Facebook
- [ ] Faz login
- [ ] Redireciona para `/auth/callback`
- [ ] Redireciona para `/onboarding` ou `/dashboard`
- [ ] **Sem erros no console**

---

## 🐛 SE DER ERRO:

### Erro 400 "Bad Request"
- ✅ Verifique se a URL no Supabase está correta (https://portal.gseed.com.br)
- ✅ Verifique se as Redirect URLs estão salvas no Supabase

### Erro 500 "Internal Server Error"
- ✅ Verifique se o provedor está ENABLED no Supabase
- ✅ Verifique se Client ID e Secret estão corretos

### Erro "Unsupported provider"
- ✅ O provedor não está ativado no Supabase
- ✅ Vá em: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr/auth/providers
- ✅ Clique em "Enable" no provedor

### Erro "redirect_uri_mismatch" (Google/Facebook)
- ✅ As URLs não estão configuradas corretamente no console do provedor
- ✅ Volte no passo 4 e adicione as URLs corretas

---

## ✅ SUCESSO!

Se todos os 3 logins funcionarem:
- ✅ OAuth está 100% configurado
- ✅ Pode liberar para usuários testarem
- ✅ Delete os arquivos:
  - `deploy-oauth-fix.bat`
  - `COMMIT_OAUTH_FIX.md`
  - `CHECKLIST_POS_DEPLOY.md`

---

**Data:** 21/10/2025
**Status:** Aguardando testes
