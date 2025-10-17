# 🔐 GUIA COMPLETO - CONFIGURAÇÃO OAUTH

## 📋 **ÍNDICE:**
1. Configuração Google Login
2. Configuração Facebook Login
3. Configuração LinkedIn Login
4. Remover URL do Supabase da barra de endereço
5. Variáveis de Ambiente

---

## 1️⃣ **GOOGLE LOGIN**

### **Passo 1: Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Selecione/Crie projeto: **Portal Gseed**
3. Menu lateral → **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID**
5. Se solicitado, configure a **OAuth consent screen**:
   - User Type: **External**
   - App name: **Portal Gseed**
   - User support email: seu@email.com
   - Developer contact: seu@email.com
   - Salve

6. Volte para criar **OAuth 2.0 Client ID**:

```
Application type: Web application
Name: Portal Gseed

Authorized JavaScript origins:
✅ http://localhost:3000
✅ https://gseed.com.br
✅ https://portal.gseed.com.br

Authorized redirect URIs:
✅ http://localhost:3000/auth/callback
✅ https://gseed.com.br/auth/callback
✅ https://portal.gseed.com.br/auth/callback
✅ https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
```

7. **COPIE:** 
   - Client ID
   - Client Secret

### **Passo 2: Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
2. Menu lateral → **Authentication** → **Providers**
3. Encontre **Google** → Clique para expandir
4. **Ative** o switch "Enable Sign in with Google"
5. **Cole:**
   - **Client ID** (do Google Console)
   - **Client Secret** (do Google Console)
6. Configure **Redirect URL:**
   ```
   https://gseed.com.br/auth/callback
   ```
7. **Salvar**

---

## 2️⃣ **FACEBOOK LOGIN**

### **Passo 1: Facebook App Configuration**

1. Acesse: https://developers.facebook.com/apps
2. **Se você já tem app do outro subdomínio:**
   - Selecione o app existente
   - Vá em **Settings** → **Basic**
   - Em **App Domains**, adicione:
     ```
     gseed.com.br
     portal.gseed.com.br
     ```

3. Menu lateral → **Facebook Login** → **Settings**
4. Em **Valid OAuth Redirect URIs**, adicione:
   ```
   http://localhost:3000/auth/callback
   https://gseed.com.br/auth/callback
   https://portal.gseed.com.br/auth/callback
   https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
   ```

5. **Salvar alterações**
6. Volte em **Settings** → **Basic**
7. **COPIE:**
   - App ID
   - App Secret (clique em "Show")

### **Passo 2: Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
2. Menu lateral → **Authentication** → **Providers**
3. Encontre **Facebook** → Clique para expandir
4. **Ative** o switch "Enable Sign in with Facebook"
5. **Cole:**
   - **Facebook App ID** (do Facebook Developers)
   - **Facebook App Secret** (do Facebook Developers)
6. **Salvar**

---

## 3️⃣ **LINKEDIN LOGIN**

### **Passo 1: LinkedIn Developers**

1. Acesse: https://www.linkedin.com/developers/apps
2. Clique em **Create app**
3. Preencha:
   - App name: **Portal Gseed**
   - LinkedIn Page: (sua página do LinkedIn)
   - App logo: (logo do Gseed)
4. Aceite os termos → **Create app**

5. Vá na aba **Auth**
6. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/auth/callback
   https://gseed.com.br/auth/callback
   https://portal.gseed.com.br/auth/callback
   https://xnwnwvhoulxxzxtxqmbr.supabase.co/auth/v1/callback
   ```

7. **COPIE:**
   - Client ID
   - Client Secret

### **Passo 2: Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/xnwnwvhoulxxzxtxqmbr
2. Menu lateral → **Authentication** → **Providers**
3. Encontre **LinkedIn (OIDC)** → Clique para expandir
4. **Ative** o switch
5. **Cole:**
   - **Client ID** (do LinkedIn Developers)
   - **Client Secret** (do LinkedIn Developers)
6. **Salvar**

---

## 4️⃣ **REMOVER URL SUPABASE DA BARRA DE ENDEREÇO**

### **Método 1: Site URL (RECOMENDADO)**

No Supabase Dashboard:

1. **Settings** → **General**
2. Em **Site URL**, configure:
   ```
   https://gseed.com.br
   ```
3. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/*
   https://gseed.com.br/*
   https://portal.gseed.com.br/*
   ```
4. **Salvar**

### **Método 2: Variáveis de Ambiente (JÁ CONFIGURADO)**

O arquivo `.env` já está configurado com:

```env
VITE_SITE_URL=https://gseed.com.br
VITE_OAUTH_REDIRECT_URL=https://gseed.com.br/auth/callback
```

O `oauthService.ts` já usa essas variáveis automaticamente! ✅

---

## 5️⃣ **CONFIGURAÇÃO NO DOMÍNIO VERCEL**

Se estiver usando Vercel para deploy:

1. Acesse: https://vercel.com/growthseed/gseed-portal
2. **Settings** → **Domains**
3. Adicione: `gseed.com.br` ou `portal.gseed.com.br`
4. Configure DNS conforme instruções
5. **Settings** → **Environment Variables**
6. Adicione:
   ```
   VITE_SITE_URL = https://gseed.com.br
   VITE_OAUTH_REDIRECT_URL = https://gseed.com.br/auth/callback
   ```

---

## ✅ **CHECKLIST FINAL:**

### **Google:**
- [ ] OAuth Client criado no Google Cloud Console
- [ ] Redirect URIs configuradas
- [ ] Client ID/Secret copiados
- [ ] Provider ativado no Supabase
- [ ] Credenciais coladas no Supabase

### **Facebook:**
- [ ] App Domains configurado
- [ ] OAuth Redirect URIs configurados
- [ ] App ID/Secret copiados
- [ ] Provider ativado no Supabase
- [ ] Credenciais coladas no Supabase

### **LinkedIn:**
- [ ] App criado no LinkedIn Developers
- [ ] Redirect URLs configuradas
- [ ] Client ID/Secret copiados
- [ ] Provider ativado no Supabase
- [ ] Credenciais coladas no Supabase

### **Supabase:**
- [ ] Site URL configurada: `https://gseed.com.br`
- [ ] Redirect URLs configuradas
- [ ] Todos os providers ativados

### **Código:**
- [x] `.env` atualizado com VITE_SITE_URL
- [x] `.env` atualizado com VITE_OAUTH_REDIRECT_URL
- [x] `oauthService.ts` atualizado para usar variáveis

---

## 🧪 **TESTAR:**

```bash
cd C:\Users\EFEITO DIGITAL\gseed-portal
npm run dev
```

1. Acesse: http://localhost:3000/login
2. Clique em **Continuar com Google**
3. Faça login com Google
4. Você deve ser redirecionado para: `http://localhost:3000/auth/callback`
5. Depois para: `http://localhost:3000/perfil`

**A URL NUNCA deve mostrar `.supabase.co`!** ✅

---

## 🚨 **IMPORTANTE:**

- Cada provedor OAuth precisa ser configurado **separadamente**
- As URLs de redirect **devem ser exatas** (sem espaços ou barras extras)
- Após qualquer mudança nos providers, aguarde **5 minutos** para propagar
- Se der erro "redirect_uri_mismatch", verifique se as URLs estão **exatamente iguais** em todos os lugares

---

## 📞 **PRECISA DE AJUDA?**

Se encontrar algum erro durante a configuração, me envie:
1. Nome do provider (Google, Facebook, LinkedIn)
2. Mensagem de erro completa
3. Print da tela onde ocorre o erro

**Boa configuração!** 🚀
