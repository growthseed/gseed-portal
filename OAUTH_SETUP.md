# 🔐 Configuração de OAuth no Supabase

Este guia mostra como configurar autenticação OAuth com **Google**, **LinkedIn** e **GitHub** no Supabase.

---

## ✅ **O que já está pronto no código:**

1. ✅ `oauthService.ts` - Serviço de OAuth
2. ✅ `AuthCallback.tsx` - Página de callback
3. ✅ `Login.tsx` - Botões de login social
4. ✅ Rota `/auth/callback` configurada

---

## 🚀 **Configuração no Dashboard do Supabase**

### **1. Google OAuth**

1. **Acesse o Google Cloud Console:**
   - https://console.cloud.google.com

2. **Crie um novo projeto (ou use existente)**

3. **Ative a Google+ API:**
   - Menu lateral → APIs & Services → Library
   - Procure por "Google+ API"
   - Clique em "Enable"

4. **Configure OAuth Consent Screen:**
   - Menu lateral → APIs & Services → OAuth consent screen
   - User Type: External
   - Preencha:
     - App name: `Gseed Works`
     - User support email: seu email
     - Developer contact: seu email
   - Scopes: email, profile, openid
   - Salvar

5. **Crie credenciais OAuth:**
   - Menu lateral → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: `Gseed Works Web`
   - Authorized redirect URIs:
     ```
     https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Clique em "Create"
   - **Copie o Client ID e Client Secret**

6. **Configure no Supabase:**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto
   - Authentication → Providers → Google
   - Cole o Client ID e Client Secret
   - Enabled: ON
   - Salvar

---

### **2. LinkedIn OAuth**

1. **Acesse LinkedIn Developers:**
   - https://www.linkedin.com/developers/apps

2. **Crie um novo app:**
   - Clique em "Create app"
   - App name: `Gseed Works`
   - LinkedIn Page: (sua empresa/página)
   - Preencha os demais campos
   - Aceite os termos
   - Clique em "Create app"

3. **Configure OAuth:**
   - Aba "Auth"
   - Authorized redirect URLs for your app:
     ```
     https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Salvar

4. **Obtenha as credenciais:**
   - Ainda na aba "Auth"
   - **Copie o Client ID**
   - **Copie o Client Secret**

5. **Configure no Supabase:**
   - Supabase Dashboard → Authentication → Providers → LinkedIn (OIDC)
   - Cole o Client ID e Client Secret
   - Enabled: ON
   - Salvar

---

### **3. GitHub OAuth**

1. **Acesse GitHub Settings:**
   - https://github.com/settings/developers

2. **Crie um OAuth App:**
   - Clique em "New OAuth App"
   - Application name: `Gseed Works`
   - Homepage URL: `https://gseed.com.br` (ou seu domínio)
   - Authorization callback URL:
     ```
     https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback
     ```
   - Clique em "Register application"

3. **Obtenha as credenciais:**
   - **Copie o Client ID**
   - Clique em "Generate a new client secret"
   - **Copie o Client Secret**

4. **Configure no Supabase:**
   - Supabase Dashboard → Authentication → Providers → GitHub
   - Cole o Client ID e Client Secret
   - Enabled: ON
   - Salvar

---

## 🔧 **URLs Importantes**

Substitua `[SEU-PROJECT-ID]` pelo ID do seu projeto Supabase:

- **Callback URL (para todos os provedores):**
  ```
  https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback
  ```

- **Site URL (local development):**
  ```
  http://localhost:3000
  ```

- **Site URL (production):**
  ```
  https://gseed.com.br
  ```

- **Redirect URLs (permitidas):**
  ```
  http://localhost:3000/auth/callback
  https://gseed.com.br/auth/callback
  ```

---

## 📝 **Configurações Adicionais no Supabase**

1. **Acesse:** Authentication → URL Configuration

2. **Site URL:**
   - Local: `http://localhost:3000`
   - Produção: `https://gseed.com.br`

3. **Redirect URLs (adicionar):**
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/perfil
   https://gseed.com.br/auth/callback
   https://gseed.com.br/dashboard
   https://gseed.com.br/perfil
   ```

---

## ✅ **Testando OAuth**

1. **Execute o projeto:**
   ```bash
   npm run dev
   ```

2. **Acesse:**
   ```
   http://localhost:3000/login
   ```

3. **Clique em um dos botões:**
   - "Continuar com Google"
   - "Continuar com LinkedIn"
   - "Continuar com GitHub"

4. **Faça login no provedor**

5. **Você deve ser redirecionado para:**
   - `/auth/callback` → processamento
   - `/dashboard` ou `/onboarding` → destino final

---

## 🐛 **Troubleshooting**

### **Erro: "redirect_uri_mismatch"**
- Verifique se a URL de callback está EXATAMENTE igual em todos os lugares
- Não esqueça o `https://`
- Certifique-se de que não há espaços ou barras extras

### **Erro: "access_denied"**
- Verifique se o OAuth consent screen está configurado
- Certifique-se de que os escopos estão corretos

### **Erro: "unauthorized_client"**
- Verifique se o Client ID e Secret estão corretos
- Certifique-se de que o OAuth app está ativo/publicado

### **Redirect não funciona:**
- Verifique a URL no código: `src/services/oauthService.ts`
- Deve ser: `${window.location.origin}/auth/callback`
- Verifique se a rota está no `App.tsx`

---

## 🎯 **Próximos Passos**

Após configurar OAuth:

1. ✅ Testar login com cada provedor
2. ✅ Verificar se dados são salvos no perfil
3. ✅ Implementar sincronização automática de dados do LinkedIn
4. ✅ Adicionar mais campos do perfil (cargo, bio, etc)

---

## 📚 **Referências**

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [LinkedIn OAuth](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)

---

**Feito! 🚀 Agora você tem login social completo no Gseed Works!**
