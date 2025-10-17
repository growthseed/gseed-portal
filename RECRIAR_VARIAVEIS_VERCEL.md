# GUIA: Configurar Variáveis de Ambiente no Vercel

## 🔒 IMPORTANTE: Segurança das Chaves

**NUNCA** commite chaves de API diretamente no código!
Configure-as APENAS no painel do Vercel.

---

## 📋 Variáveis Necessárias

### 1. Supabase
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### 2. Site URLs
```
VITE_SITE_URL
VITE_OAUTH_REDIRECT_URL
```

### 3. Cloudinary
```
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_API_KEY
VITE_CLOUDINARY_API_SECRET
VITE_CLOUDINARY_UPLOAD_PRESET
```

### 4. Brevo (Email)
```
VITE_BREVO_API_KEY
```

---

## 🚀 Como Configurar no Vercel

### Passo 1: Acessar Configurações
1. Vá para: https://vercel.com/seu-projeto
2. Clique em **Settings**
3. Clique em **Environment Variables**

### Passo 2: Adicionar Cada Variável
1. Clique em **Add New**
2. Preencha:
   - **Key**: Nome da variável (ex: VITE_SUPABASE_URL)
   - **Value**: Valor da chave (copie do seu painel Supabase/Cloudinary/Brevo)
   - **Environments**: Marque ✅ Production, Preview, Development
3. Clique em **Save**

### Passo 3: Redeploy
1. Vá para **Deployments**
2. Clique nos 3 pontinhos ⋮ do último deploy
3. Clique em **Redeploy**
4. Marque ✅ **Clear Build Cache**
5. Confirme

---

## 🔑 Onde Encontrar as Chaves

### Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings → API
4. Copie:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** → VITE_SUPABASE_ANON_KEY

### Cloudinary
1. Acesse: https://cloudinary.com/console
2. Dashboard
3. Copie as credenciais

### Brevo
1. Acesse: https://app.brevo.com
2. Settings → SMTP & API
3. Gere uma nova API key se necessário

---

## ⚠️ SE PRECISAR RESETAR

### Opção 1: Deletar e Recriar Uma por Uma
1. Settings → Environment Variables
2. Para cada variável:
   - Clique nos 3 pontinhos ⋮
   - Remove
   - Confirme
3. Adicione novamente seguindo o Passo 2 acima

### Opção 2: Usar Arquivo Local Temporário
Se você tem um backup local seguro:
1. Copie do arquivo `.env` local
2. Cole no Vercel manualmente
3. **NÃO COMMITE O .env!**

---

## ✅ Verificar se Funcionou

Após o redeploy:
1. Abra o site: https://portal.gseed.com.br
2. Abra DevTools (F12)
3. Console → Digite:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```
4. Deve mostrar a URL do Supabase

---

## 🛡️ Boas Práticas

- ✅ Configure variáveis APENAS no Vercel
- ✅ Use `.env.example` como template
- ✅ Adicione `.env*` no `.gitignore`
- ❌ NUNCA commite arquivos `.env` com chaves reais
- ❌ NUNCA exponha chaves em código público
- ❌ NUNCA compartilhe chaves em chat/email

---

**Última atualização:** 17/10/2025
